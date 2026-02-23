import { createFileRoute } from '@tanstack/react-router'
import CategoriesPage from '@/sections/admin/CategoriesPage'

export const Route = createFileRoute('/admin/categories')({
  component: CategoriesPage,
})
