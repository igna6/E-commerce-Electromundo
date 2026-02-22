import { and, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { productCategoriesTable } from '../db/schema.ts'
import { NotFoundError } from '../utils/errors.ts'
import type { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.ts'

export async function listCategories() {
  return db
    .select()
    .from(productCategoriesTable)
    .where(isNull(productCategoriesTable.deletedAt))
    .orderBy(productCategoriesTable.name)
}

export async function getCategoryById(id: number) {
  const category = await db
    .select()
    .from(productCategoriesTable)
    .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
    .limit(1)

  if (!category[0]) {
    throw new NotFoundError('Category not found')
  }

  return category[0]
}

export async function createCategory(data: CreateCategoryInput) {
  const newCategory = await db
    .insert(productCategoriesTable)
    .values(data)
    .returning()

  return newCategory[0]
}

export async function updateCategory(id: number, data: UpdateCategoryInput) {
  const updatedCategory = await db
    .update(productCategoriesTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
    .returning()

  if (!updatedCategory[0]) {
    throw new NotFoundError('Category not found')
  }

  return updatedCategory[0]
}

export async function deleteCategory(id: number) {
  const deletedCategory = await db
    .update(productCategoriesTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(productCategoriesTable.id, id), isNull(productCategoriesTable.deletedAt)))
    .returning()

  if (!deletedCategory[0]) {
    throw new NotFoundError('Category not found')
  }
}
