import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {
  emptyProgress,
  validProgress,
  markComplete,
  mergeProgress,
  nextLesson,
  shuffled,
  isBuilt,
  chooseGermanVoice,
} from '../lib/learning.mjs';
const source = ts.transpile(
  fs.readFileSync(new URL('../app/lessons.ts', import.meta.url), 'utf8'),
  { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
);
const { lessons, worlds } = await import(
  'data:text/javascript;base64,' + Buffer.from(source).toString('base64')
);
test('every adventure has three complete, playable missions', () => {
  assert.equal(worlds.length, 12);
  assert.equal(lessons.length, 36);
  assert.equal(new Set(lessons.map((l) => l.id)).size, 36);
  for (let w = 0; w < 12; w++)
    assert.equal(lessons.filter((l) => l.world === w).length, 3);
  for (const l of lessons) {
    assert.equal(l.phrases.length, 4);
    assert.equal(new Set(l.phrases.map((p) => p.de)).size, 4);
    l.phrases.forEach((p) => {
      assert.ok(p.de);
      assert.ok(p.en);
    });
    assert.ok(l.phrases[1].de.split(' ').length >= 2);
    assert.ok(l.tip && l.swap && l.mission);
  }
});
test('repeat play does not inflate discoveries', () => {
  const a = markComplete(emptyProgress, 1, '2026-09-05T00:00:00Z');
  const b = markComplete(a, 1, '2026-09-06T00:00:00Z');
  assert.equal(Object.keys(b.completed).length, 1);
  assert.equal(nextLesson(b), 2);
  assert.equal(Object.keys(emptyProgress.completed).length, 0);
});
test('progress rejects invalid ids and invalid timestamps', () => {
  assert.ok(validProgress(emptyProgress));
  assert.equal(
    validProgress({ version: 1, completed: { 37: '2026-09-05' }, checks: [] }),
    false,
  );
  assert.equal(
    validProgress({ version: 1, completed: { 1: 'bad' }, checks: [] }),
    false,
  );
  assert.throws(() => markComplete(emptyProgress, 0));
  assert.equal(
    validProgress({ version: 1, completed: {}, checks: [99] }),
    false,
  );
});
test('restoring a backup merges without losing later discoveries', () => {
  const a = markComplete(emptyProgress, 1, '2026-09-06T00:00:00Z');
  const b = {
    version: 1,
    completed: { 1: '2026-09-05T00:00:00Z', 2: '2026-09-05T00:00:00Z' },
    checks: [0],
  };
  const m = mergeProgress(a, b);
  assert.equal(Object.keys(m.completed).length, 2);
  assert.equal(m.completed[1], '2026-09-06T00:00:00Z');
  assert.deepEqual(m.checks, [0]);
  assert.throws(() => mergeProgress(a, {}));
});
test('sentence builder handles order and repeated words', () => {
  assert.ok(isBuilt(['Ja,', 'ich', 'spiele', 'mit.'], [0, 1, 2, 3]));
  assert.equal(isBuilt(['Ja,', 'ich', 'spiele', 'mit.'], [1, 0, 2, 3]), false);
  assert.equal(isBuilt(['Ja,', 'ich', 'spiele', 'mit.'], [0, 1]), false);
  assert.ok(isBuilt(['Hallo', 'Hallo'], [1, 0]));
});
test('shuffling preserves words and never mutates the source', () => {
  const original = [0, 1, 2, 3];
  const result = shuffled(original, () => 0);
  assert.deepEqual(original, [0, 1, 2, 3]);
  assert.deepEqual([...result].sort(), original);
  assert.notDeepEqual(result, original);
});
test('German audio selects German and never substitutes English', () => {
  assert.equal(
    chooseGermanVoice([{ lang: 'en-US' }, { lang: 'de-AT' }, { lang: 'de-DE' }])
      .lang,
    'de-DE',
  );
  assert.equal(chooseGermanVoice([{ lang: 'de-AT' }]).lang, 'de-AT');
  assert.equal(chooseGermanVoice([{ lang: 'en-US' }]), undefined);
});
