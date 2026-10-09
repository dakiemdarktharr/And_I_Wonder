// Run once against the declared baseline. Never overwrite an existing archive.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
const root = process.cwd();
const destination = path.join(root, 'data/archive/curriculum-v1');
if (fs.existsSync(path.join(destination, 'manifest.json'))) throw new Error('Archive already exists. Verify it; do not overwrite.');
const files = [
  ...fs.readdirSync('data').filter(f => /^(lessons-|lesson-visuals-|exercise-checkpoints|notes\.json|curriculum-vi|translation-map|import-summary|project-guides|resources\.json|resource-covers)/.test(f)).map(f => `data/${f}`),
  'lib/lessons.ts', 'lib/lesson-types.ts', 'lib/lab-catalog.ts', 'lib/math-labs.ts', 'lib/lesson-export.ts',
  ...fs.readdirSync('scripts').filter(f => /^(correct-foundation|build-exercise|build-foundation|author|import_obsidian)/.test(f)).map(f => `scripts/${f}`),
];
const entries = files.sort().map(file => {
  const bytes = fs.readFileSync(file);
  const target = path.join(destination, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, bytes, { flag: 'wx' });
  return { file, sha256: crypto.createHash('sha256').update(bytes).digest('hex'), bytes: bytes.length };
});
fs.writeFileSync(path.join(destination, 'manifest.json'), JSON.stringify({ version: 'curriculum-v1', baseline: '47e38bf5f510b92c9987b4be2e88c37e6ad5e3f8', entries }, null, 2) + '\n', { flag: 'wx' });
console.log(`Archived ${entries.length} immutable source files.`);
