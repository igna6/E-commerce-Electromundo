import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Check, Minus, Plus, ShoppingCart, Zap } from 'lucide-react'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import ProductCard from '@/components/ProductCard'
import { useCart } from '@/contexts/CartContext'
import { applyTax, formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

type ProductGridCardProps = {
  product: Product
  viewMode: 'grid' | 'list'
  index?: number
  categoryName?: string
}

function ProductGridCard({
  product,
  viewMode,
  index = 0,
  categoryName,
}: ProductGridCardProps) {
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem(product, quantity)
    setIsAdding(true)
    setTimeout(() => {
      setIsAdding(false)
      setQuantity(1)
    }, 800)
  }

  // Staggered animation delay based on index
  const animationDelay = `${(index % 6) * 100}ms`

  if (viewMode === 'grid') {
    return <ProductCard product={product} categoryName={categoryName} />
  }

  return (
    <div
      className="group bg-white rounded-2xl overflow-hidden flex flex-col sm:flex-row shadow-sm border border-slate-100 opacity-0 animate-slide-up"
      style={{ animationDelay }}
    >
      <Link
        to="/products/$productId"
        params={{ productId: String(product.id) }}
        className="sm:w-56 flex-shrink-0 relative overflow-hidden"
      >
        <div className="aspect-square sm:aspect-auto sm:h-full bg-gradient-to-br from-slate-100 to-slate-50 relative">
          {product.image ? (
            <img
              src={product.image}
              alt={toTitleCase(product.name)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Zap className="w-10 h-10 text-slate-400" />
              </div>
            </div>
          )}
        </div>
      </Link>

      <div className="flex-1 p-5 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              {categoryName && (
                <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-0.5">
                  {categoryName}
                </p>
              )}
              <Link
                to="/products/$productId"
                params={{ productId: String(product.id) }}
              >
                <h3 className="font-semibold text-slate-900 text-lg group-hover:text-primary transition-colors">
                  {toTitleCase(product.name)}
                </h3>
              </Link>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="text-primary font-bold text-xl">
                {formatPrice(applyTax(product.price))}
              </p>
            </div>
          </div>
          {product.description && (
            <p className="text-slate-500 text-sm mt-3 line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 mt-4">
          {/* Quantity selector */}
          <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="px-4 py-2 border-x border-slate-200 font-medium text-slate-900 min-w-[3rem] text-center">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-3 py-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add to cart button */}
          <Button
            onClick={handleAddToCart}
            className={`flex-1 h-11 rounded-xl font-semibold transition-all duration-300 ${
              isAdding
                ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {isAdding ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Agregado!
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5 mr-2" />
                Agregar al Carrito
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductGridCard
