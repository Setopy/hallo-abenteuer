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

test('speaking observations remain separate from practice and survive older backups', () => {
  const practiced = markComplete(emptyProgress, 3);
  assert.equal(practiced.canDo, undefined);
  const observed = { ...practiced, canDo: [3, 8] };
  assert.ok(validProgress(observed));
  assert.equal(validProgress({ ...observed, canDo: [37] }), false);
  assert.equal(validProgress({ ...observed, canDo: '3' }), false);
  assert.deepEqual(mergeProgress(observed, emptyProgress).canDo, [3, 8]);
  assert.deepEqual(mergeProgress(emptyProgress, observed).canDo, [3, 8]);
  assert.deepEqual(mergeProgress(observed, { ...emptyProgress, canDo: [8, 12] }).canDo, [3, 8, 12]);
});
test('each story has a scene, original introduction and picture vocabulary', async () => {
  const code = ts.transpile(fs.readFileSync(new URL('../app/storybook.ts', import.meta.url), 'utf8'), {module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022});
  const { places, storyOpenings, pictureWords } = await import('data:text/javascript;base64,' + Buffer.from(code).toString('base64'));
  assert.equal(places.length, worlds.length);
  assert.equal(storyOpenings.length, lessons.length);
  assert.equal(new Set(storyOpenings).size, lessons.length);
  for (const lesson of lessons) {
    const place = places[lesson.world];
    assert.ok(place.name && place.alt && place.props);
    assert.ok(storyOpenings[lesson.id - 1]);
    assert.equal(pictureWords[lesson.world].length, 3);
    assert.ok(pictureWords[lesson.world].every(word => word.de && word.en));
    assert.ok(fs.statSync(new URL(`../public/scenes/sheet-${Math.floor(lesson.world/4)+1}.webp`, import.meta.url)).size > 0);
  }
});
