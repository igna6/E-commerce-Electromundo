import { createFileRoute } from '@tanstack/react-router'
import FlashSalePage from '@/sections/admin/FlashSalePage'

export const Route = createFileRoute('/admin/flash-sale')({
  component: FlashSalePage,
})
