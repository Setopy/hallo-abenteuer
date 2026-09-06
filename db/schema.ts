import { sqliteTable, text, integer, index } from 'drizzle-orm/sqlite-core';
export const childProfiles = sqliteTable(
  'child_profiles',
  {
    id: text('id').primaryKey(),
    ownerId: text('owner_id').notNull(),
    nickname: text('nickname').notNull(),
    avatar: text('avatar').notNull(),
    progress: text('progress').notNull(),
    revision: integer('revision').notNull().default(0),
    createdAt: text('created_at').notNull(),
  },
  (table) => [index('child_profiles_owner').on(table.ownerId)],
);
