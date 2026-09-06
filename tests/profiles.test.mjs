import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validProfileInput,
  validProgressUpdate,
  sameOriginWrite,
} from '../lib/profiles.mjs';
import { emptyProgress } from '../lib/learning.mjs';
test('profile input permits short nicknames and only preset avatars', () => {
  assert.ok(validProfileInput({ nickname: 'Sunny', avatar: 'peter' }));
  assert.ok(validProfileInput({ nickname: 'Søren', avatar: 'john' }));
  for (const nickname of ['', '   ', 'x'.repeat(21), 'hello\nworld'])
    assert.equal(validProfileInput({ nickname, avatar: 'peter' }), false);
  assert.equal(
    validProfileInput({
      nickname: 'Sunny',
      avatar: 'https://tracking.example/a.png',
    }),
    false,
  );
});
test('updates require both valid progress and a revision', () => {
  assert.ok(validProgressUpdate({ progress: emptyProgress, revision: 0 }));
  for (const revision of [-1, 0.1, '0', undefined])
    assert.equal(
      validProgressUpdate({ progress: emptyProgress, revision }),
      false,
    );
  assert.equal(
    validProgressUpdate({
      progress: { version: 1, completed: {}, checks: [99] },
      revision: 0,
    }),
    false,
  );
});
test('profile writes reject absent or foreign origins and non-JSON bodies', () => {
  const request = (origin, type = 'application/json') =>
    new Request('https://school.example/api/family', {
      method: 'POST',
      headers: { ...(origin ? { Origin: origin } : {}), 'Content-Type': type },
    });
  assert.ok(sameOriginWrite(request('https://school.example')));
  assert.equal(sameOriginWrite(request('https://attacker.example')), false);
  assert.equal(sameOriginWrite(request()), false);
  assert.equal(
    sameOriginWrite(request('https://school.example', 'text/plain')),
    false,
  );
});
