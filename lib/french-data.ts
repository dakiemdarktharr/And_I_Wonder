import {inflateRawSync} from 'node:zlib';
/** Bounded extraction of one CSV from the provider ZIP; not a general upload parser. */
export function frenchZipCSV(zip:Buffer):string{
 if(zip.length>2_000_000)throw Error('Archive too large');let end=-1;
 for(let p=zip.length-22;p>=Math.max(0,zip.length-65557);p--)if(zip.readUInt32LE(p)===0x06054b50){end=p;break;}
 if(end<0)throw Error('Invalid ZIP');let pos=zip.readUInt32LE(end+16);const count=zip.readUInt16LE(end+10);
 if(count>10)throw Error('Unexpected archive');
 for(let i=0;i<count;i++){
  if(pos+46>zip.length||zip.readUInt32LE(pos)!==0x02014b50)throw Error('Invalid directory');
  const flags=zip.readUInt16LE(pos+8),method=zip.readUInt16LE(pos+10),compressed=zip.readUInt32LE(pos+20),size=zip.readUInt32LE(pos+24),nameLength=zip.readUInt16LE(pos+28),extra=zip.readUInt16LE(pos+30),comment=zip.readUInt16LE(pos+32),offset=zip.readUInt32LE(pos+42);
  const name=zip.subarray(pos+46,pos+46+nameLength).toString();pos+=46+nameLength+extra+comment;
  if(!/\.csv$/i.test(name))continue;
  if(flags&1||size>5_000_000||offset+30>zip.length||zip.readUInt32LE(offset)!==0x04034b50)throw Error('Unsupported CSV entry');
  const start=offset+30+zip.readUInt16LE(offset+26)+zip.readUInt16LE(offset+28);if(start+compressed>zip.length)throw Error('Truncated entry');const bytes=zip.subarray(start,start+compressed);const raw=method===0?bytes:method===8?inflateRawSync(bytes,{maxOutputLength:5_000_000}):null;
  if(!raw||raw.length!==size)throw Error('Invalid CSV size');return raw.toString('utf8');
 }
 throw Error('No CSV in provider archive');
}
