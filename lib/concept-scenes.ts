export type SceneKind='secant'|'cubic'|'kink'|'epsilon'|'power'|'bayes'|'binomial'|'cauchy'|'simplex'|'curvature'|'threshold'|'descent'|'spectrum'|'gaussian'|'risk'|'ridge'|'information';
export type Point=[number,number];
export type Scene={bounds:[number,number,number,number];series:{name:string;points:Point[];dashed?:boolean;dots?:boolean}[];markers?:{name:string;point:Point;open?:boolean}[];polygon?:Point[];readout:Record<string,number>;formula:string};
export const sceneControls:Record<SceneKind,{symbol:string;min:number;max:number;step:number;initial:number}>={
 secant:{symbol:'h',min:-.5,max:.5,step:.01,initial:.1},
 cubic:{symbol:'h',min:-.5,max:.5,step:.01,initial:.2},
 kink:{symbol:'h',min:-1,max:1,step:.02,initial:.5},
 epsilon:{symbol:'\\varepsilon',min:.05,max:1,step:.05,initial:.25},
 power:{symbol:'n',min:1,max:100,step:1,initial:5},
 bayes:{symbol:'p',min:.001,max:.3,step:.001,initial:.01},
 binomial:{symbol:'p',min:0,max:1,step:.02,initial:.4},
 cauchy:{symbol:'c',min:-3,max:3,step:.05,initial:.5},
 simplex:{symbol:'t',min:0,max:1,step:.01,initial:.5},
 curvature:{symbol:'a',min:-2,max:3,step:.1,initial:2},
 threshold:{symbol:'\\lambda',min:0,max:3,step:.05,initial:.5},
 descent:{symbol:'\\eta',min:0,max:2.4,step:.05,initial:2.2},
 spectrum:{symbol:'\\theta',min:-1,max:1,step:.05,initial:.5},
 gaussian:{symbol:'R',min:.1,max:8,step:.1,initial:1},
 risk:{symbol:'k',min:0,max:1,step:.01,initial:.5},
 ridge:{symbol:'\\lambda',min:0,max:20,step:.1,initial:1},
 information:{symbol:'\\rho',min:-.99,max:.99,step:.01,initial:.6},
};
const curve=(f:(x:number)=>number,lo:number,hi:number,n=160):Point[]=>Array.from({length:n+1},(_,i)=>{const x=lo+(hi-lo)*i/n;return[x,f(x)];});
export const sceneNumber=(x:number)=>Number(x.toFixed(5));
export function binomialPmf(n:number,p:number):Point[]{
 return Array.from({length:n+1},(_,k)=>{let choose=1;for(let j=1;j<=k;j++)choose*=(n-j+1)/j;return[k,choose*p**k*(1-p)**(n-k)];});
}
/** Analytic models, no eval or heuristic week-index mapping. */
export function conceptScene(kind:SceneKind,v:number):Scene{
 const c=sceneControls[kind];if(!Number.isFinite(v)||v<c.min-1e-9||v>c.max+1e-9)throw new RangeError('Parameter outside scene domain');
 if(kind==='secant'||kind==='cubic'||kind==='kink'){
  const a=kind==='secant'?1:kind==='cubic'?-2:0;
  const f=kind==='secant'?(x:number)=>(3*x-2)**2/2:kind==='cubic'?(x:number)=>x**3:Math.abs;
  const derivative=kind==='secant'?3:kind==='cubic'?12:NaN;
  const slope=kind==='secant'?3+4.5*v:kind==='cubic'?12-6*v+v*v:v===0?NaN:Math.sign(v);
  const radius=kind==='kink'?1.1:.65,lo=a-radius,hi=a+radius;
  const series:Scene['series']=[{name:'f',points:curve(f,lo,hi)}];
  if(Number.isFinite(derivative))series.push({name:'tangent',points:curve(x=>f(a)+derivative*(x-a),lo,hi),dashed:true});
  if(v!==0)series.push({name:'secant',points:curve(x=>f(a)+slope*(x-a),lo,hi)});
  const ys=series.flatMap(s=>s.points.map(p=>p[1]));
  return{bounds:[lo,hi,Math.min(...ys)-.3,Math.max(...ys)+.3],series,markers:[{name:'A',point:[a,f(a)]},...(v===0?[]:[{name:'B',point:[a+v,f(a+v)] as Point}])],readout:{h:v,...(v!==0?{slope}:{}),...(Number.isFinite(derivative)?{derivative}:{})},formula:kind==='secant'?'f(x)=\\tfrac12(3x-2)^2,\\quad m_h=3+\\tfrac92h\\ (h\\ne0)':kind==='cubic'?'f(x)=x^3,\\quad m_h=12-6h+h^2\\ (a=-2,\\ h\\ne0)':'f(x)=|x|,\\quad m_h=\\operatorname{sgn}(h)\\ (h\\ne0)'};
 }
 if(kind==='epsilon'){
  const N=Math.floor(2/v)+1,end=Math.max(12,N+10);
  return{bounds:[1,end,0,2.2],series:[{name:'sequence',points:curve(n=>2/n,1,end,end-1),dots:true},{name:'tolerance',points:[[1,v],[end,v]],dashed:true}],markers:[{name:'N',point:[N,2/N]}],readout:{epsilon:v,N,error:2/N},formula:'a_n=\\frac2n,\\quad N=\\lfloor2/\\varepsilon\\rfloor+1,\\quad n\\ge N\\Rightarrow a_n<\\varepsilon'};
 }
 if(kind==='power'){
  const n=Math.round(v),x=2**(-1/n);
  return{bounds:[0,1,0,1.05],series:[{name:'fn',points:curve(x=>x**n,0,1,300)},{name:'limit',points:[[0,0],[1,0]],dashed:true}],markers:[{name:'witness',point:[x,.5]},{name:'f(1)',point:[1,1]},{name:'limit-hole',point:[1,0],open:true}],readout:{n,x,error:.5,supremum:1,endpointError:0},formula:'f_n(x)=x^n,\\quad x_n=2^{-1/n}<1,\\quad |f_n(x_n)-f(x_n)|=\\tfrac12'};
 }
 if(kind==='bayes'){
  const q=(p:number)=>.9*p/(.9*p+.05*(1-p));
  return{bounds:[0,.3,0,1],series:[{name:'posterior',points:curve(q,0,.3)},{name:'prior',points:[[0,0],[.3,.3]],dashed:true}],markers:[{name:'posterior',point:[v,q(v)]}],readout:{prior:v,truePositive:10000*.9*v,falsePositive:10000*.05*(1-v),posterior:q(v)},formula:'P(D\\mid+)=\\frac{0.9p}{0.9p+0.05(1-p)}'};
 }
 if(kind==='binomial'){
  const points=binomialPmf(25,v);
  return{bounds:[0,25,0,Math.max(.25,...points.map(p=>p[1]))*1.12],series:[{name:'pmf',points,dots:true}],readout:{p:v,mean:25*v,variance:25*v*(1-v),SE:Math.sqrt(v*(1-v)/25)},formula:'S\\sim\\operatorname{Bin}(25,p),\\quad E S=25p,\\quad\\operatorname{Var}(S)=25p(1-p)'};
 }
 if(kind==='cauchy'){
  const dot=v+2,bound=Math.sqrt(5)*Math.hypot(v,1);
  return{bounds:[-96/23,96/23,-1,3],series:[{name:'u',points:[[0,0],[1,2]]},{name:'v',points:[[0,0],[v,1]]}],markers:[{name:'u',point:[1,2]},{name:'v',point:[v,1]}],readout:{c:v,absoluteDot:Math.abs(dot),normProduct:bound,gap:bound-Math.abs(dot)},formula:'u=(1,2),\\quad v=(c,1),\\quad |u^Tv|\\le\\|u\\|\\|v\\|'};
 }
 if(kind==='simplex'){
  const a:Point=[.1,.2],b:Point=[.8,.1],z:Point=[(1-v)*a[0]+v*b[0],(1-v)*a[1]+v*b[1]];
  return{bounds:[.5-.6*48/23,.5+.6*48/23,-.1,1.1],polygon:[[0,0],[1,0],[0,1]],series:[{name:'segment',points:[a,b]}],markers:[{name:'x',point:a},{name:'y',point:b},{name:'z',point:z}],readout:{t:v,z1:z[0],z2:z[1],sum:z[0]+z[1]},formula:'z=(1-t)x+ty,\\quad x=(0.1,0.2),\\quad y=(0.8,0.1)'};
 }
 if(kind==='curvature'){
  return{bounds:[-2,2,-12,10],series:[{name:'x-section',points:curve(u=>u*u-3,-2,2)},{name:'y-section',points:curve(u=>v*u*u-3,-2,2),dashed:true}],readout:{a:v,eigenvalue1:2,eigenvalue2:2*v,convex:v>=0?1:0},formula:'f_a(x,y)=(x-1)^2+a(y+1)^2-3,\\quad H=\\operatorname{diag}(2,2a)'};
 }
 if(kind==='threshold'){
  const soft=(z:number)=>Math.sign(z)*Math.max(0,Math.abs(z)-v);
  return{bounds:[-3,3,-3,3],series:[{name:'identity',points:[[-3,-3],[3,3]],dashed:true},{name:'threshold',points:curve(soft,-3,3)}],markers:[2.7,.4,-1.2].map((z,i)=>({name:String(i+1),point:[z,soft(z)]})),readout:{lambda:v,beta1:soft(2.7),beta2:soft(.4),beta3:soft(-1.2)},formula:'S_\\lambda(z)=\\operatorname{sgn}(z)\\max\\{|z|-\\lambda,0\\}'};
 }
 if(kind==='descent'){
  const points:Point[]=Array.from({length:13},(_,k)=>[k,(1-v)**k]),extent=Math.max(1.1,...points.map(p=>Math.abs(p[1])));
  return{bounds:[0,12,-extent,extent],series:[{name:'iterate',points,dots:true}],readout:{eta:v,x1:1-v,x2:(1-v)**2,f1:(1-v)**2/2,f2:(1-v)**4/2},formula:'f(x)=\\tfrac12x^2,\\quad x_0=1,\\quad x_k=(1-\\eta)^k'};
 }
 if(kind==='spectrum'){
  const f=(w:number)=>4*(1+v*v+2*v*Math.cos(w))/(2*Math.PI);
  return{bounds:[-Math.PI,Math.PI,0,2.65],series:[{name:'density',points:curve(f,-Math.PI,Math.PI,240)}],readout:{theta:v,f0:f(0),fPi:f(Math.PI),variance:4*(1+v*v),LRV:4*(1+v)**2},formula:'X_t=\\epsilon_t+\\theta\\epsilon_{t-1},\\quad f(\\omega)=\\frac4{2\\pi}(1+\\theta^2+2\\theta\\cos\\omega)'};
 }
 if(kind==='gaussian'){
  const gain=4/(4+v),mean=2+gain*3,variance=4*v/(4+v);
  const normal=(x:number,m:number,p:number)=>Math.exp(-((x-m)**2)/(2*p))/Math.sqrt(2*Math.PI*p);
  return{bounds:[-4,10,0,1.4],series:[{name:'prior',points:curve(x=>normal(x,2,4),-4,10)},{name:'posterior',points:curve(x=>normal(x,mean,variance),-4,10)}],readout:{R:v,K:gain,mean,variance},formula:'X\\sim N(2,4),\\quad Y=X+V=5,\\quad V\\sim N(0,R),\\quad V\\perp X'};
 }
 if(kind==='risk'){
  const risk=(k:number)=>(1-k)**2+4*k*k;
  return{bounds:[0,1,0,4.2],series:[{name:'risk',points:curve(risk,0,1)}],markers:[{name:'chosen',point:[v,risk(v)]},{name:'optimal',point:[.2,.8]}],readout:{k:v,MSE:risk(v),excess:risk(v)-.8},formula:'\\operatorname{MSE}(k)=(1-k)^2+4k^2=\\tfrac45+5(k-\\tfrac15)^2'};
 }
 if(kind==='ridge'){
  const df=(l:number)=>9/(9+l)+1/(1+l);
  return{bounds:[0,20,0,2.1],series:[{name:'df',points:curve(df,0,20)}],markers:[{name:'df',point:[v,df(v)]}],readout:{lambda:v,df:df(v)},formula:'\\operatorname{df}(\\lambda)=\\frac9{9+\\lambda}+\\frac1{1+\\lambda}'};
 }
 const info=(rho:number)=>-.5*Math.log1p(-rho*rho);
 return{bounds:[-.99,.99,0,2.1],series:[{name:'information',points:curve(info,-.99,.99)}],markers:[{name:'I',point:[v,info(v)]}],readout:{rho:v,information:info(v)},formula:'I(X;Y)=-\\tfrac12\\log(1-\\rho^2),\\quad |\\rho|<1'};
}
export function plotPoint(p:Point,bounds:Scene['bounds']):Point{
 const [xmin,xmax,ymin,ymax]=bounds;return[52+480*(p[0]-xmin)/(xmax-xmin),270-230*(p[1]-ymin)/(ymax-ymin)];
}
