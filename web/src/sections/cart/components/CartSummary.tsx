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
        <div className="flex justify-between items-center mb-2">
          <span className="text-lg font-semibold text-brand-dark">Total</span>
          <span className="text-2xl font-bold text-brand-orange">{formatPrice(total)}</span>
        </div>
        <p className="text-xs text-gray-400 mb-6">IVA incluido</p>

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

      </div>
    </div>
  )
}
