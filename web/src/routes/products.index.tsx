import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/sections/products/ProductsPage/ProductsPage'

type ProductsSearch = {
  search?: string
  category?: number
}

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
    category:
      typeof search.category === 'number'
        ? search.category
        : typeof search.category === 'string' && !Number.isNaN(Number(search.category))
          ? Number(search.category)
          : undefined,
  }),
  component: ProductsPage,
})
