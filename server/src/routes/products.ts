import { Router } from 'express'
import { and, asc, count, desc, eq, gt, gte, ilike, isNull, lte, or } from 'drizzle-orm'
import db from '../db/db.ts'
import { productsTable } from '../db/schema.ts'
import { createProductSchema, idParamSchema, updateProductSchema } from '../validators/product.ts'
import { authenticateToken, requireAdmin } from '../middleware/auth.ts'

const router = Router()

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)

    const product = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
      .limit(1)

    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ data: product[0] })
  } catch (error) {
    next(error)
  }
})

router.get('/', async (req, res, next) => {
  try {
    // Pagination
    const page = Math.max(1, parseInt(req.query.page as string) || 1)
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 12))
    const offset = (page - 1) * limit

    // Search and filters
    const search = req.query.search as string
    const category = req.query.category ? parseInt(req.query.category as string) : undefined
    const minPrice = req.query.minPrice ? parseInt(req.query.minPrice as string) : undefined
    const maxPrice = req.query.maxPrice ? parseInt(req.query.maxPrice as string) : undefined
    const sortBy = (req.query.sortBy as string) || 'newest'
    const inStock = req.query.inStock === 'true'

    // Build where conditions
    const conditions = [isNull(productsTable.deletedAt)]

    // Search by name, description, or SKU
    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`),
          ilike(productsTable.sku, `%${search}%`)
        )!
      )
    }

    // Filter by category
    if (category) {
      conditions.push(eq(productsTable.category, category))
    }

    // Filter by price range
    if (minPrice !== undefined) {
      conditions.push(gte(productsTable.price, minPrice))
    }
    if (maxPrice !== undefined) {
      conditions.push(lte(productsTable.price, maxPrice))
    }

    // Filter by stock availability
    if (inStock) {
      conditions.push(gt(productsTable.stock, 0))
    }

    // Determine sort order
    let orderBy
    switch (sortBy) {
      case 'price-asc':
        orderBy = asc(productsTable.price)
        break
      case 'price-desc':
        orderBy = desc(productsTable.price)
        break
      case 'name':
        orderBy = asc(productsTable.name)
        break
      case 'newest':
      default:
        orderBy = desc(productsTable.createdAt)
        break
    }

    // Execute queries
    const [products, totalResult] = await Promise.all([
      db
        .select()
        .from(productsTable)
        .where(and(...conditions))
        .orderBy(orderBy)
        .limit(limit)
        .offset(offset),
      db
        .select({ count: count() })
        .from(productsTable)
        .where(and(...conditions)),
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
      filters: {
        search,
        category,
        minPrice,
        maxPrice,
        sortBy,
      },
    })
  } catch (error) {
    next(error)
  }
})

// POST /api/products - Create product (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const validatedData = createProductSchema.parse(req.body)

    const newProduct = await db
      .insert(productsTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newProduct[0] })
  } catch (error) {
    next(error)
  }
})

// PUT /api/products/:id - Update product (admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)
    const validatedData = updateProductSchema.parse(req.body)

    const updatedProduct = await db
      .update(productsTable)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
      .returning()

    if (!updatedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ data: updatedProduct[0] })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/products/:id - Soft delete product (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)

    const deletedProduct = await db
      .update(productsTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
      .returning()

    if (!deletedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
