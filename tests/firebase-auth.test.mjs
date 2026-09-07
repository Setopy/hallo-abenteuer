import test from 'node:test';
import assert from 'node:assert/strict';
import { generateKeyPair, SignJWT } from 'jose';
import { verifyFirebaseToken } from '../lib/firebase-token.mjs';
const { privateKey, publicKey } = await generateKeyPair('RS256');
const project = 'test-family-project';
async function token(overrides = {}) {
  const now = Math.floor(Date.now() / 1000);
  return new SignJWT({
    sub: 'parent-123',
    iss: `https://securetoken.google.com/${project}`,
    aud: project,
    iat: now,
    exp: now + 300,
    auth_time: now,
    email_verified: true,
    ...overrides,
  })
    .setProtectedHeader({ alg: 'RS256', kid: 'test' })
    .sign(privateKey);
}
test('verified adult identity is scoped to the Firebase project and UID', async () =>
  assert.equal(
    await verifyFirebaseToken(await token(), project, publicKey),
    'firebase:test-family-project:parent-123',
  ));
for (const [name, claims] of Object.entries({
  unverified: { email_verified: false },
  wrongProject: { aud: 'other' },
  wrongIssuer: { iss: 'https://example.com' },
  expired: { exp: 1 },
  futureAuthentication: { auth_time: 9999999999 },
  futureIssued: { iat: 9999999999 },
  emptyIdentity: { sub: '' },
  oversizedIdentity: { sub: 'a'.repeat(129) },
})) {
  test(`rejects ${name}`, async () =>
    assert.rejects(
      verifyFirebaseToken(await token(claims), project, publicKey),
    ));
}
test('rejects signature from another key', async () => {
  const other = await generateKeyPair('RS256');
  await assert.rejects(
    verifyFirebaseToken(await token(), project, other.publicKey),
  );
});
test('rejects unconfigured project', async () =>
  assert.rejects(verifyFirebaseToken(await token(), undefined, publicKey)));
