import { createFileRoute } from '@tanstack/react-router'
import ProductDetail from '@/sections/products/ProductDetail/ProductDetail'

export const Route = createFileRoute('/products/$productId')({
  component: ProductDetail,
})
