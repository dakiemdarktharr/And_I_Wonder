export function plotDomain(values:number[],includeZero=false):[number,number]{
 const finite=values.filter(Number.isFinite);
 if(!finite.length)return [0,1];
 let lo=Math.min(...finite),hi=Math.max(...finite);
 if(includeZero){lo=Math.min(0,lo);hi=Math.max(0,hi);}
 if(lo===hi){const pad=Math.max(Math.abs(lo)*.1,1);return [lo-pad,hi+pad];}
 const pad=(hi-lo)*.06;
 return [lo===0&&includeZero?0:lo-pad,hi+pad];
}
export function linearScale(domain:[number,number],range:[number,number]){
 return (value:number)=>range[0]+(value-domain[0])/(domain[1]-domain[0])*(range[1]-range[0]);
}
export function equalAspectDomains(x:[number,number],y:[number,number],width:number,height:number):{x:[number,number];y:[number,number]}{
 const unitsPerPixel=Math.max((x[1]-x[0])/width,(y[1]-y[0])/height);
 const midX=(x[0]+x[1])/2,midY=(y[0]+y[1])/2;
 return {x:[midX-unitsPerPixel*width/2,midX+unitsPerPixel*width/2],y:[midY-unitsPerPixel*height/2,midY+unitsPerPixel*height/2]};
}
export function plotTicks(domain:[number,number],count=5){return Array.from({length:count},(_,i)=>domain[0]+i*(domain[1]-domain[0])/(count-1));}
