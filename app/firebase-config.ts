import { env } from 'cloudflare:workers';
export function firebaseConfig() {
  const {
    FIREBASE_PROJECT_ID: projectId,
    FIREBASE_API_KEY: apiKey,
    FIREBASE_AUTH_DOMAIN: authDomain,
  } = env;
  return projectId && apiKey && authDomain
    ? { projectId, apiKey, authDomain }
    : null;
}
