import { Router } from 'express'
import { and, count, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { productCategoriesTable } from '../db/schema.ts'
import { createCategorySchema, idParamSchema, updateCategorySchema } from '../validators/category.ts'
import { authenticateToken, requireAdmin } from '../middleware/auth.ts'

const router = Router()

// GET /api/categories - List all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await db
      .select()
      .from(productCategoriesTable)
      .where(isNull(productCategoriesTable.deletedAt))
      .orderBy(productCategoriesTable.name)

    res.json({ data: categories })
  } catch (error) {
    next(error)
  }
})

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)

    const category = await db
      .select()
      .from(productCategoriesTable)
      .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
      .limit(1)

    if (!category[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ data: category[0] })
  } catch (error) {
    next(error)
  }
})

// POST /api/categories - Create category (Admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const validatedData = createCategorySchema.parse(req.body)

    const newCategory = await db
      .insert(productCategoriesTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newCategory[0] })
  } catch (error) {
    next(error)
  }
})

// PUT /api/categories/:id - Update category (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)
    const validatedData = updateCategorySchema.parse(req.body)

    const updatedCategory = await db
      .update(productCategoriesTable)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
      .returning()

    if (!updatedCategory[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ data: updatedCategory[0] })
  } catch (error) {
    next(error)
  }
})

// DELETE /api/categories/:id - Soft delete category (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
  try {
    const { id } = idParamSchema.parse(req.params)

    const deletedCategory = await db
      .update(productCategoriesTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
      .returning()

    if (!deletedCategory[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error) {
    next(error)
  }
})

export default router
