import { MongoClient, type Db } from "mongodb";

type MongoCache = {
  client?: MongoClient;
  clientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & { __andIWonderMongo?: MongoCache };
const cache = (globalMongo.__andIWonderMongo ??= {});

/** Public diagnostics are fixed categories; never return driver messages or URIs. */
export function storageFailureCode(error:unknown):string{
 const e=error as {name?:string;message?:string;code?:string|number};
 if(e?.code===18||/authentication failed|bad auth/i.test(e?.message||''))return 'DB_AUTH_FAILED';
 if(/not configured/i.test(e?.message||''))return 'DB_NOT_CONFIGURED';
 if(e?.name==='MongoParseError'||e?.name==='MongoInvalidArgumentError')return 'DB_URI_INVALID';
 if(e?.code==='ENOTFOUND'||/querySrv|ENOTFOUND/i.test(e?.message||''))return 'DB_DNS_FAILED';
 if(e?.name==='MongoServerSelectionError'||/timed out|ECONNREFUSED/i.test(e?.message||''))return 'DB_CONNECTION_FAILED';
 if(e?.code===13)return 'DB_PERMISSION_DENIED';
 return 'DB_UNAVAILABLE';
}

/** Return the configured database or fail closed when MongoDB is unavailable. */
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!cache.clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5_000 });
    cache.client = client;
    cache.clientPromise = client.connect().catch((error: unknown) => {
      cache.client = undefined;
      cache.clientPromise = undefined;
      throw error;
    });
  }

  const client = await cache.clientPromise;
  return client.db(process.env.MONGODB_DB || "and_i_wonder");
}
