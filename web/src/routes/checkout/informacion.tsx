import { createFileRoute } from '@tanstack/react-router'
import InformacionStep from '@/sections/checkout/steps/InformacionStep'

export const Route = createFileRoute('/checkout/informacion')({
  component: InformacionStep,
})
