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
  address: z.string().min(1, 'Address is required').max(255),
  apartment: z.string().max(100).optional().nullable(),
  city: z.string().min(1, 'City is required').max(100),
  province: z.string().min(1, 'Province is required').max(100),
  zipCode: z.string().min(1, 'Zip code is required').max(20),
  shippingMethod: z.enum(['pickup', 'standard', 'express'], {
    message: 'Invalid shipping method',
  }),
  paymentMethod: z.enum(['card', 'mercadopago', 'transfer'], {
    message: 'Invalid payment method',
  }),
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
})

export type CreateOrderInput = z.infer<typeof createOrderSchema>
export type OrderItemInput = z.infer<typeof orderItemSchema>
