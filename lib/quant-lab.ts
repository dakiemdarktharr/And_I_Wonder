export type PriceInput={spot:number;strike:number;rate:number;vol:number;years:number};
function validate(p:PriceInput){if(!Object.values(p).every(Number.isFinite)||p.spot<=0||p.strike<=0||p.vol<0||p.years<0||p.years>30||Math.abs(p.rate)>1||p.vol>3)throw Error('Invalid pricing inputs');}
export function normalCDF(x:number){const a=Math.abs(x);const t=1/(1+.2316419*a);const tail=Math.exp(-a*a/2)/Math.sqrt(2*Math.PI)*t*(.319381530+t*(-.356563782+t*(1.781477937+t*(-1.821255978+t*1.330274429))));return x>=0?1-tail:tail;}
export function blackScholes(p:PriceInput){validate(p);const {spot:s,strike:k,rate:r,vol:v,years:t}=p;const discounted=k*Math.exp(-r*t);
 if(t===0||v===0){const call=Math.max(s-discounted,0);return {call,put:Math.max(discounted-s,0),delta:s>discounted?1:s<discounted?0:.5,gamma:0,vega:0};}
 const d1=(Math.log(s/k)+(r+v*v/2)*t)/(v*Math.sqrt(t)),d2=d1-v*Math.sqrt(t);const density=Math.exp(-d1*d1/2)/Math.sqrt(2*Math.PI);
 const call=s*normalCDF(d1)-discounted*normalCDF(d2);
 return {call,put:call-s+discounted,delta:normalCDF(d1),gamma:density/(s*v*Math.sqrt(t)),vega:s*density*Math.sqrt(t)};
}
export function binomialCall(p:PriceInput,steps:number){validate(p);if(!Number.isInteger(steps)||steps<1||steps>500)throw Error('Tree steps must be 1–500');if(p.years===0||p.vol===0)return blackScholes(p).call;
 const dt=p.years/steps,u=Math.exp(p.vol*Math.sqrt(dt)),d=1/u,q=(Math.exp(p.rate*dt)-d)/(u-d);if(q<0||q>1)throw Error('No-arbitrage condition fails: increase tree steps.');
 const values=Array.from({length:steps+1},(_,j)=>Math.max(p.spot*u**j*d**(steps-j)-p.strike,0));for(let n=steps-1;n>=0;n--)for(let j=0;j<=n;j++)values[j]=Math.exp(-p.rate*dt)*(q*values[j+1]+(1-q)*values[j]);return values[0];
}
export function seededRandom(seed:number){let state=seed>>>0;return ()=>{state=(Math.imul(1664525,state)+1013904223)>>>0;return (state+.5)/4294967296;};}
function gaussian(random:()=>number){return Math.sqrt(-2*Math.log(random()))*Math.cos(2*Math.PI*random());}
/** Each observation is a pair mean; the two antithetic legs are NOT independent. */
export function monteCarloCall(p:PriceInput,pairs=5000,seed=42){validate(p);if(!Number.isInteger(pairs)||pairs<2||pairs>100000)throw Error('Invalid pair count');const random=seededRandom(seed);let sum=0,squared=0;const discount=Math.exp(-p.rate*p.years);
 for(let i=0;i<pairs;i++){const z=gaussian(random),mu=(p.rate-p.vol*p.vol/2)*p.years,sigma=p.vol*Math.sqrt(p.years);const y=discount*(Math.max(p.spot*Math.exp(mu+sigma*z)-p.strike,0)+Math.max(p.spot*Math.exp(mu-sigma*z)-p.strike,0))/2;sum+=y;squared+=y*y;}
 const estimate=sum/pairs,se=Math.sqrt(Math.max(0,(squared-sum*sum/pairs)/(pairs-1))/pairs);return {estimate,se,lower:estimate-1.96*se,upper:estimate+1.96*se,pairs,seed};
}
export function hedgePath(p:PriceInput,steps=52,costBps=5,seed=42){validate(p);if(steps<1||steps>500||!Number.isInteger(steps)||costBps<0||costBps>1000)throw Error('Invalid hedge settings');const random=seededRandom(seed);const dt=p.years/steps;let spot=p.spot,delta=blackScholes(p).delta;let cost=Math.abs(delta)*spot*costBps/10000;let cash=blackScholes(p).call-delta*spot-cost;
 const ledger=[{step:0,spot,delta,cash,cost,value:cash+delta*spot}];
 for(let i=1;i<=steps;i++){cash*=Math.exp(p.rate*dt);spot*=Math.exp((p.rate-p.vol*p.vol/2)*dt+p.vol*Math.sqrt(dt)*gaussian(random));const next=i===steps?0:blackScholes({...p,spot,years:p.years-i*dt}).delta;cost=Math.abs(next-delta)*spot*costBps/10000;cash-=(next-delta)*spot+cost;delta=next;ledger.push({step:i,spot,delta,cash,cost,value:cash+delta*spot});}
 return {ledger,payoff:Math.max(spot-p.strike,0),error:cash-Math.max(spot-p.strike,0)};
}
export type MarketRow={date:string;excess:number;rf:number};
export function parseFrenchCSV(text:string):MarketRow[]{
 const rows:MarketRow[]=[];let started=false;
 for(const line of text.split(/\r?\n/)){const parts=line.split(',').map(s=>s.trim());if(!/^\d{6}$/.test(parts[0]??'')){if(started&&rows.length&&line.trim()!=='')break;continue;}started=true;
  const month=Number(parts[0].slice(4));if(month<1||month>12||parts.length<5)throw Error('Malformed monthly record');const excess=Number(parts[1]),rf=Number(parts[4]);
  if(!parts[1]||!parts[4]||!Number.isFinite(excess)||!Number.isFinite(rf)||excess<=-99||rf<=-99)throw Error('Missing or invalid return');
  const date=parts[0].slice(0,4)+'-'+parts[0].slice(4);if(rows.length&&date<=rows.at(-1)!.date)throw Error('Dates must be unique and ascending');
  rows.push({date,excess:excess/100,rf:rf/100});
 }
 if(rows.length<120)throw Error('At least 120 monthly observations required');return rows;
}
export type AlphaSpec={lookback:number;lambda:number;costBps:number};
export type AlphaPoint={date:string;prediction:number;position:number;actual:number;net:number;benchmark:number;equity:number;benchmarkEquity:number;turnover:number};
export function chronologicalSplit(count:number){if(count<120)throw Error('Insufficient data');return {trainEnd:Math.floor(count*.6),validationEnd:Math.floor(count*.8),end:count};}
/** Train once. Features for month t contain only months strictly before t. */
export function alphaBacktest(rows:MarketRow[],spec:AlphaSpec,partition:'validation'|'test'='validation'){
 if(!Number.isInteger(spec.lookback)||spec.lookback<1||spec.lookback>24||!Number.isFinite(spec.lambda)||spec.lambda<0||!Number.isFinite(spec.costBps)||spec.costBps<0||spec.costBps>1000)throw Error('Invalid alpha specification');
 const {trainEnd,validationEnd}=chronologicalSplit(rows.length),lag=spec.lookback;
 const feature=(i:number)=>rows.slice(i-lag,i).reduce((s,r)=>s+r.excess,0)/lag;
 const training=Array.from({length:trainEnd-lag},(_,j)=>({x:feature(j+lag),y:rows[j+lag].excess}));
 const mx=training.reduce((s,p)=>s+p.x,0)/training.length,my=training.reduce((s,p)=>s+p.y,0)/training.length;
 const sx=Math.sqrt(training.reduce((s,p)=>s+(p.x-mx)**2,0)/training.length)||1;
 const slope=training.reduce((s,p)=>s+(p.x-mx)/sx*(p.y-my),0)/(training.length*(1+spec.lambda));
 const begin=partition==='test'?validationEnd:trainEnd,end=partition==='test'?rows.length:validationEnd;let previous=0,equity=1,benchmarkEquity=1;
 const points:AlphaPoint[]=[];
 for(let i=begin;i<end;i++){const prediction=my+slope*(feature(i)-mx)/sx;const position=prediction>0?1:0;const turnover=Math.abs(position-previous)+(i===end-1?position:0); // include final liquidation
  const net=position*rows[i].excess+rows[i].rf-turnover*spec.costBps/10000,benchmark=rows[i].excess+rows[i].rf-((i===begin?1:0)+(i===end-1?1:0))*spec.costBps/10000;
  equity*=1+net;benchmarkEquity*=1+benchmark;points.push({date:rows[i].date,prediction,position,actual:rows[i].excess,net,benchmark,equity,benchmarkEquity,turnover});previous=position;}
 const mse=points.reduce((s,p)=>s+(p.prediction-p.actual)**2,0)/points.length,baselineMse=points.reduce((s,p)=>s+(my-p.actual)**2,0)/points.length;
 let peak=1,drawdown=0;for(const p of points){peak=Math.max(peak,p.equity);drawdown=Math.min(drawdown,p.equity/peak-1);}
 return {points,mse,baselineMse,drawdown,trainMean:my,slope,scale:sx,trainEnd,validationEnd};
}
export function pairedBlockInterval(points:AlphaPoint[],block=6,replicates=1000,seed=17){if(points.length<block||block<1||!Number.isInteger(block)||replicates<2)throw Error('Invalid bootstrap');const random=seededRandom(seed),diff=points.map(p=>p.net-p.benchmark);const samples:number[]=[];
 for(let b=0;b<replicates;b++){let sum=0,n=0;while(n<diff.length){const start=Math.floor(random()*diff.length);for(let j=0;j<block&&n<diff.length;j++,n++)sum+=diff[(start+j)%diff.length];}samples.push(sum/diff.length);}samples.sort((a,b)=>a-b);return {mean:diff.reduce((a,b)=>a+b,0)/diff.length,lower:samples[Math.floor(.025*replicates)],upper:samples[Math.min(replicates-1,Math.floor(.975*replicates))],block};
}
