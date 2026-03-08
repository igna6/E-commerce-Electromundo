import { and, asc, eq, isNull } from 'drizzle-orm'
import db from '../db/db.ts'
import { bannersTable } from '../db/schema.ts'
import { NotFoundError } from '../utils/errors.ts'
import type { CreateBannerInput, UpdateBannerInput } from '../validators/banner.ts'

export async function listActiveBanners() {
  return db
    .select()
    .from(bannersTable)
    .where(and(eq(bannersTable.isActive, true), isNull(bannersTable.deletedAt)))
    .orderBy(asc(bannersTable.displayOrder))
}

export async function listAllBanners() {
  return db
    .select()
    .from(bannersTable)
    .where(isNull(bannersTable.deletedAt))
    .orderBy(asc(bannersTable.displayOrder))
}

export async function getBannerById(id: number) {
  const banner = await db
    .select()
    .from(bannersTable)
    .where(and(eq(bannersTable.id, id), isNull(bannersTable.deletedAt)))
    .limit(1)

  if (!banner[0]) {
    throw new NotFoundError('Banner not found')
  }

  return banner[0]
}

export async function createBanner(data: CreateBannerInput) {
  const newBanner = await db
    .insert(bannersTable)
    .values(data)
    .returning()

  return newBanner[0]
}

export async function updateBanner(id: number, data: UpdateBannerInput) {
  const updatedBanner = await db
    .update(bannersTable)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(bannersTable.id, id), isNull(bannersTable.deletedAt)))
    .returning()

  if (!updatedBanner[0]) {
    throw new NotFoundError('Banner not found')
  }

  return updatedBanner[0]
}

export async function deleteBanner(id: number) {
  const deletedBanner = await db
    .update(bannersTable)
    .set({ deletedAt: new Date() })
    .where(and(eq(bannersTable.id, id), isNull(bannersTable.deletedAt)))
    .returning()

  if (!deletedBanner[0]) {
    throw new NotFoundError('Banner not found')
  }
}
