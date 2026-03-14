import { createFileRoute } from '@tanstack/react-router'
import ReturnsPage from '@/sections/info/ReturnsPage'

export const Route = createFileRoute('/returns')({
  component: ReturnsPage,
})
