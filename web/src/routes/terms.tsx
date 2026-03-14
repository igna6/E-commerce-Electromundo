import { createFileRoute } from '@tanstack/react-router'
import TermsPage from '@/sections/info/TermsPage'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
})
