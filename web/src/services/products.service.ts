import { apiRequest } from './api'
import type { Product } from '../types/product'
import type { PaginatedResponse } from '../types/api'

export type GetProductsParams = {
  page?: number
  limit?: number
}

export async function getProducts(
  params: GetProductsParams = {},
): Promise<PaginatedResponse<Product>> {
  const { page = 1, limit = 12 } = params
  return apiRequest<PaginatedResponse<Product>>(
    `/api/products?page=${page}&limit=${limit}`,
  )
}
