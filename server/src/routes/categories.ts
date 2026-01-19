import { Router } from 'express'
import { and, count, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { productCategoriesTable } from '../db/schema.ts'
import { createCategorySchema, updateCategorySchema } from '../validators/category.ts'

const router = Router()

// GET /api/categories - List all categories
router.get('/', async (req, res) => {
  try {
    const categories = await db
      .select()
      .from(productCategoriesTable)
      .where(isNull(productCategoriesTable.deletedAt))
      .orderBy(productCategoriesTable.name)

    res.json({ data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ error: 'Failed to fetch categories' })
  }
})

// GET /api/categories/:id - Get single category
router.get('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const category = await db
      .select()
      .from(productCategoriesTable)
      .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
      .limit(1)

    if (!category[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ data: category[0] })
  } catch (error: any) {
    console.error('Error fetching category:', error)
    res.status(500).json({ error: 'Failed to fetch category' })
  }
})

// POST /api/categories - Create category
router.post('/', async (req, res) => {
  try {
    const validatedData = createCategorySchema.parse(req.body)

    const newCategory = await db
      .insert(productCategoriesTable)
      .values(validatedData)
      .returning()

    res.status(201).json({ data: newCategory[0] })
  } catch (error: any) {
    console.error('Error creating category:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to create category' })
  }
})

// PUT /api/categories/:id - Update category
router.put('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)
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
  } catch (error: any) {
    console.error('Error updating category:', error)
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Invalid category data', details: error.errors })
    }
    res.status(500).json({ error: 'Failed to update category' })
  }
})

// DELETE /api/categories/:id - Soft delete category
router.delete('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id)

    const deletedCategory = await db
      .update(productCategoriesTable)
      .set({ deletedAt: new Date() })
      .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
      .returning()

    if (!deletedCategory[0]) {
      return res.status(404).json({ error: 'Category not found' })
    }

    res.json({ message: 'Category deleted successfully' })
  } catch (error: any) {
    console.error('Error deleting category:', error)
    res.status(500).json({ error: 'Failed to delete category' })
  }
})

export default router
