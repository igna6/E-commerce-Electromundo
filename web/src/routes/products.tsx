import { createFileRoute } from '@tanstack/react-router'
import ProductsPage from '@/sections/products/ProductsPage/ProductsPage'

export const Route = createFileRoute('/products')({
  component: ProductsPage,
})
