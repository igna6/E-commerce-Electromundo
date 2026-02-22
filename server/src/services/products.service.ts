import { and, asc, count, desc, eq, gt, gte, ilike, isNull, lte, or } from 'drizzle-orm'
import db from '../db/db.ts'
import { productsTable } from '../db/schema.ts'
import { NotFoundError } from '../utils/errors.ts'
import type { CreateProductInput, UpdateProductInput } from '../validators/product.ts'

export type ProductFilters = {
  page: number
  limit: number
  search?: string | undefined
  category?: number | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  sortBy?: string | undefined
  inStock?: boolean | undefined
}

export async function getProductById(id: number) {
  const product = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
    .limit(1)

  if (!product[0]) {
    throw new NotFoundError('Product not found')
  }

  return product[0]
}

export async function listProducts(filters: ProductFilters) {
  const { page, limit, search, category, minPrice, maxPrice, sortBy = 'newest', inStock } = filters
  const offset = (page - 1) * limit

  const conditions = [isNull(productsTable.deletedAt)]

  if (search) {
    conditions.push(
      or(
        ilike(productsTable.name, `%${search}%`),
        ilike(productsTable.description, `%${search}%`),
        ilike(productsTable.sku, `%${search}%`)
      )!
    )
  }

  if (category) {
    conditions.push(eq(productsTable.category, category))
  }

  if (minPrice !== undefined) {
    conditions.push(gte(productsTable.price, minPrice))
  }
  if (maxPrice !== undefined) {
    conditions.push(lte(productsTable.price, maxPrice))
  }

  if (inStock) {
    conditions.push(gt(productsTable.stock, 0))
  }

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

  return {
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
  }
}

export async function createProduct(data: CreateProductInput) {
  const newProduct = await db
    .insert(productsTable)
    .values(data)
    .returning()

  return newProduct[0]
}

export async function updateProduct(id: number, data: UpdateProductInput) {
  const updatedProduct = await db
    .update(productsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
    .returning()

  if (!updatedProduct[0]) {
    throw new NotFoundError('Product not found')
  }

  return updatedProduct[0]
}

export async function deleteProduct(id: number) {
  const deletedProduct = await db
    .update(productsTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(productsTable.id, id), isNull(productsTable.deletedAt)))
    .returning()

  if (!deletedProduct[0]) {
    throw new NotFoundError('Product not found')
  }
}
