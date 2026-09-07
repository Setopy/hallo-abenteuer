import { headers } from 'next/headers';
import { firebaseConfig } from '@/app/firebase-config';
import { verifyFirebaseToken } from '@/lib/firebase-token.mjs';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { sameOriginWrite } from '@/lib/profiles.mjs';
export const reply = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: {
      'Cache-Control': 'private, no-store',
      Vary: 'Cookie, Authorization',
    },
  });
export async function owner() {
  const bearer = (await headers()).get('authorization');
  if (bearer) {
    if (!bearer.startsWith('Bearer ')) return undefined;
    try {
      return await verifyFirebaseToken(
        bearer.slice(7),
        firebaseConfig()?.projectId,
      );
    } catch {
      return undefined;
    }
  }
  return (await getChatGPTUser())?.userId;
}
export async function readBody(request: Request) {
  if (!sameOriginWrite(request)) throw new Error('origin');
  const body = await request.text();
  if (body.length > 24000) throw new Error('size');
  return JSON.parse(body);
}
export function profile(row: any) {
  return {
    id: row.id,
    nickname: row.nickname,
    avatar: row.avatar,
    progress: JSON.parse(row.progress),
    revision: row.revision,
  };
}
