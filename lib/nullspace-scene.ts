/** A = [[1,2],[2,4]]. Screen y increases downwards; mathematical y increases upwards. */
export function nullspacePoint(t:number){
 const x=-2*t,y=t;
 return {x,y,screenX:170+24*x,screenY:125-24*y};
}
export const nullspaceLine=[nullspacePoint(-3),nullspacePoint(3)] as const;
