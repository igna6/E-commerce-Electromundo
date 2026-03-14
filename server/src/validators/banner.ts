import { z } from 'zod'

export { idParamSchema } from './common.ts'

export const createBannerSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200),
  subtitle: z.string().max(500).optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonLink: z.string().max(500).optional().nullable(),
  image: z.string().max(1000).optional().nullable(),
  displayOrder: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
})

export const updateBannerSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  subtitle: z.string().max(500).optional().nullable(),
  buttonText: z.string().max(100).optional().nullable(),
  buttonLink: z.string().max(500).optional().nullable(),
  image: z.string().max(1000).optional().nullable(),
  displayOrder: z.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export type CreateBannerInput = z.infer<typeof createBannerSchema>
export type UpdateBannerInput = z.infer<typeof updateBannerSchema>
