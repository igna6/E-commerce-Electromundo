import { integer, pgTable, text, timestamp, varchar } from 'drizzle-orm/pg-core'
import { productCategoriesTable } from './productCategories'

export const productsTable = pgTable('products', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar().notNull(),
  price: integer().notNull(),
  description: text(),
  image: varchar(),
  category: integer().references(() => productCategoriesTable.id),
  stock: integer().notNull().default(0),
  sku: varchar().unique(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp({ withTimezone: true }),
})
