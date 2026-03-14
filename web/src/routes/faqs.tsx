import { createFileRoute } from '@tanstack/react-router'
import FaqsPage from '@/sections/info/FaqsPage'

export const Route = createFileRoute('/faqs')({
  component: FaqsPage,
})
