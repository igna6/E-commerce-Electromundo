import { createFileRoute } from '@tanstack/react-router'
import CheckoutPage from '@/sections/checkout/CheckoutPage'

export const Route = createFileRoute('/checkout')({
  component: CheckoutPage,
})
