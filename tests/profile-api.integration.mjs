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
      { nickname: 'Test', avatar: 'peter' },
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
        { nickname: 'Test', avatar: 'peter' },
        true,
        'https://another.example',
      )
    ).status,
  ),
);
assert.equal(
  (await request('/api/family', 'POST', { nickname: '', avatar: 'peter' }))
    .status,
  400,
);
const a = await request('/api/family', 'POST', {
  nickname: 'Local test A',
  avatar: 'peter',
});
const b = await request('/api/family', 'POST', {
  nickname: 'Local test B',
  avatar: 'john',
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
const changed = await request('/api/family/' + a.data.profile.id, 'PATCH', {
  nickname: 'Local test A',
  avatar: 'matthias',
});
assert.equal(changed.status, 200);
assert.equal(changed.data.profile.avatar, 'matthias');
assert.equal(changed.data.profile.revision, 1);
assert.deepEqual(changed.data.profile.progress, progress);
assert.equal(
  (
    await request('/api/family/other-family-fixture', 'PATCH', {
      nickname: 'Wrong family',
      avatar: 'peter',
    })
  ).status,
  404,
);
assert.equal(
  (
    await request('/api/family/' + a.data.profile.id, 'PATCH', {
      nickname: 'Invalid',
      avatar: 'fox',
    })
  ).status,
  400,
);
const gospelSaved = await request('/api/family/' + a.data.profile.id, 'PUT', {
  progress: { ...progress, gospel: [1, 6] },
  revision: 1,
});
assert.equal(gospelSaved.status, 200);
const reread = await request('/api/family');
assert.deepEqual(
  reread.data.profiles.find((p) => p.id === a.data.profile.id).progress.gospel,
  [1, 6],
);
console.log(
  'Passed: adult sign-in required, input validation, cross-origin rejection, separate child progress, reload persistence, stale-save protection, owner isolation.',
);
