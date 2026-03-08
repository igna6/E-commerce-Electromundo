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
import ContactShippingForm from './components/ContactShippingForm'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
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
      navigate({ to: '/order-confirmation', search: { orderId: (event as { id: number }).id } })
    }
  }, [state, clearCart, navigate])

  const handleSubmit = async () => {
    const isValid = await trigger()
    if (!isValid) return

    const data = getValues()
    actorRef.send({
      type: 'SUBMIT',
      formData: {
        ...data,
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      },
    })
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <ContactShippingForm
              register={register}
              errors={errors}
              onSubmit={handleSubmit}
              isSubmitting={state.matches('submitting')}
              submitError={state.context.submitError}
              stockErrors={state.context.stockErrors}
            />
          </div>

          {/* Order Summary */}
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
          />
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
