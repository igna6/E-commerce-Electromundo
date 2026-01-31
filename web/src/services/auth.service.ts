import { apiRequest, ApiError } from './api'
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

type MeResponse = {
  data: User
}

export async function login(email: string, password: string): Promise<LoginResponse> {
  return apiRequest<LoginResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function logout(refreshToken: string): Promise<void> {
  await apiRequest('/api/auth/logout', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export async function refreshAccessToken(refreshToken: string): Promise<RefreshResponse> {
  return apiRequest<RefreshResponse>('/api/auth/refresh', {
    method: 'POST',
    body: JSON.stringify({ refreshToken }),
  })
}

export async function getMe(accessToken: string): Promise<MeResponse> {
  return apiRequest<MeResponse>('/api/auth/me', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
}

export { ApiError }
