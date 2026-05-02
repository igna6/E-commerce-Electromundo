import { createFileRoute } from '@tanstack/react-router'
import FeaturedProductsPage from '@/sections/admin/FeaturedProductsPage'

export const Route = createFileRoute('/admin/featured-products')({
  component: FeaturedProductsPage,
})
