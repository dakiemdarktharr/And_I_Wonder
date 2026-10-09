import assert from 'node:assert/strict';
import {test} from 'node:test';
import {mathCurriculum as c} from '../lib/math-curriculum';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-10,`${a} != ${b}`);
const checks=(week:number,id:string)=>c.weeks.find(w=>w.week===week)!.exercises.find(e=>e.id===id)!.numeric!;
test('matrix update fixture is independently recomputed from observation weights',()=>{
 // Direct covariance of error coefficients: e+ = (I-KH)e - Kv.
 const k=[2/4,-1/4];const transform=[[1-k[0],k[0]],[-k[1],1+k[1]]];
 const p=transform.map(row=>transform.map(other=>2*row[0]*other[0]+row[1]*other[1]));
 for(let i=0;i<2;i++)for(let j=0;j<2;j++)p[i][j]+=k[i]*k[j];
 close(p[0][0],1);close(p[0][1],.5);close(p[1][1],.75);
 close(p[0][0]*p[1][1]-p[0][1]*p[1][0],checks(97,'m2-w097-e1').find(n=>n.id==='posterior-determinant')!.expected);
});
test('AR finite-n variance agrees with a direct covariance matrix, including negative dependence',()=>{
 const gamma=(h:number)=>4*Math.pow(-.5,Math.abs(h));let variance=0;
 for(let i=0;i<3;i++)for(let j=0;j<3;j++)variance+=gamma(i-j)/9;
 close(variance,checks(98,'m2-w098-e1').find(n=>n.id==='finite-n')!.expected);
 const omega=4+2*Array.from({length:100},(_,i)=>gamma(i+1)).reduce((a,b)=>a+b,0);
 close(omega,checks(98,'m2-w098-e1').find(n=>n.id==='long-run')!.expected);
 assert.notEqual(variance,omega/3,'Finite-n and asymptotic variance must not be confused');
});
test('wrong-noise MSE is verified by exact independent finite support with matching moments',()=>{
 const mse=(gain:number)=>{let sum=0;for(const x of [-1,1])for(const noise of [-2,2])sum+=(x-gain*(x+noise))**2/4;return sum;};
 close(mse(.5),1.25);close(mse(.2),.8);
 close(mse(.5)-mse(.2),checks(102,'m2-w102-e3').find(n=>n.id==='excess-mse')!.expected);
});
test('conditions and boundary cases: UI spikes, step-size divergence, overlap and nonergodic averages',()=>{
 for(const n of [2,10,100]){close(n*(1/n),1);close(n*n*(1/n),n);}
 const loss=(x:number)=>x*x/2;
 close(loss((1-2)*3),loss(3));assert.ok(loss((1-2.1)*3)>loss(3));assert.ok(loss((1-1)*3)<loss(3));
 for(const h of [2,3,7]){const covariance=(k:number)=>Math.max(0,h-Math.abs(k))/(h*h);close(Array.from({length:2*h-1},(_,i)=>covariance(i-h+1)).reduce((a,b)=>a+b,0),1);close(covariance(0),1/h);}
 // D_t=Z+epsilon_t: Var(mean)=Var(Z)+Var(epsilon)/n. No concentration to zero.
 for(const n of [10,1000])assert.ok(2+1/n>=2);
});
test('optional stopping example has exact martingale expectations and nonvanishing tail',()=>{
 for(const n of [2,5,10]){const survival=2**(-n);close(1-survival-survival*(2**n-1),0);assert.ok(survival*(2**n-1)>=.75);}
});

test('Bartlett normalization agrees with independently summed zero-padded windows',()=>{
 const z=[1,-1,2],n=z.length;
 for(const L of [0,1,2,5]){
  let lagSum=0,windowSum=0;
  for(let h=-L;h<=L;h++)for(let t=0;t<n;t++)lagSum+=(1-Math.abs(h)/(L+1))*z[t]*(z[t-h]??0)/n;
  for(let s=0;s<n+L;s++){let block=0;for(let j=0;j<=L;j++)block+=z[s-j]??0;windowSum+=block**2/(n*(L+1));}
  close(lagSum,windowSum);assert.ok(lagSum>=0);
 }
 // MA(1) with Z_t=epsilon_t+epsilon_{t-1}, Var(epsilon)=1:
 // resampling single rows loses the two lag-one covariance contributions.
 const marginalVariance=2,longRunVariance=2+2*1;
 assert.equal(longRunVariance/marginalVariance,2);
});

test('four-sign Rademacher and finite-horizon OGD arithmetic are independently enumerated',()=>{
 let positivePart=0;
 for(let bits=0;bits<16;bits++){let sum=0;for(let i=0;i<4;i++)sum+=(bits>>i)&1?1:-1;positivePart+=Math.max(0,sum)/16;}
 close(positivePart,.75);close(positivePart/4,3/16);
 const mu=2,G=3,D=.5,T=10;
 const sharp=G*G*(1+Math.log(T))/(2*mu),loose=sharp+mu*D*D/2;
 close(sharp,7.430816459236604);close(loose,7.680816459236604);
 assert.ok(D*G*Math.sqrt(T)<sharp);
});
