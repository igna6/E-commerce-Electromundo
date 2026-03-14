import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/sections/products/ProductsPage/ProductsPage'

type ProductsSearch = {
  search?: string
  category?: number
  minPrice?: number
  maxPrice?: number
  sortBy?: string
  inStock?: boolean
}

function parseOptionalNumber(value: unknown): number | undefined {
  if (typeof value === 'number') return value
  if (typeof value === 'string' && !Number.isNaN(Number(value))) return Number(value)
  return undefined
}

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    category: parseOptionalNumber(search.category),
    minPrice: parseOptionalNumber(search.minPrice),
    maxPrice: parseOptionalNumber(search.maxPrice),
    sortBy: typeof search.sortBy === 'string' ? search.sortBy : undefined,
    inStock: search.inStock === true || search.inStock === 'true' ? true : undefined,
  }),
  component: ProductsPage,
})
