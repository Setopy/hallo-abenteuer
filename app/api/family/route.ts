import { getDb } from '@/db';
import { emptyProgress } from '@/lib/learning.mjs';
import { validProfileInput } from '@/lib/profiles.mjs';
import { owner, profile, readBody, reply } from './shared';
export const dynamic = 'force-dynamic';
export async function GET() {
  const user = await owner();
  if (!user) return reply({ error: 'An adult needs to sign in.' }, 401);
  try {
    const rows = await getDb()
      .prepare(
        'SELECT id,nickname,avatar,progress,revision FROM child_profiles WHERE owner_id = ? ORDER BY created_at,id',
      )
      .bind(user)
      .all();
    return reply({ profiles: rows.results.map(profile) });
  } catch {
    return reply(
      { error: 'Profiles could not be loaded. Please try again.' },
      503,
    );
  }
}
export async function POST(request: Request) {
  const user = await owner();
  if (!user) return reply({ error: 'An adult needs to sign in.' }, 401);
  let body;
  try {
    body = await readBody(request);
  } catch {
    return reply({ error: 'The request could not be accepted.' }, 400);
  }
  if (!validProfileInput(body))
    return reply(
      { error: 'Choose an avatar and a nickname of 1–20 characters.' },
      400,
    );
  try {
    const id = crypto.randomUUID(),
      db = getDb();
    const result = await db
      .prepare(
        'INSERT INTO child_profiles (id,owner_id,nickname,avatar,progress,revision,created_at) SELECT ?,?,?,?,?,0,? WHERE (SELECT COUNT(*) FROM child_profiles WHERE owner_id = ?) < 16',
      )
      .bind(
        id,
        user,
        body.nickname,
        body.avatar,
        JSON.stringify(emptyProgress),
        new Date().toISOString(),
        user,
      )
      .run();
    if (!result.meta.changes)
      return reply({ error: 'This family already has 16 profiles.' }, 409);
    return reply(
      {
        profile: {
          id,
          nickname: body.nickname,
          avatar: body.avatar,
          progress: emptyProgress,
          revision: 0,
        },
      },
      201,
    );
  } catch {
    return reply(
      { error: 'The profile could not be saved. Please try again.' },
      503,
    );
  }
}
