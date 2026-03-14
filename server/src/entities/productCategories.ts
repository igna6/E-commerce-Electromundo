import type { AnyPgColumn } from 'drizzle-orm/pg-core'
import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'

export const productCategoriesTable = pgTable('product_categories', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  description: text(),
  parentCategoryId: integer('parent_category_id').references((): AnyPgColumn => productCategoriesTable.id),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
})
