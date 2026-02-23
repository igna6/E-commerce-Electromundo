import { createFileRoute } from '@tanstack/react-router'
import OrderDetailPage from '@/sections/admin/OrderDetailPage'

export const Route = createFileRoute('/admin/orders/$orderId')({
  component: OrderDetailPage,
})
