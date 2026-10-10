import {test} from 'node:test';
import assert from 'node:assert/strict';
import {nullspacePoint,nullspaceLine} from '../lib/nullspace-scene';
test('null-space vector and drawn line agree with matrix and screen axes at every slider position',()=>{
 const [a,b]=nullspaceLine;
 for(let i=-20;i<=20;i++){
  const p=nullspacePoint(i/10);
  assert.ok(Math.abs(p.x+2*p.y)<1e-12);
  assert.ok(Math.abs(2*p.x+4*p.y)<1e-12);
  // Cross-product is zero iff the plotted point lies on the drawn line.
  const cross=(p.screenX-a.screenX)*(b.screenY-a.screenY)-(p.screenY-a.screenY)*(b.screenX-a.screenX);
  assert.ok(Math.abs(cross)<1e-9);
 }
 const p=nullspacePoint(1);
 assert.deepEqual(p,{x:-2,y:1,screenX:122,screenY:101});
 assert.ok(p.screenX<170&&p.screenY<125,'negative x and positive y appear upper left');
});
