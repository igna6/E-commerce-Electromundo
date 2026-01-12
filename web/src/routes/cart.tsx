import { createFileRoute } from '@tanstack/react-router'
import CartPage from '@/sections/cart/CartPage'

export const Route = createFileRoute('/cart')({
  component: CartPage,
})
