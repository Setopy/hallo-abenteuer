'use client';
import { initializeApp, getApps } from 'firebase/app';
import { getAuth, signOut, type Auth } from 'firebase/auth';
let initialized: Promise<Auth | null> | undefined;
export function emailAuth(): Promise<Auth | null> {
  initialized ??= (async () => {
    const response = await fetch('/api/auth/config', { cache: 'no-store' });
    if (!response.ok) throw Error('Sign-in could not be loaded.');
    const { config } = (await response.json()) as {
      config: { apiKey: string; projectId: string; authDomain: string } | null;
    };
    if (!config) return null;
    const app =
      getApps().find((a) => a.name === 'hallo-adult') ||
      initializeApp(config, 'hallo-adult');
    const auth = getAuth(app);
    await auth.authStateReady();
    return auth;
  })();
  return initialized.catch((error) => {
    initialized = undefined;
    throw error;
  });
}
export async function familyFetch(url: string, options: RequestInit = {}) {
  const auth = await emailAuth();
  const headers = new Headers(options.headers);
  if (auth?.currentUser)
    headers.set(
      'Authorization',
      'Bearer ' + (await auth.currentUser.getIdToken()),
    );
  return fetch(url, { ...options, headers });
}
export async function adultSignOut() {
  const auth = await emailAuth();
  if (auth) await signOut(auth);
  window.location.assign('/signout-with-chatgpt?return_to=%2F');
}
