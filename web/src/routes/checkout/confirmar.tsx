import { Navigate, createFileRoute } from '@tanstack/react-router'
import { useCheckout } from '@/contexts/CheckoutContext'
import ConfirmarStep from '@/sections/checkout/steps/ConfirmarStep'

function ConfirmarRoute() {
  const { canAccessStep } = useCheckout()

  if (!canAccessStep('confirmar')) {
    return <Navigate to="/checkout/informacion" />
  }

  return <ConfirmarStep />
}

export const Route = createFileRoute('/checkout/confirmar')({
  component: ConfirmarRoute,
})
