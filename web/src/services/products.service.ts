import { apiRequest } from './api'
import type { Product } from '../types/product'
import type { PaginatedResponse } from '../types/api'

export type GetProductsParams = {
  page?: number
  limit?: number
  search?: string
  category?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: 'newest' | 'price-asc' | 'price-desc' | 'name'
}

export type ProductsResponse = PaginatedResponse<Product> & {
  filters?: {
    search?: string
    category?: number
    minPrice?: number
    maxPrice?: number
    sortBy?: string
  }
}

export async function getProducts(
  params: GetProductsParams = {}
): Promise<ProductsResponse> {
  const queryParams = new URLSearchParams()

  if (params.page) queryParams.append('page', params.page.toString())
  if (params.limit) queryParams.append('limit', params.limit.toString())
  if (params.search) queryParams.append('search', params.search)
  if (params.category) queryParams.append('category', params.category.toString())
  if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice.toString())
  if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice.toString())
  if (params.sortBy) queryParams.append('sortBy', params.sortBy)

  const queryString = queryParams.toString()
  const endpoint = `/api/products${queryString ? `?${queryString}` : ''}`

  return apiRequest<ProductsResponse>(endpoint)
}

export async function getProduct(id: number): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/api/products/${id}`)
}

export async function createProduct(data: {
  name: string
  price: number
  description?: string | null
  image?: string | null
  category?: number | null
}): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>('/api/products', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateProduct(
  id: number,
  data: Partial<{
    name: string
    price: number
    description: string | null
    image: string | null
    category: number | null
  }>
): Promise<{ data: Product }> {
  return apiRequest<{ data: Product }>(`/api/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteProduct(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/products/${id}`, {
    method: 'DELETE',
  })
}
