import { createFileRoute } from '@tanstack/react-router'
import ShippingPage from '@/sections/info/ShippingPage'

export const Route = createFileRoute('/shipping')({
  component: ShippingPage,
})
