import { Router } from 'express'
import { and, count, eq, gt, isNull, lte, sum, desc, asc } from 'drizzle-orm'
import db from '../../db/db'
import { ordersTable, productsTable, productCategoriesTable } from '../../db/schema'

const router = Router()

// GET /api/admin/stats - Dashboard statistics
router.get('/', async (req, res) => {
  try {
    const [
      totalOrdersResult,
      pendingOrdersResult,
      confirmedOrdersResult,
      shippedOrdersResult,
      deliveredOrdersResult,
      cancelledOrdersResult,
      revenueResult,
      totalProductsResult,
      totalCategoriesResult,
      recentOrders,
      productsByCategory,
      outOfStockResult,
      lowStockResult,
      lowStockProducts,
    ] = await Promise.all([
      db.select({ count: count() }).from(ordersTable).where(isNull(ordersTable.deletedAt)),
      db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, 'pending')),
      db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, 'confirmed')),
      db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, 'shipped')),
      db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, 'delivered')),
      db.select({ count: count() }).from(ordersTable).where(eq(ordersTable.status, 'cancelled')),
      db.select({ total: sum(ordersTable.total) }).from(ordersTable).where(isNull(ordersTable.deletedAt)),
      db.select({ count: count() }).from(productsTable).where(isNull(productsTable.deletedAt)),
      db.select({ count: count() }).from(productCategoriesTable).where(isNull(productCategoriesTable.deletedAt)),
      db
        .select()
        .from(ordersTable)
        .where(isNull(ordersTable.deletedAt))
        .orderBy(desc(ordersTable.createdAt))
        .limit(5),
      db
        .select({
          categoryId: productCategoriesTable.id,
          categoryName: productCategoriesTable.name,
          productCount: count(productsTable.id),
        })
        .from(productCategoriesTable)
        .leftJoin(productsTable, eq(productsTable.category, productCategoriesTable.id))
        .where(isNull(productCategoriesTable.deletedAt))
        .groupBy(productCategoriesTable.id, productCategoriesTable.name),
      // Out of stock products count
      db.select({ count: count() }).from(productsTable).where(and(
        isNull(productsTable.deletedAt),
        eq(productsTable.stock, 0)
      )),
      // Low stock products count (stock > 0 AND stock <= 5)
      db.select({ count: count() }).from(productsTable).where(and(
        isNull(productsTable.deletedAt),
        gt(productsTable.stock, 0),
        lte(productsTable.stock, 5)
      )),
      // Low stock products list (stock <= 5, not deleted, limit 10)
      db
        .select({ id: productsTable.id, name: productsTable.name, stock: productsTable.stock })
        .from(productsTable)
        .where(and(
          isNull(productsTable.deletedAt),
          lte(productsTable.stock, 5)
        ))
        .orderBy(asc(productsTable.stock))
        .limit(10),
    ])

    res.json({
      data: {
        orders: {
          total: totalOrdersResult[0]?.count ?? 0,
          byStatus: {
            pending: pendingOrdersResult[0]?.count ?? 0,
            confirmed: confirmedOrdersResult[0]?.count ?? 0,
            shipped: shippedOrdersResult[0]?.count ?? 0,
            delivered: deliveredOrdersResult[0]?.count ?? 0,
            cancelled: cancelledOrdersResult[0]?.count ?? 0,
          },
        },
        revenue: {
          total: Number(revenueResult[0]?.total) || 0,
        },
        products: {
          total: totalProductsResult[0]?.count ?? 0,
          byCategory: productsByCategory,
        },
        categories: {
          total: totalCategoriesResult[0]?.count ?? 0,
        },
        recentOrders,
        inventory: {
          outOfStock: outOfStockResult[0]?.count ?? 0,
          lowStock: lowStockResult[0]?.count ?? 0,
          lowStockProducts,
        },
      },
    })
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

export default router
