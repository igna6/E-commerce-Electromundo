import { z } from 'zod'

export const orderItemSchema = z.object({
  productId: z.number().int().positive('Product ID must be positive'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
})

export const createOrderSchema = z.object({
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone is required').max(50),
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  address: z.string().max(255).optional().nullable(),
  apartment: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  province: z.string().max(100).optional().nullable(),
  zipCode: z.string().max(20).optional().nullable(),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

export const orderStatusSchema = z.enum([
  'pending',
  'confirmed',
  'shipped',
  'delivered',
  'cancelled',
])

export type OrderStatus = z.infer<typeof orderStatusSchema>

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
