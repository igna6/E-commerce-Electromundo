import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
})

export const createProductSchema = z.object({
  name: z.string().min(1, 'Product name is required').max(200),
  price: z.number().int().positive('Price must be positive'),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  category: z.number().int().positive().optional().nullable(),
})

export const updateProductSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  price: z.number().int().positive().optional(),
  description: z.string().optional().nullable(),
  image: z.string().url().optional().nullable(),
  category: z.number().int().positive().optional().nullable(),
})

export type CreateProductInput = z.infer<typeof createProductSchema>
export type UpdateProductInput = z.infer<typeof updateProductSchema>
