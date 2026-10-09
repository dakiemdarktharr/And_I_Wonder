import {test} from 'node:test';
import assert from 'node:assert/strict';
import {studyDates,validDate,researchBlock} from '../lib/learning-path';
import {gradePlacement,placementItems,numericAnswer} from '../lib/placement';
import {validateLearningRecord} from '../lib/research-evidence';
import {blackScholes,binomialCall,monteCarloCall,hedgePath,alphaBacktest,parseFrenchCSV,pairedBlockInterval,type MarketRow} from '../lib/quant-lab';
import {derivativesUnits} from '../content/derivatives-course';
import {checkpoints} from '../content/research-checkpoints';
import katex from 'katex';
const p={spot:100,strike:100,rate:.05,vol:.2,years:1};
test('personal schedules skip weekends and preserve a 523-session count across leap years',()=>{
 const dates=studyDates('2028-02-26',523);assert.equal(dates[0],'2028-02-28');assert.equal(dates[1],'2028-02-29');assert.equal(new Set(dates).size,523);assert.ok(dates.every(d=>![0,6].includes(new Date(d+'T12:00:00Z').getUTCDay())));assert.equal(validDate('2027-02-29'),false);assert.throws(()=>studyDates('invalid',523));
});
test('placement cannot average away a critical failure and accepts fractions without evaluating code',()=>{
 for(const form of ['A','B'] as const){const items=placementItems(form),answers=Object.fromEntries(items.map(q=>[q.id,String(q.answer)]));assert.ok(gradePlacement(form,answers).every(g=>g.ready));answers.a1='999';const result=gradePlacement(form,answers);assert.equal(result[0].score,3);assert.equal(result[0].ready,false);assert.ok(result.slice(1).every(g=>g.ready));}
 assert.equal(numericAnswer('1/3'),1/3);assert.equal(numericAnswer('0,25'),.25);assert.equal(numericAnswer('1/0'),null);assert.equal(numericAnswer('Math.random()'),null);
});
test('self-reported records cannot promote independent verification or accept unexpected project identifiers',()=>{
 const base={startDate:'2026-10-12',projects:{},independentVerification:'unverified'};assert.ok(validateLearningRecord(base));assert.equal(validateLearningRecord({...base,independentVerification:'verified'}),null);assert.equal(validateLearningRecord({...base,startDate:'2026-02-30'}),null);assert.equal(validateLearningRecord({...base,projects:{P99:{}}}),null);assert.equal(validateLearningRecord(null),null);
});
test('every scheduled research block has a topic and stays within its project, including the truncated last week',()=>{for(let w=1;w<=105;w++)for(let day=0;day<5;day++){const block=researchBlock(w,day);assert.ok(block.topic.vi&&block.topic.en&&block.phase.vi&&block.phase.en);assert.ok(block.stage.start<=w&&block.stage.end>=w);assert.equal(block.minutes,90);}});
test('BS agrees with an independent published analytic fixture and finite-difference Greeks',()=>{
 const x=blackScholes(p);assert.ok(Math.abs(x.call-10.4505835722)<.00002);assert.ok(Math.abs(x.put-5.5735260223)<.00002);assert.ok(Math.abs(x.delta-.6368306512)<.00001);
 const h=.01,up=blackScholes({...p,spot:100+h}).call,down=blackScholes({...p,spot:100-h}).call;
 assert.ok(Math.abs((up-down)/(2*h)-x.delta)<.00001);assert.ok(Math.abs((up-2*x.call+down)/(h*h)-x.gamma)<.00001);
 assert.equal(blackScholes({...p,years:0}).call,0);assert.equal(blackScholes({...p,spot:110,years:0}).call,10);assert.ok(Math.abs(blackScholes({...p,vol:0}).call-(100-100*Math.exp(-.05)))<1e-10);assert.throws(()=>blackScholes({...p,vol:-1}));
});
test('tree replication, invalid risk-neutral probabilities and antithetic SE have independent checks',()=>{
 assert.ok(Math.abs(binomialCall(p,400)-blackScholes(p).call)<.006);assert.throws(()=>binomialCall({...p,rate:.5,vol:.01},10));
 const mc=monteCarloCall(p,5000,42);assert.ok(Math.abs(mc.estimate-blackScholes(p).call)<4*mc.se);assert.deepEqual(mc,monteCarloCall(p,5000,42));assert.equal(monteCarloCall({...p,vol:0},100).se<1e-5,true);
 assert.ok(monteCarloCall(p,20000,42).se<mc.se*.6);
});
test('hedge cash ledger accrues interest and accounts for trades, cost and final liquidation',()=>{
 const {ledger,payoff,error}=hedgePath(p,52,10,42);for(let i=1;i<ledger.length;i++){const old=ledger[i-1],now=ledger[i];const change=now.delta-old.delta;const expected=old.cash*Math.exp(p.rate/52)-change*now.spot-.001*Math.abs(change)*now.spot;assert.ok(Math.abs(expected-now.cash)<1e-10);}assert.equal(ledger.at(-1)!.delta,0);assert.equal(error,ledger.at(-1)!.cash-payoff);assert.ok(hedgePath(p,52,0,42).error>=error);
});
const rows:MarketRow[]=Array.from({length:300},(_,i)=>({date:`${2000+Math.floor(i/12)}-${String(i%12+1).padStart(2,'0')}`,excess:.01+.04*Math.sin(i*.73),rf:.001}));
test('future data perturbation cannot alter earlier predictions, and costs cannot improve fixed-position net returns',()=>{
 const spec={lookback:3,lambda:1,costBps:0};const before=alphaBacktest(rows,spec),changed=structuredClone(rows);changed[225].excess=.8;const after=alphaBacktest(changed,spec);assert.deepEqual(before.points.slice(0,46).map(p=>p.prediction),after.points.slice(0,46).map(p=>p.prediction));
 const cost=alphaBacktest(rows,{...spec,costBps:100});assert.deepEqual(before.points.map(p=>p.position),cost.points.map(p=>p.position));assert.ok(cost.points.every((p,i)=>p.net<=before.points[i].net));assert.ok(before.points.every(p=>p.date<rows[240].date));assert.equal(alphaBacktest(rows,spec,'test').points[0].date,rows[240].date);
});
test('source CSV units are converted once, annual blocks excluded, duplicates and missing sentinels rejected',()=>{
 const csv=rows.map(r=>`${r.date.replace('-','')},${r.excess*100},0,0,${r.rf*100}`).join('\n');const parsed=parseFrenchCSV('Provider preamble\n,Mkt-RF,SMB,HML,RF\n'+csv+'\n\nAnnual Factors\n2000,9,0,0,1');assert.equal(parsed.length,300);assert.ok(Math.abs(parsed[0].excess-rows[0].excess)<1e-14);assert.equal(parsed[0].rf,.001);assert.throws(()=>parseFrenchCSV(csv+'\n'+csv.split('\n')[0]));assert.throws(()=>parseFrenchCSV(csv.replace('200001,1,','200001,-99.99,')));assert.throws(()=>parseFrenchCSV('200001,1,0,0,.1'));
});
test('paired block bootstrap respects exact constant differences and deterministic seeds',()=>{
 const points=alphaBacktest(rows,{lookback:3,lambda:1,costBps:10}).points.map(p=>({...p,net:p.benchmark+.01}));const interval=pairedBlockInterval(points);assert.ok(Math.abs(interval.lower-.01)<1e-12);assert.ok(Math.abs(interval.upper-.01)<1e-12);assert.deepEqual(interval,pairedBlockInterval(points));
});
test('derivatives unit formulas render and checkpoint forms provide concrete numeric fixtures',()=>{
 for(const unit of derivativesUnits)for(const lang of ['vi','en'] as const){const text=unit.lesson[lang];for(const match of text.matchAll(/\$\$([\s\S]*?)\$\$|\$([^$\n]+)\$/g))assert.doesNotThrow(()=>katex.renderToString(match[1]??match[2],{throwOnError:true}));assert.equal(unit.problems.length,4);}
 assert.equal(checkpoints('B').find(c=>c.id==='pricing')!.numeric[0].answer,.4);
});
