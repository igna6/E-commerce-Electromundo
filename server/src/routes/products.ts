import { Router } from 'express'
import { and, asc, count, desc, eq, gte, ilike, isNull, lte, or } from 'drizzle-orm'
import db from '../db/db.ts'
import { productsTable } from '../db/schema.ts'
import { createProductSchema, updateProductSchema } from '../validators/product.ts'

const router = Router()

// GET /api/products/:id - Get single product
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid product ID' })
    }

    const product = await db
      .select()
      .from(productsTable)
      .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
      .limit(1)

    if (!product[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ data: product[0] })
  } catch (error: any) {
    console.error('Error fetching product:', error)
    res.status(500).json({ error: 'Failed to fetch product' })
  }
})

router.get('/', async (req, res) => {
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

    // Build where conditions
    const conditions = [isNull(productsTable.deletedAt)]

    // Search by name or description
    if (search) {
      conditions.push(
        or(
          ilike(productsTable.name, `%${search}%`),
          ilike(productsTable.description, `%${search}%`)
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
  } catch (error: any) {
    console.error('Error fetching products:', error)
    res.status(500).json({ error: 'Failed to fetch products' })
  }
})

// POST /api/products - Create product
router.post('/', async (req, res) => {
  try {
    const validatedData = createProductSchema.parse(req.body)

    const newProduct = await db
      .insert(productsTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newProduct[0] })
  } catch (error: any) {
    console.error('Error creating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create product' })
  }
})

// PUT /api/products/:id - Update product
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
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
  } catch (error: any) {
    console.error('Error updating product:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid product data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update product' })
  }
})

// DELETE /api/products/:id - Soft delete product
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const deletedProduct = await db
      .update(productsTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
      .returning()

    if (!deletedProduct[0]) {
      return res.status(404).json({ error: 'Product not found' })
    }

    res.json({ message: 'Product deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting product:', error)
    res.status(500).json({ error: 'Failed to delete product' })
  }
})

export default router
