import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Heart, Package, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/product'
import { useCart } from '@/contexts/CartContext'
import { applyTax, formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

type ProductCardProps = {
  product: Product
  categoryName?: string
}

function ProductCard({ product, categoryName }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [wished, setWished] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 1500)
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setWished(!wished)
  }

  const hasPromotion =
    product.promotionPrice != null && product.promotionPrice < product.price
  const effectivePrice = hasPromotion ? product.promotionPrice! : product.price
  const priceWithTax = applyTax(effectivePrice)
  const originalPriceWithTax = hasPromotion ? applyTax(product.price) : null
  const discount = hasPromotion
    ? Math.round(
        ((product.price - product.promotionPrice!) / product.price) * 100,
      )
    : 0

  return (
    <Link
      to="/products/$productId"
      params={{ productId: String(product.id) }}
      className="group block bg-white rounded-xl border border-slate-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 flex flex-col"
    >
      {/* Image area */}
      <div className="relative bg-slate-50 aspect-square">
        {product.image ? (
          <img
            src={product.image}
            alt={toTitleCase(product.name)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 p-4"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-300" />
          </div>
        )}

        {/* Badges top-left */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {hasPromotion && (
            <span className="bg-red-500 text-white text-[10px] font-black px-2 py-0.5 rounded">
              -{discount}%
            </span>
          )}
          {product.stock <= 3 && product.stock > 0 && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              ¡ÚLTIMAS UNIDADES!
            </span>
          )}
          {product.stock === 0 && (
            <span className="bg-slate-500 text-white text-[10px] font-bold px-2 py-0.5 rounded">
              SIN STOCK
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-white shadow-sm hover:shadow-md transition-all"
        >
          <Heart
            size={16}
            className={wished ? 'fill-red-500 text-red-500' : 'text-slate-400'}
          />
        </button>
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {categoryName && (
          <p className="text-[10px] text-primary font-semibold uppercase tracking-wide mb-0.5">
            {categoryName}
          </p>
        )}
        <h3 className="text-sm text-slate-800 leading-tight mb-2 flex-1 line-clamp-2 group-hover:text-primary transition-colors">
          {toTitleCase(product.name)}
        </h3>

        {/* Price */}
        <div className="mb-2">
          <div className="flex items-baseline gap-1.5 flex-wrap">
            <p className="text-xl font-black text-slate-900">
              {formatPrice(priceWithTax)}
            </p>
            {originalPriceWithTax && (
              <span className="text-xs text-gray-400 line-through">
                {formatPrice(originalPriceWithTax)}
              </span>
            )}
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            product.stock === 0
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
              : isAdding
                ? 'bg-emerald-500 text-white'
                : 'bg-amber-500 hover:bg-amber-600 text-white'
          }`}
        >
          {isAdding ? (
            <>
              <Check size={14} /> ¡Agregado!
            </>
          ) : (
            <>
              <ShoppingCart size={14} /> Agregar al carrito
            </>
          )}
        </button>
      </div>
    </Link>
  )
}

export default ProductCard
