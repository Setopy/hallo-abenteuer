// Run explicitly against the local preview; uses only the official local sign-in cookie.
import assert from 'node:assert/strict';
const base = 'http://localhost:3000';
async function request(
  path,
  method = 'GET',
  body,
  authenticated = true,
  origin = base,
) {
  const headers = {};
  if (authenticated) headers.Cookie = '__sites_local_auth=1';
  if (body) {
    headers['Content-Type'] = 'application/json';
    headers.Origin = origin;
  }
  const r = await fetch(base + path, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  let data;
  try {
    data = JSON.parse(text);
  } catch {
    data = { error: text };
  }
  return { status: r.status, data };
}
assert.equal(
  (await request('/api/family', 'GET', undefined, false)).status,
  401,
);
assert.equal(
  (
    await request(
      '/api/family',
      'POST',
      { nickname: 'Test', avatar: 'fox' },
      false,
    )
  ).status,
  401,
);
assert.ok(
  [400, 403].includes(
    (
      await request(
        '/api/family',
        'POST',
        { nickname: 'Test', avatar: 'fox' },
        true,
        'https://another.example',
      )
    ).status,
  ),
);
assert.equal(
  (await request('/api/family', 'POST', { nickname: '', avatar: 'fox' }))
    .status,
  400,
);
const a = await request('/api/family', 'POST', {
  nickname: 'Local test A',
  avatar: 'fox',
});
const b = await request('/api/family', 'POST', {
  nickname: 'Local test B',
  avatar: 'panda',
});
assert.equal(a.status, 201, JSON.stringify(a));
assert.equal(b.status, 201, JSON.stringify(b));
const progress = {
  version: 1,
  completed: { 1: '2026-09-06T00:00:00Z' },
  checks: [0],
  canDo: [1],
};
const save = await request('/api/family/' + a.data.profile.id, 'PUT', {
  progress,
  revision: 0,
});
assert.equal(save.status, 200, JSON.stringify(save));
assert.equal(save.data.revision, 1);
const stale = await request('/api/family/' + a.data.profile.id, 'PUT', {
  progress: { version: 1, completed: {}, checks: [] },
  revision: 0,
});
assert.equal(stale.status, 409);
assert.equal(stale.data.profile.progress.completed[1], progress.completed[1]);
const list = await request('/api/family');
assert.equal(list.status, 200);
assert.deepEqual(
  list.data.profiles.find((p) => p.id === a.data.profile.id).progress,
  progress,
);
assert.deepEqual(
  list.data.profiles.find((p) => p.id === b.data.profile.id).progress.completed,
  {},
);
assert.ok(!list.data.profiles.some((p) => p.id === 'other-family-fixture'));
const other = await request('/api/family/other-family-fixture', 'PUT', {
  progress,
  revision: 0,
});
assert.equal(other.status, 404);
assert.ok(!other.data.profile);
console.log(
  'Passed: adult sign-in required, input validation, cross-origin rejection, separate child progress, reload persistence, stale-save protection, owner isolation.',
);
