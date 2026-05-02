import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useCart } from '@/contexts/CartContext'
import { CheckoutProvider } from '@/contexts/CheckoutContext'

function CheckoutLayout() {
  const navigate = useNavigate()
  const { items } = useCart()
  const availableItems = items.filter((item) => item.product.stock > 0)
  const subtotal = availableItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  )

  useEffect(() => {
    if (availableItems.length === 0) {
      navigate({ to: '/cart' })
    }
  }, [availableItems.length, navigate])

  if (availableItems.length === 0) {
    return null
  }

  return (
    <CheckoutProvider items={availableItems} subtotal={subtotal}>
      <Outlet />
    </CheckoutProvider>
  )
}

export const Route = createFileRoute('/checkout')({
  component: CheckoutLayout,
})
