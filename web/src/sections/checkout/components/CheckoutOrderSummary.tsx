import { Link } from '@tanstack/react-router'
import type { ActorRefFrom } from 'xstate'
import { useSelector } from '@xstate/react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/formatPrice'
import type { checkoutMachine } from '@/machines/checkoutMachine'
import type { CartItem } from '@/types/cart'

type CheckoutOrderSummaryProps = {
  actorRef: ActorRefFrom<typeof checkoutMachine>
  items: CartItem[]
  subtotal: number
}

export default function CheckoutOrderSummary({ actorRef, items, subtotal }: CheckoutOrderSummaryProps) {
  const shippingMethod = useSelector(actorRef, (state) => state.context.shippingMethod)

  const shippingCost = shippingMethod === 'express' ? 800000 : shippingMethod === 'standard' ? 300000 : 0
  const tax = Math.round(subtotal * 0.21)
  const total = subtotal + shippingCost + tax

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
        <h2 className="text-xl font-bold text-slate-900 mb-4">Resumen del Pedido</h2>

        {/* Cart Items */}
        <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
          {items.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                {item.product.image ? (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                )}
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {item.quantity}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-slate-900 text-sm truncate">
                  {item.product.name}
                </p>
                <p className="text-primary font-semibold text-sm">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button asChild variant="link" className="p-0 h-auto text-primary mb-4">
          <Link to="/cart">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Editar Carrito
          </Link>
        </Button>

        <Separator className="my-4" />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>Envío</span>
            <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>IVA (21%)</span>
            <span>{formatPrice(tax)}</span>
          </div>
        </div>

        <Separator className="my-4" />

        {/* Total */}
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-slate-900">Total</span>
          <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
        </div>

        {/* Trust Badge */}
        <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-700">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
            />
          </svg>
          <span>Tu información está segura y protegida</span>
        </div>
      </div>
    </div>
  )
}
