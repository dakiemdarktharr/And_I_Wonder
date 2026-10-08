import { MongoClient, type Db } from "mongodb";

type MongoCache = {
  client?: MongoClient;
  clientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & { __andIWonderMongo?: MongoCache };
const cache = (globalMongo.__andIWonderMongo ??= {});

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
