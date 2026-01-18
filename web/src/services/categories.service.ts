import { apiRequest } from './api'
import type { Category } from '../types/category'

export async function getCategories(): Promise<{ data: Category[] }> {
  return apiRequest<{ data: Category[] }>('/api/categories')
}

export async function getCategory(id: number): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/api/categories/${id}`)
}

export async function createCategory(data: {
  name: string
  description?: string | null
}): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>('/api/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateCategory(
  id: number,
  data: Partial<{ name: string; description: string | null }>
): Promise<{ data: Category }> {
  return apiRequest<{ data: Category }>(`/api/categories/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteCategory(id: number): Promise<{ message: string }> {
  return apiRequest<{ message: string }>(`/api/categories/${id}`, {
    method: 'DELETE',
  })
}
