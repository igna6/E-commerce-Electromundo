import { z } from 'zod'

export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a valid number').transform(Number),
})

const coerceInt = z.coerce.number().int()

export const paginationQuerySchema = z.object({
  page: coerceInt.min(1).default(1),
  limit: coerceInt.min(1).max(50).default(20),
})

export const productListQuerySchema = paginationQuerySchema.extend({
  limit: coerceInt.min(1).max(50).default(12),
  search: z.string().optional(),
  category: coerceInt.positive().optional(),
  minPrice: coerceInt.min(0).optional(),
  maxPrice: coerceInt.min(0).optional(),
  sortBy: z.string().default('newest'),
  inStock: z.enum(['true', 'false']).default('false').transform(v => v === 'true'),
})

export const orderListQuerySchema = paginationQuerySchema.extend({
  status: z.string().optional(),
})
