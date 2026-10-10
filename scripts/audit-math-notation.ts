import fs from 'node:fs';
import katex from 'katex';
import {normalizeMathNotation} from '../lib/math-notation';
const c=JSON.parse(fs.readFileSync('data/math-v2/curriculum.json','utf8'));
const seen=new Set<string>();let count=0;const errors:any[]=[];
function walk(v:any){if(typeof v==='string'){if(seen.has(v))return;seen.add(v);let n=normalizeMathNotation(v);for(const m of n.matchAll(/(?<!\$)\$([^$\n]+)\$(?!\$)/g)){count++;try{katex.renderToString(m[1],{throwOnError:true,strict:'ignore'});}catch(e){errors.push({input:v,formula:m[1],error:String(e)});}}}else if(v&&typeof v==='object')Object.values(v).forEach(walk);}
walk(c);for(const file of fs.readdirSync('data').filter(n=>/^lessons-.*\.json$/.test(n)))walk(JSON.parse(fs.readFileSync('data/'+file,'utf8')));fs.mkdirSync('artifacts',{recursive:true});fs.writeFileSync('artifacts/notation-audit.json',JSON.stringify({count,errors},null,2));console.log({count,errors:errors.length});console.log(errors.slice(0,7));

if(errors.length)process.exitCode=1;
