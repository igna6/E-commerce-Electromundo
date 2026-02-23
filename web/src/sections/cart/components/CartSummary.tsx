import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/formatPrice'

type CartSummaryProps = {
  subtotal: number
  shipping: number
  discount: number
  total: number
}

export default function CartSummary({ subtotal, shipping, discount, total }: CartSummaryProps) {
  const [couponCode, setCouponCode] = useState('')

  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
        <h2 className="text-xl font-bold text-brand-dark mb-6">Resumen del Pedido</h2>

        {/* Coupon Code */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Código de Descuento
          </label>
          <div className="flex gap-2">
            <Input
              placeholder="Ingresa tu código"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button variant="outline">Aplicar</Button>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Price Breakdown */}
        <div className="space-y-3">
          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span className="flex items-center gap-1">
              Envío
              {shipping === 0 && (
                <Badge className="bg-green-100 text-green-700 text-xs">Gratis</Badge>
              )}
            </span>
            <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Descuento</span>
              <span>-{formatPrice(discount)}</span>
            </div>
          )}
        </div>

        <Separator className="my-6" />

        {/* Total */}
        <div className="flex justify-between items-center mb-6">
          <span className="text-lg font-semibold text-brand-dark">Total</span>
          <span className="text-2xl font-bold text-brand-orange">{formatPrice(total)}</span>
        </div>

        {/* Financing Info */}
        <div className="bg-brand-light rounded-lg p-4 mb-6">
          <p className="text-sm text-brand-blue">
            <span className="font-semibold">12 cuotas sin interés</span> de{' '}
            <span className="font-bold">{formatPrice(Math.round(total / 12))}</span>
          </p>
        </div>

        {/* Checkout Button */}
        <Button
          asChild
          size="lg"
          className="w-full h-14 text-lg bg-electric-orange hover:bg-orange-600 text-white mb-4"
        >
          <Link to="/checkout">
            Continuar al Checkout
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </Button>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 gap-3 mt-6">
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
              />
            </svg>
            <span className="text-xs text-gray-600">Compra Segura</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-xs text-gray-600">30 Días Devolución</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
            <span className="text-xs text-gray-600">Pago Seguro</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
            <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-xs text-gray-600">Garantía</span>
          </div>
        </div>
      </div>
    </div>
  )
}
