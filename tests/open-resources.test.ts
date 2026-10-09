import assert from 'node:assert/strict';
import {test} from 'node:test';
import {getResources} from '../lib/content';
import audit from '../data/open-resource-access.json';
import {mathCurriculum} from '../lib/math-curriculum';
import {libraryResources} from '../lib/library-resources';
import {freeOnlineReader} from '../lib/open-resource-links';

test('active shelves and every daily source use reviewed full free online readers',()=>{
 const active=libraryResources(getResources(),mathCurriculum.sources);
 assert.ok(active.length>30);
 assert.equal(new Set(active.map(r=>r.url)).size,active.length);
 for(const item of active)assert.equal(freeOnlineReader(item.url),item.url,item.title);
 for(const source of mathCurriculum.sources)assert.equal(freeOnlineReader(source.url),source.url,source.id);
 assert.ok(!active.some(r=>['isl-python','elements-statistical-learning','cme-intro-options','cme-intro-futures'].includes(r.id)));
 assert.ok(active.some(r=>r.url.endsWith('/t0055.pdf')));
 assert.ok(!active.some(r=>r.url.includes('projecteuclid.org')||r.url.includes('/abs/')));
 assert.equal(freeOnlineReader('https://www.nber.org/papers/unknown-paid-paper'),undefined);
 assert.equal(freeOnlineReader('https://example.org/free-trial'),undefined);
 assert.ok(audit.readers.every(r=>r.evidence.length>20));
});
