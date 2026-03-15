import { useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useMachine } from '@xstate/react'
import CheckoutStepLayout from '../CheckoutStepLayout'
import type { CheckoutData } from '@/contexts/CheckoutContext'
import { useCheckout } from '@/contexts/CheckoutContext'
import { useCart } from '@/contexts/CartContext'
import { checkoutMachine } from '@/machines/checkoutMachine'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { applyTax, formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

export default function ConfirmarStep() {
  const navigate = useNavigate()
  const { data, items, subtotal } = useCheckout()
  const { clearCart } = useCart()
  const d = data as CheckoutData

  const [state, , actorRef] = useMachine(checkoutMachine, {
    input: { items },
  })

  useEffect(() => {
    if (state.matches('success') && state.context.orderResult) {
      navigate({
        to: '/order-confirmation',
        search: {
          orderId: state.context.orderResult.id,
          token: state.context.orderResult.accessToken,
        },
      }).then(() => clearCart())
    }
  }, [state, clearCart, navigate])

  const total = applyTax(subtotal)

  const handleConfirm = () => {
    actorRef.send({
      type: 'SUBMIT',
      formData: {
        email: d.email,
        phone: d.phone,
        firstName: d.firstName,
        lastName: d.lastName,
        shippingMethod: 'pickup',
        paymentMethod: 'cash',
        items: items.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      },
    })
  }

  return (
    <CheckoutStepLayout currentStep="confirmar" stepLabel="Confirmar">
      <div className="space-y-6">
        {/* Error */}
        {state.context.submitError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            <p className="font-medium">{state.context.submitError}</p>
            {state.context.stockErrors.length > 0 && (
              <ul className="mt-2 space-y-1">
                {state.context.stockErrors.map((item, i) => (
                  <li key={i}>
                    <strong>{toTitleCase(item.productName)}</strong>: pediste{' '}
                    {item.requested}, disponible{' '}
                    {item.available === 0 ? 'agotado' : item.available}
                  </li>
                ))}
              </ul>
            )}
            <Link
              to="/cart"
              className="inline-block mt-2 text-primary hover:underline font-medium"
            >
              Volver al carrito para ajustar
            </Link>
          </div>
        )}

        {/* Contact Info Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-900">Contacto</h3>
            <Button
              variant="link"
              className="p-0 h-auto text-primary"
              onClick={() => navigate({ to: '/checkout/informacion' })}
            >
              Editar
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-500">Nombre:</span>{' '}
              <span className="font-medium text-slate-900">
                {d.firstName} {d.lastName}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>{' '}
              <span className="font-medium text-slate-900">{d.email}</span>
            </div>
            <div>
              <span className="text-gray-500">Telefono:</span>{' '}
              <span className="font-medium text-slate-900">{d.phone}</span>
            </div>
          </div>
        </div>

        {/* Shipping & Payment Info */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <Badge variant="secondary">Retiro en sucursal</Badge>
            </div>
            <div className="flex items-center gap-2">
              <svg
                className="w-5 h-5 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                />
              </svg>
              <Badge variant="secondary">MercadoPago</Badge>
            </div>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-slate-900 mb-4">
            Productos
          </h3>
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.product.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={toTitleCase(item.product.name)}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {toTitleCase(item.product.name)}
                    </p>
                    <p className="text-gray-500">Cant: {item.quantity}</p>
                  </div>
                </div>
                <p className="font-semibold text-slate-900">
                  {formatPrice(applyTax(item.product.price * item.quantity))}
                </p>
              </div>
            ))}
          </div>

          <Separator className="my-4" />

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
          <Separator className="my-4" />
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold text-slate-900">Total</span>
            <span className="text-2xl font-bold text-primary">
              {formatPrice(total)}
            </span>
          </div>
          <p className="text-xs text-gray-400 mt-1">IVA incluido</p>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={() => navigate({ to: '/checkout/informacion' })}
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Volver
          </Button>
          <Button
            type="button"
            size="lg"
            className="bg-primary hover:bg-primary/90"
            disabled={state.matches('submitting')}
            onClick={handleConfirm}
          >
            {state.matches('submitting') ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Procesando...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Confirmar Pedido
              </>
            )}
          </Button>
        </div>
      </div>
    </CheckoutStepLayout>
  )
}
