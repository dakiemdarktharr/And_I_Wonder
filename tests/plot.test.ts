import {test} from 'node:test';
import assert from 'node:assert/strict';
import {plotDomain,linearScale,equalAspectDomains} from '../lib/plot';
test('plotted coordinates preserve values, orientation and zero crossings',()=>{
 const s=linearScale([-2,2],[200,0]);assert.equal(s(-2),200);assert.equal(s(0),100);assert.equal(s(2),0);
 const d=plotDomain([-3,5],true);assert.ok(d[0]<-3&&d[1]>5);
 assert.equal(plotDomain([1,4],true)[0],0);
 const constant=plotDomain([.5,.5]);assert.ok(constant[0]<.5&&constant[1]>.5);
});
test('geometric plots can use equal x and y units',()=>{
 const d=equalAspectDomains([0,10],[-2,2],600,240);
 assert.ok(Math.abs((d.x[1]-d.x[0])/600-(d.y[1]-d.y[0])/240)<1e-12);
});
