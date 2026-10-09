import {createHash} from 'node:crypto';
import {frenchZipCSV} from '@/lib/french-data';
import {parseFrenchCSV} from '@/lib/quant-lab';
export const runtime='nodejs';
export const dynamic='force-dynamic';
const SOURCE='https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/ftp/F-F_Research_Data_Factors_CSV.zip';
export async function GET(){try{
 const response=await fetch(SOURCE,{next:{revalidate:86400},signal:AbortSignal.timeout(12000),redirect:'error'});
 if(!response.ok||!response.body)throw Error('Provider unavailable');const reader=response.body.getReader();const chunks:Uint8Array[]=[];let length=0;
 while(true){const {value,done}=await reader.read();if(done)break;length+=value.length;if(length>2_000_000){await reader.cancel();throw Error('Oversized response');}chunks.push(value);}
 const csv=frenchZipCSV(Buffer.concat(chunks)),rows=parseFrenchCSV(csv);
 return Response.json({rows,manifest:{provider:'Kenneth R. French Data Library',url:SOURCE,sha256:createHash('sha256').update(csv).digest('hex'),servedAt:new Date().toISOString(),cacheMaxAgeHours:24,first:rows[0].date,last:rows.at(-1)!.date,observations:rows.length,units:'decimal monthly returns; original CSV values divided by 100',limitation:'Revised aggregate factor returns, not a point-in-time stock universe. Provider switched FIZ to CIZ in January 2025.'}},{headers:{'Cache-Control':'public, max-age=3600'}});
 }catch{return Response.json({error:'Free provider data are temporarily unavailable. Retry later; no synthetic data were substituted.'},{status:503});}}
