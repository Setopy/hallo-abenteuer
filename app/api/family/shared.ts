import { getChatGPTUser } from '@/app/chatgpt-auth';
import { sameOriginWrite } from '@/lib/profiles.mjs';
export const reply = (body: unknown, status = 200) =>
  Response.json(body, {
    status,
    headers: { 'Cache-Control': 'private, no-store', Vary: 'Cookie' },
  });
export async function owner() {
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
