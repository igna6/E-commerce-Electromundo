import { createFileRoute } from '@tanstack/react-router'
import BannersPage from '@/sections/admin/BannersPage'

export const Route = createFileRoute('/admin/banners')({
  component: BannersPage,
})
