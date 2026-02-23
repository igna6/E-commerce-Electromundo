import { createFileRoute } from '@tanstack/react-router'
import DashboardPage from '@/sections/admin/DashboardPage'

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardPage,
})
