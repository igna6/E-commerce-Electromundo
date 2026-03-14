import { ApiError, apiRequest } from './api'
import type { User } from '@/contexts/AuthContext'

type LoginResponse = {
  accessToken: string
  refreshToken: string
  user: User
}

type RefreshResponse = {
  accessToken: string
  refreshToken: string
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  const response = await apiRequest<{ data: LoginResponse }>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  return response.data
}

export async function logout(refreshToken: string): Promise<void> {
  await apiRequest('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  const response = await apiRequest<{ data: RefreshResponse }>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
  return response.data
}

export async function getMe(accessToken: string): Promise<{ data: User }> {
  return apiRequest<{ data: User }>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export { ApiError }
