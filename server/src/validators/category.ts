import { z } from 'zod'

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  description: z.string().optional().nullable(),
})

export const updateCategorySchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().optional().nullable(),
})

export type CreateCategoryInput = z.infer<typeof createCategorySchema>
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>
