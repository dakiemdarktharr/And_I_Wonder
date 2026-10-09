import {getOwnerSession,isSameOrigin,jsonError} from '@/lib/auth';
import {getDb} from '@/lib/db';
import {validateLearningRecord} from '@/lib/research-evidence';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const reply=(body:unknown,status=200)=>Response.json(body,{status,headers:{'Cache-Control':'no-store'}});
export async function GET(request:Request){
 if(!await getOwnerSession(request))return jsonError('Owner access required.',401);
 try{const db=await getDb();const record=await db.collection('learning_records').findOne({_id:'owner' as never});return reply({record:record?.record??null,revision:record?.revision??0});}catch{return reply({error:'Record unavailable.'},503);}
}
export async function PUT(request:Request){
 if(!isSameOrigin(request))return jsonError('Same-origin request required.',403);
 if(!await getOwnerSession(request))return jsonError('Owner access required.',401);
 let value:unknown;try{const raw=await request.text();if(raw.length>280000)return jsonError('Record too large.',413);value=JSON.parse(raw);}catch{return jsonError('Invalid JSON.',400);}
 const body=value as {record?:unknown;revision?:unknown};const record=validateLearningRecord(body?.record);
 if(!record||!Number.isSafeInteger(body.revision)||Number(body.revision)<0)return jsonError('Invalid record.',400);
 try{const db=await getDb();const collection=db.collection('learning_records');
  // A fixed _id enforces uniqueness. Compare-and-swap prevents silent lost edits.
  if(body.revision===0){try{await collection.insertOne({_id:'owner' as never,record,revision:1,updatedAt:new Date()});return reply({revision:1});}catch(e){if((e as {code?:number}).code===11000)return reply({error:'Record changed. Reload before saving.'},409);throw e;}}
  const result=await collection.updateOne({_id:'owner' as never,revision:body.revision},{$set:{record,updatedAt:new Date()},$inc:{revision:1}});
  return result.matchedCount?reply({revision:Number(body.revision)+1}):reply({error:'Record changed. Reload before saving.'},409);
 }catch{return reply({error:'Record could not be saved.'},503);}
}
