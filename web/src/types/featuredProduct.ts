import type { Product } from './product'

export type FeaturedProduct = {
  id: number
  section: string
  productId: number
  position: number
  metadata: Record<string, unknown> | null
  createdAt: string
  product: Product
}
