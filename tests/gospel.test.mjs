import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import { avatars, validProfileInput } from '../lib/profiles.mjs';
import {
  chooseEnglishVoice,
  chooseGermanVoice,
  validProgress,
  mergeProgress,
  emptyProgress,
} from '../lib/learning.mjs';
async function data(path) {
  const code = ts.transpile(
    fs.readFileSync(new URL(path, import.meta.url), 'utf8'),
    { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 },
  );
  return import(
    'data:text/javascript;base64,' + Buffer.from(code).toString('base64')
  );
}
test('all neighbourhood introductions are bilingual and every Gospel story is sourced', async () => {
  const { storyOpenings, storyOpeningsDe } = await data('../app/storybook.ts');
  assert.equal(storyOpenings.length, 36);
  assert.equal(storyOpeningsDe.length, 36);
  for (let i = 0; i < 36; i++) {
    assert.ok(storyOpeningsDe[i]);
    assert.notEqual(storyOpenings[i], storyOpeningsDe[i]);
  }
  const { gospelStories } = await data('../app/gospel-stories.ts');
  assert.equal(gospelStories.length, 6);
  for (const story of gospelStories) {
    assert.ok(story.reference && story.url.startsWith('https://'));
    assert.equal(story.lines.length, 4);
    assert.equal(story.questions.length, 2);
    for (const line of story.lines) assert.ok(line.de && line.en);
    for (const q of story.questions)
      assert.ok(q.de && q.en && q.answerDe && q.answerEn);
    assert.ok(story.activity.de && story.activity.en);
    assert.ok(
      fs.existsSync(
        new URL(
          `../public/gospel/scenes-${Math.floor((story.id - 1) / 4) + 1}.webp`,
          import.meta.url,
        ),
      ),
    );
  }
});
test('all twelve apostle choices are distinct; new profiles cannot use old animals', () => {
  assert.equal(avatars.length, 12);
  assert.equal(new Set(avatars.map((a) => a.id)).size, 12);
  assert.ok(avatars.some((a) => a.id === 'matthias'));
  assert.ok(avatars.some((a) => a.id === 'james-zebedee'));
  assert.ok(avatars.some((a) => a.id === 'james-alphaeus'));
  assert.equal(validProfileInput({ nickname: 'Sunny', avatar: 'fox' }), false);
  for (const a of avatars) {
    assert.ok(validProfileInput({ nickname: 'Sunny', avatar: a.id }));
    assert.ok(
      fs.existsSync(
        new URL(
          `../public/apostles/portraits-${Math.floor(a.index / 6) + 1}.webp`,
          import.meta.url,
        ),
      ),
    );
  }
});
test('Gospel progress survives older backups without changing neighbourhood progress', () => {
  const progress = { ...emptyProgress, gospel: [1, 6] };
  assert.ok(validProgress(progress));
  assert.equal(validProgress({ ...progress, gospel: [7] }), false);
  assert.deepEqual(mergeProgress(progress, emptyProgress).gospel, [1, 6]);
  assert.deepEqual(mergeProgress(emptyProgress, progress).gospel, [1, 6]);
  assert.deepEqual(progress.completed, {});
});
test('English narration uses English voices and never a German fallback', () => {
  const voices = [{ lang: 'de-DE' }, { lang: 'en-US' }, { lang: 'en-GB' }];
  assert.equal(chooseEnglishVoice(voices).lang, 'en-GB');
  assert.equal(chooseGermanVoice(voices).lang, 'de-DE');
  assert.equal(chooseEnglishVoice([{ lang: 'de-DE' }]), undefined);
  assert.equal(chooseEnglishVoice([{ lang: 'en-AU' }]).lang, 'en-AU');
});
