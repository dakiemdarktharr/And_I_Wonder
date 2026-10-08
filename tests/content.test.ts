import {test} from 'node:test';
import assert from 'node:assert/strict';
import {getAllNotes,getNote} from '../lib/content';
import {isValidNoteId} from '../lib/progress';
test('encoded note paths resolve while malformed paths remain harmless',()=>{
 assert.equal(getNote('Mathematics%20Diagnostic')?.id,'Mathematics Diagnostic');
 assert.equal(getNote('Mathematics Diagnostic')?.id,'Mathematics Diagnostic');
 assert.equal(getNote('malformed%xx'),undefined);
 for(const note of getAllNotes())assert.ok(isValidNoteId(note.id),note.id);
});
