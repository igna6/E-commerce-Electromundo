import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core'
import { ordersTable } from './orders'
import { productsTable } from './products'

export const orderItemsTable = pgTable('order_items', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  orderId: integer().references(() => ordersTable.id).notNull(),
  productId: integer().references(() => productsTable.id).notNull(),
  productName: varchar({ length: 255 }).notNull(),
  productPrice: integer().notNull(),
  quantity: integer().notNull(),
  lineTotal: integer().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
})
