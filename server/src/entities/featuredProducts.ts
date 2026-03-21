import { integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core'
import { productsTable } from './products'

export const featuredProductsTable = pgTable('featured_products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  section: text().notNull(),
  productId: integer()
    .notNull()
    .references(() => productsTable.id),
  position: integer().notNull().default(0),
  metadata: jsonb(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
})
