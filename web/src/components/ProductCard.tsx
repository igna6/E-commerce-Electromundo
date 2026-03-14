import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Package, ShoppingCart } from 'lucide-react'
import type { Product } from '@/types/product'
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

type ProductCardProps = {
  product: Product
  categoryName?: string
}

function ProductCard({ product, categoryName }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem(product, 1)
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 1000)
  }

  return (
    <Link
      to="/products/$productId"
      params={{ productId: String(product.id) }}
      className="group block bg-white rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-square bg-slate-50 relative overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={toTitleCase(product.name)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-12 h-12 text-slate-300" />
          </div>
        )}

        {/* Quick add button */}
        <button
          onClick={handleAddToCart}
          className={`absolute bottom-3 right-3 p-2.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-200 ${
            isAdding
              ? 'bg-emerald-500 text-white'
              : 'bg-white text-slate-700 hover:bg-primary hover:text-white'
          }`}
        >
          {isAdding ? (
            <Check className="w-4 h-4" />
          ) : (
            <ShoppingCart className="w-4 h-4" />
          )}
        </button>

        {/* Stock badge */}
        {product.stock <= 3 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-amber-500 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg">
            Ultimas unidades
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        {categoryName && (
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1">
            {categoryName}
          </p>
        )}
        <h3 className="font-medium text-slate-800 text-sm sm:text-base leading-snug mb-1 line-clamp-2 group-hover:text-primary transition-colors">
          {toTitleCase(product.name)}
        </h3>
        {product.description && (
          <p className="text-slate-400 text-xs sm:text-sm mb-2 line-clamp-1">
            {product.description}
          </p>
        )}
        <p className="text-primary font-bold text-lg sm:text-xl">
          {formatPrice(product.price)}
        </p>
        {product.stock > 0 && (
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            En stock
          </p>
        )}
      </div>
    </Link>
  )
}

export default ProductCard
