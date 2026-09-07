import { jwtVerify, importX509 } from 'jose';
const certUrl =
  'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
let certificates = {},
  expires = 0,
  loading;
async function certificateKey(header) {
  if (header.alg !== 'RS256' || typeof header.kid !== 'string')
    throw Error('Invalid token header');
  if (Date.now() >= expires) {
    loading ??= (async () => {
      const response = await fetch(certUrl);
      if (!response.ok) throw Error('Unable to check sign-in');
      const value = await response.json();
      const seconds = Number(
        response.headers.get('cache-control')?.match(/max-age=(\d+)/)?.[1] ||
          300,
      );
      certificates = value;
      expires = Date.now() + seconds * 1000;
    })();
    try {
      await loading;
    } finally {
      loading = undefined;
    }
  }
  const certificate = certificates[header.kid];
  if (typeof certificate !== 'string') throw Error('Unknown signing key');
  return importX509(certificate, 'RS256');
}
export async function verifyFirebaseToken(
  token,
  projectId,
  resolveKey = certificateKey,
) {
  if (!projectId) throw Error('Email sign-in is not configured');
  const { payload } = await jwtVerify(token, resolveKey, {
    algorithms: ['RS256'],
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
    requiredClaims: ['sub', 'iat', 'exp', 'auth_time'],
  });
  const now = Math.floor(Date.now() / 1000);
  if (
    typeof payload.sub !== 'string' ||
    !payload.sub.length ||
    payload.sub.length > 128 ||
    typeof payload.iat !== 'number' ||
    payload.iat > now ||
    typeof payload.auth_time !== 'number' ||
    payload.auth_time > now ||
    payload.email_verified !== true
  )
    throw Error('Verify your email before opening family profiles');
  return `firebase:${projectId}:${payload.sub}`;
}
