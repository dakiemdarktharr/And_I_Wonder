import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import covers from '../data/resource-covers.json';
import guides from '../data/project-guides.json';

test('every book thumbnail is a real source asset with matching provenance hash',()=>{
 assert.equal(covers.length,12);
 for(const cover of covers){
  assert.ok(cover.asset?.startsWith('/covers/'),cover.resourceId);
  assert.match(cover.sourcePageUrl,/^https:\/\//);
  assert.notEqual(cover.captureType,'truthful-title-page-fallback');
  const bytes=readFileSync(`public${cover.asset}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),cover.sha256,cover.resourceId);
  assert.equal(bytes.length,cover.bytes);
 }
});

test('all five project briefs have concrete bilingual inputs, checks and milestones',()=>{
 assert.deepEqual(guides.map(g=>g.id),['P01','P02','P03','P04','P05']);
 for(const guide of guides){
  assert.ok(guide.startingInputs.length>=2&&guide.steps.length>=4&&guide.acceptanceChecks.length>=3&&guide.milestones.length>=3,guide.id);
  for(const field of guide.startingInputs){assert.ok(field.en&&field.vi);}
  assert.ok(guide.repositoryTree.some(p=>p.includes('tests/')),guide.id);
 }
});
