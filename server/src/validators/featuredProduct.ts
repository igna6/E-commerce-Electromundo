import { z } from 'zod'

export { idParamSchema } from './common.ts'

export const sectionQuerySchema = z.object({
  section: z.string().min(1, 'Section is required'),
})

export const createFeaturedProductSchema = z.object({
  section: z.string().min(1, 'Section is required'),
  productId: z.number().int().positive(),
  position: z.number().int().min(0).default(0),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
})

export const updateFeaturedProductSchema = z.object({
  position: z.number().int().min(0).optional(),
  metadata: z.record(z.string(), z.unknown()).optional().nullable(),
})

export type CreateFeaturedProductInput = z.infer<typeof createFeaturedProductSchema>
export type UpdateFeaturedProductInput = z.infer<typeof updateFeaturedProductSchema>
