import { MongoClient, type Db } from "mongodb";

type MongoCache = {
  client?: MongoClient;
  clientPromise?: Promise<MongoClient>;
};

const globalMongo = globalThis as typeof globalThis & { __andIWonderMongo?: MongoCache };
const cache = (globalMongo.__andIWonderMongo ??= {});

/** Public diagnostics are fixed categories; never return driver messages or URIs. */
export function storageFailureCode(error:unknown):string{
 type DriverError={name?:string;message?:string;code?:string|number;cause?:unknown;reason?:{servers?:Map<unknown,{error?:unknown}>}};
 const pending:unknown[]=[error];const seen=new Set<unknown>();const errors:DriverError[]=[];
 while(pending.length&&errors.length<20){const current=pending.pop();if(!current||typeof current!=='object'||seen.has(current))continue;seen.add(current);const e=current as DriverError;errors.push(e);if(e.cause)pending.push(e.cause);if(e.reason?.servers instanceof Map)for(const server of e.reason.servers.values())if(server.error)pending.push(server.error);}
 const messages=errors.map(e=>e.message||'').join(' ');
 if(errors.some(e=>e.code===18)||/authentication failed|bad auth/i.test(messages))return 'DB_AUTH_FAILED';
 if(/not configured/i.test(messages))return 'DB_NOT_CONFIGURED';
 if(errors.some(e=>e.name==='MongoParseError'||e.name==='MongoInvalidArgumentError'))return 'DB_URI_INVALID';
 if(errors.some(e=>e.code==='ENOTFOUND')||/querySrv|ENOTFOUND/i.test(messages))return 'DB_DNS_FAILED';
 if(/TLS|SSL|certificate/i.test(messages))return 'DB_TLS_FAILED';
 if(errors.some(e=>e.code===13))return 'DB_PERMISSION_DENIED';
 if(errors.some(e=>e.name==='MongoServerSelectionError')||/timed out|ECONNREFUSED/i.test(messages))return 'DB_CONNECTION_FAILED';
 return 'DB_UNAVAILABLE';
}

/** Return the configured database or fail closed when MongoDB is unavailable. */
export async function getDb(): Promise<Db> {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is not configured");

  if (!cache.clientPromise) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 15_000 });
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
