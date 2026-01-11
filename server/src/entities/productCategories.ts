import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const productCategoriesTable = pgTable('product_categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  description: text(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
})
