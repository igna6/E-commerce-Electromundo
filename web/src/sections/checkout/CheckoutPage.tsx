import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMachine } from '@xstate/react'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useCart } from '@/contexts/CartContext'
import { checkoutMachine } from '@/machines/checkoutMachine'
import CheckoutSteps from './components/CheckoutSteps'
import ContactShippingForm from './components/ContactShippingForm'
import ShippingMethodStep from './components/ShippingMethodStep'
import PaymentMethodStep from './components/PaymentMethodStep'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  address: z.string().min(1, 'Dirección requerida'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'Ciudad requerida'),
  province: z.string().min(1, 'Provincia requerida'),
  zipCode: z.string().min(1, 'Código postal requerido'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [state, , actorRef] = useMachine(checkoutMachine, {
    input: { items },
  })

  const {
    register,
    getValues,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: '/cart' })
    }
  }, [items.length, navigate])

  // Navigate on successful order
  useEffect(() => {
    if (state.matches('success')) {
      const event = state.output
      clearCart()
      navigate({ to: '/order-confirmation', search: { orderId: (event as any).id } })
    }
  }, [state, clearCart, navigate])

  const handleContactNext = async () => {
    const isValid = await trigger(['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'province', 'zipCode'])
    if (isValid) {
      actorRef.send({ type: 'NEXT' })
    }
  }

  const handlePaymentSubmit = () => {
    const data = getValues()
    const parseResult = checkoutSchema.safeParse(data)
    if (!parseResult.success) return null

    return {
      ...parseResult.data,
      apartment: parseResult.data.apartment || null,
      shippingMethod: state.context.shippingMethod,
      paymentMethod: state.context.paymentMethod,
      items: items.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
    }
  }

  if (items.length === 0) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/cart">Carrito</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Checkout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <CheckoutSteps actorRef={actorRef} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {state.matches('contactInfo') && (
              <ContactShippingForm
                register={register}
                errors={errors}
                onNext={handleContactNext}
              />
            )}

            {state.matches('shipping') && (
              <ShippingMethodStep actorRef={actorRef} />
            )}

            {(state.matches('payment') || state.matches('submitting')) && (
              <PaymentMethodStep
                actorRef={actorRef}
                onSubmit={handlePaymentSubmit}
              />
            )}
          </div>

          {/* Order Summary */}
          <CheckoutOrderSummary
            actorRef={actorRef}
            items={items}
            subtotal={subtotal}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
