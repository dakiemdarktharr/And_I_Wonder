import { createHash, timingSafeEqual } from "node:crypto";
import tls from "node:tls";
import { MongoClient } from "mongodb";
import { storageFailureCode } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

// Temporary, expiring, bearer-protected read-only diagnostic. Removed after use.
const tokenHash = "21b2f88b27e5220defe020a1c49302cbda370c159af4d36d39180ce90bc13605";
const expiresAt = 1791465876683;
const host = "ac-efwbvij-shard-00-00.d5g4ybe.mongodb.net";

function tlsProbe(maxVersion?: "TLSv1.2"): Promise<object> {
  return new Promise(resolve => {
    const socket = tls.connect({ host, port: 27017, servername: host, rejectUnauthorized: true, maxVersion });
    let done = false;
    const finish = (result: object) => { if (done) return; done = true; socket.destroy(); resolve(result); };
    socket.setTimeout(7000, () => finish({ ok: false, code: "TIMEOUT" }));
    socket.once("secureConnect", () => finish({ ok: true, authorized: socket.authorized, protocol: socket.getProtocol() }));
    socket.once("error", error => finish({ ok: false, code: storageFailureCode(error) }));
  });
}

async function mongoProbe(uri: string | undefined): Promise<object> {
  if (!uri) return { ok: false, code: "DB_NOT_CONFIGURED" };
  let client: MongoClient | undefined;
  try {
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000, connectTimeoutMS: 7000, maxPoolSize: 1 });
    await client.connect();
    const result = await client.db("admin").command({ hello: 1 });
    return { ok: result.ok === 1, hasPrimary: !!result.primary };
  } catch (error) {
    return { ok: false, code: storageFailureCode(error) };
  } finally {
    await client?.close();
  }
}

export async function GET(request: Request) {
  const hash = createHash("sha256").update(request.headers.get("authorization") || "").digest();
  if (Date.now() > expiresAt || !timingSafeEqual(hash, Buffer.from(tokenHash, "hex"))) {
    return new Response(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  const uri = process.env.MONGODB_URI;
  let configuration: object = { parseable: false };
  try {
    const client = new MongoClient(uri || "");
    const options = client.options;
    configuration = {
      parseable: true,
      matchesExpectedCluster: !!options.srvHost?.endsWith(".d5g4ybe.mongodb.net") || options.hosts.some(h => h.host?.endsWith(".d5g4ybe.mongodb.net")),
      srv: !!options.srvHost,
      tls: options.tls,
      verifiesCertificates: !options.tlsAllowInvalidCertificates && !options.tlsInsecure,
      hasCredentials: !!options.credentials,
      hasProxy: !!options.proxyHost,
      customServername: !!options.servername,
    };
    await client.close();
  } catch { /* Return a fixed category, never connection strings or messages. */ }
  const referenceUri = `mongodb://${[0, 1, 2].map(i => `ac-efwbvij-shard-00-0${i}.d5g4ybe.mongodb.net:27017`).join(",")}/?replicaSet=atlas-rcnxy6-shard-0&tls=true`;
  const [tlsDefault, tls12, referenceMongo, configuredMongo] = await Promise.all([
    tlsProbe(), tlsProbe("TLSv1.2"), mongoProbe(referenceUri), mongoProbe(uri),
  ]);
  return Response.json({ node: process.version, openssl: process.versions.openssl, configuration, tlsDefault, tls12, referenceMongo, configuredMongo }, { headers: { "Cache-Control": "no-store" } });
}
