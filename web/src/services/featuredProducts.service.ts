import { apiRequest, authApiRequest } from './api'
import type { FeaturedProduct } from '../types/featuredProduct'

export async function getFeaturedProducts(
  section: string,
): Promise<{ data: Array<FeaturedProduct> }> {
  return apiRequest<{ data: Array<FeaturedProduct> }>(
    `/api/featured-products?section=${encodeURIComponent(section)}`,
  )
}

export async function getAdminFeaturedProducts(
  section: string,
): Promise<{ data: Array<FeaturedProduct> }> {
  return authApiRequest<{ data: Array<FeaturedProduct> }>(
    `/api/admin/featured-products?section=${encodeURIComponent(section)}`,
  )
}

export async function addFeaturedProduct(data: {
  section: string
  productId: number
  position?: number
  metadata?: Record<string, unknown> | null
}): Promise<{ data: FeaturedProduct }> {
  return authApiRequest<{ data: FeaturedProduct }>(
    '/api/admin/featured-products',
    {
      method: 'POST',
      body: JSON.stringify(data),
    },
  )
}

export async function updateFeaturedProduct(
  id: number,
  data: { position?: number; metadata?: Record<string, unknown> | null },
): Promise<{ data: FeaturedProduct }> {
  return authApiRequest<{ data: FeaturedProduct }>(
    `/api/admin/featured-products/${id}`,
    {
      method: 'PUT',
      body: JSON.stringify(data),
    },
  )
}

export async function removeFeaturedProduct(
  id: number,
): Promise<{ message: string }> {
  return authApiRequest<{ message: string }>(
    `/api/admin/featured-products/${id}`,
    { method: 'DELETE' },
  )
}
