import { Router } from 'express'
import { count, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { productsTable } from '../db/schema.ts'

const router = Router()

router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12))
    const offset = (page - 1) * limit

    const [products, totalResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(isNull(productsTable.deletedAt))
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(productsTable)
        .where(isNull(productsTable.deletedAt)),
    ])

    const total = totalResult[0]?.count ?? 0
    const totalPages = Math.ceil(total / limit)

    res.json({
      data: products,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    })
  } catch (error) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

export default router
