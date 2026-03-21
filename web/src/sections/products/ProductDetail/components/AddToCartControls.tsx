import {
  Check,
  Minus,
  PackageCheck,
  Plus,
  RotateCcw,
  Shield,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import type { Product } from '@/types/product'
import { applyTax, formatPrice } from '@/utils/formatPrice'

type AddToCartControlsProps = {
  product: Product
  quantity: number
  onQuantityChange: (quantity: number) => void
  onAddToCart: () => void
  isAdding: boolean
}

export default function AddToCartControls({
  product,
  quantity,
  onQuantityChange,
  onAddToCart,
  isAdding,
}: AddToCartControlsProps) {
  const hasPromotion = product.promotionPrice != null && product.promotionPrice < product.price
  const effectivePrice = hasPromotion ? product.promotionPrice! : product.price
  const priceWithTax = applyTax(effectivePrice)
  const total = priceWithTax * quantity

  return (
    <div className="flex flex-col gap-3">
      {/* Buy card */}
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
        {/* Quantity */}
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold text-gray-700">Cantidad</span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
            >
              <Minus size={14} className="text-gray-600" />
            </button>
            <span className="w-10 text-center font-black text-gray-800">{quantity}</span>
            <button
              onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
              disabled={product.stock === 0 || quantity >= product.stock}
              className="w-8 h-8 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus size={14} className="text-gray-600" />
            </button>
          </div>
        </div>

        {/* Stock warning */}
        {product.stock > 0 && product.stock <= 5 && (
          <div className="mb-3 text-xs text-amber-500 font-semibold flex items-center gap-1.5">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            &iexcl;Solo quedan {product.stock} unidades disponibles!
          </div>
        )}

        {/* Total */}
        <div className="flex items-center justify-between mb-3 bg-white rounded-xl px-3 py-2 border border-gray-100">
          <span className="text-xs text-gray-500">Total</span>
          <span className="font-black text-lg text-gray-900">{formatPrice(total)}</span>
        </div>

        {/* Add to cart */}
        <button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all mb-2 ${
            product.stock === 0
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : isAdding
                ? 'bg-emerald-500 text-white'
                : 'bg-brand-orange hover:bg-orange-600 text-white hover:shadow-lg active:scale-95'
          }`}
        >
          {product.stock === 0 ? (
            'Producto Agotado'
          ) : isAdding ? (
            <>
              <Check size={16} />
              &iexcl;Agregado al carrito!
            </>
          ) : (
            <>
              <ShoppingCart size={16} />
              Agregar al carrito
            </>
          )}
        </button>

        {/* Buy now */}
        <button className="w-full py-3 rounded-xl font-black text-sm border-2 border-electric-cyan text-electric-cyan hover:bg-electric-cyan hover:text-white flex items-center justify-center gap-2 transition-all">
          <Zap size={16} />
          Comprar ahora
        </button>
      </div>

      {/* Trust badges */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-2.5">
        {[
          { icon: Shield, color: '#4caf50', bg: '#4caf5018', text: 'Garantía oficial 12 meses' },
          { icon: RotateCcw, color: '#9c27b0', bg: '#9c27b018', text: 'Devolución gratis en 30 días' },
          { icon: PackageCheck, color: '#00D4FF', bg: '#00D4FF18', text: 'Producto 100% original' },
        ].map(({ icon: Icon, color, bg, text }) => (
          <div key={text} className="flex items-center gap-2.5">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: bg }}
            >
              <Icon size={14} style={{ color }} />
            </div>
            <span className="text-xs text-gray-600">{text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
