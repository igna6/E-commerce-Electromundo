import { and, asc, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { featuredProductsTable, productsTable } from '../db/schema.ts'
import { ConflictError, NotFoundError } from '../utils/errors.ts'
import type { CreateFeaturedProductInput, UpdateFeaturedProductInput } from '../validators/featuredProduct.ts'

export async function listBySection(section: string) {
  return db
    .select({
      id: featuredProductsTable.id,
      section: featuredProductsTable.section,
      productId: featuredProductsTable.productId,
      position: featuredProductsTable.position,
      metadata: featuredProductsTable.metadata,
      createdAt: featuredProductsTable.createdAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
        price: productsTable.price,
        description: productsTable.description,
        image: productsTable.image,
        category: productsTable.category,
        stock: productsTable.stock,
        sku: productsTable.sku,
      },
    })
    .from(featuredProductsTable)
    .innerJoin(productsTable, eq(featuredProductsTable.productId, productsTable.id))
    .where(
      and(
        eq(featuredProductsTable.section, section),
        isNull(featuredProductsTable.deletedAt),
        isNull(productsTable.deletedAt),
      ),
    )
    .orderBy(asc(featuredProductsTable.position))
}

export async function create(data: CreateFeaturedProductInput) {
  // Check product exists
  const product = await db
    .select({ id: productsTable.id })
    .from(productsTable)
    .where(and(eq(productsTable.id, data.productId), isNull(productsTable.deletedAt)))
    .limit(1)

  if (!product[0]) {
    throw new NotFoundError('Product not found')
  }

  // Check duplicate
  const existing = await db
    .select({ id: featuredProductsTable.id })
    .from(featuredProductsTable)
    .where(
      and(
        eq(featuredProductsTable.section, data.section),
        eq(featuredProductsTable.productId, data.productId),
        isNull(featuredProductsTable.deletedAt),
      ),
    )
    .limit(1)

  if (existing[0]) {
    throw new ConflictError('Product already in this section')
  }

  const result = await db
    .insert(featuredProductsTable)
    .values(data)
    .returning()

  return result[0]
}

export async function update(id: number, data: UpdateFeaturedProductInput) {
  const result = await db
    .update(featuredProductsTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(featuredProductsTable.id, id), isNull(featuredProductsTable.deletedAt)))
    .returning()

  if (!result[0]) {
    throw new NotFoundError('Featured product not found')
  }

  return result[0]
}

export async function remove(id: number) {
  const result = await db
    .update(featuredProductsTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(featuredProductsTable.id, id), isNull(featuredProductsTable.deletedAt)))
    .returning()

  if (!result[0]) {
    throw new NotFoundError('Featured product not found')
  }
}
