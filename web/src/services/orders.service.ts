import { apiRequest } from './api'
import type { CreateOrderPayload, Order } from '../types/order'

export async function createOrder(data: CreateOrderPayload): Promise<{ data: Order }> {
  return apiRequest<{ data: Order }>('/api/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export async function getOrder(id: number, token: string): Promise<{ data: Order }> {
  return apiRequest<{ data: Order }>(`/api/orders/${id}?token=${encodeURIComponent(token)}`)
}
