import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { usersTable } from './users'

export const refreshTokensTable = pgTable('refresh_tokens', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  userId: integer()
    .notNull()
    .references(() => usersTable.id),
  token: varchar().notNull(),
  expiresAt: timestamp({ withTimezone: true }).notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
