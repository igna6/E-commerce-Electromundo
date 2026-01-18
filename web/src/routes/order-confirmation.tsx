import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import OrderConfirmationPage from '@/sections/order-confirmation/OrderConfirmationPage'

const searchSchema = z.object({
  orderId: z.number().catch(0),
})

export const Route = createFileRoute('/order-confirmation')({
  validateSearch: searchSchema,
  component: OrderConfirmationPage,
})
