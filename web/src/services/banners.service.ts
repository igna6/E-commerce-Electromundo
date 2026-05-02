import { apiRequest, authApiRequest } from './api'
import type { Banner } from '../types/banner'

export async function getActiveBanners(): Promise<{ data: Array<Banner> }> {
  return apiRequest<{ data: Array<Banner> }>('/api/banners')
}

export async function getAllBanners(): Promise<{ data: Array<Banner> }> {
  return authApiRequest<{ data: Array<Banner> }>('/api/admin/banners')
}

export async function getBanner(id: number): Promise<{ data: Banner }> {
  return authApiRequest<{ data: Banner }>(`/api/admin/banners/${id}`)
}

export async function createBanner(data: {
  title: string
  subtitle?: string | null
  buttonText?: string | null
  buttonLink?: string | null
  image?: string | null
  displayOrder?: number
  isActive?: boolean
}): Promise<{ data: Banner }> {
  return authApiRequest<{ data: Banner }>('/api/admin/banners', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function updateBanner(
  id: number,
  data: Partial<{
    title: string
    subtitle: string | null
    buttonText: string | null
    buttonLink: string | null
    image: string | null
    displayOrder: number
    isActive: boolean
  }>,
): Promise<{ data: Banner }> {
  return authApiRequest<{ data: Banner }>(`/api/admin/banners/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export async function deleteBanner(id: number): Promise<{ message: string }> {
  return authApiRequest<{ message: string }>(`/api/admin/banners/${id}`, {
    method: 'DELETE',
  })
}
