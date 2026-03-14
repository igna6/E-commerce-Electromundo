import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/sections/products/ProductsPage/ProductsPage'

type ProductsSearch = {
  search?: string
}

export const Route = createFileRoute('/products/')({
  validateSearch: (search: Record<string, unknown>): ProductsSearch => ({
    search: typeof search.search === 'string' ? search.search : undefined,
  }),
  component: ProductsPage,
})
