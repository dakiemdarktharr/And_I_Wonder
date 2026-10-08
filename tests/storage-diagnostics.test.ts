import {test} from 'node:test';
import assert from 'node:assert/strict';
import {storageFailureCode} from '../lib/db';

test('storage diagnostics classify failures without exposing credentials or driver messages',()=>{
 assert.equal(storageFailureCode({code:18,message:'secret-password'}),'DB_AUTH_FAILED');
 assert.equal(storageFailureCode({name:'MongoParseError',message:'mongodb+srv://user:secret@host'}),'DB_URI_INVALID');
 assert.equal(storageFailureCode({code:'ENOTFOUND',message:'private-host'}),'DB_DNS_FAILED');
 assert.equal(storageFailureCode({name:'MongoServerSelectionError'}),'DB_CONNECTION_FAILED');
 assert.equal(storageFailureCode({name:'MongoServerSelectionError',reason:{servers:new Map([['hidden-host',{error:{cause:{message:'TLS alert internal error'}}}]])}}),'DB_TLS_FAILED');
 assert.equal(storageFailureCode({code:13}),'DB_PERMISSION_DENIED');
 assert.equal(storageFailureCode(null),'DB_UNAVAILABLE');
 assert.equal(storageFailureCode({message:'unexpected-sensitive-message'}),'DB_UNAVAILABLE');
});
