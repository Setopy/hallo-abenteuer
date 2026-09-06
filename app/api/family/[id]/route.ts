import { getDb } from '@/db';
import { validProgressUpdate } from '@/lib/profiles.mjs';
import { owner, readBody, reply, profile } from '../shared';
export const dynamic = 'force-dynamic';
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const user = await owner();
  if (!user) return reply({ error: 'An adult needs to sign in again.' }, 401);
  let body;
  try {
    body = await readBody(request);
  } catch {
    return reply({ error: 'The request could not be accepted.' }, 400);
  }
  if (!validProgressUpdate(body))
    return reply({ error: 'That progress could not be accepted.' }, 400);
  const { id } = await params;
  try {
    const db = getDb();
    const result = await db
      .prepare(
        'UPDATE child_profiles SET progress = ?, revision = revision + 1 WHERE id = ? AND owner_id = ? AND revision = ?',
      )
      .bind(JSON.stringify(body.progress), id, user, body.revision)
      .run();
    if (result.meta.changes) return reply({ revision: body.revision + 1 });
    const row = await db
      .prepare(
        'SELECT id,nickname,avatar,progress,revision FROM child_profiles WHERE id = ? AND owner_id = ?',
      )
      .bind(id, user)
      .first();
    return row
      ? reply(
          {
            error:
              'This profile changed on another device. Reload its saved progress before continuing.',
            profile: profile(row),
          },
          409,
        )
      : reply({ error: 'This profile is not available.' }, 404);
  } catch {
    return reply(
      { error: 'Progress could not be saved. Check the connection and retry.' },
      503,
    );
  }
}
