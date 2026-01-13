import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Heart, Eye, ShoppingCart, Check, Star, Minus, Plus, Zap } from 'lucide-react'
import type { Product } from '@/types/product'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ProductGridCardProps = {
  product: Product
  viewMode: 'grid' | 'list'
  index?: number
}

function ProductGridCard({ product, viewMode, index = 0 }: ProductGridCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price / 100)

  const originalPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format((product.price * 1.15) / 100)

  const handleAddToCart = () => {
    setIsAdding(true)
    setTimeout(() => setIsAdding(false), 800)
  }

  // Staggered animation delay based on index
  const animationDelay = `${(index % 6) * 100}ms`

  if (viewMode === 'list') {
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
                alt={product.name}
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
                <Link
                  to="/products/$productId"
                  params={{ productId: String(product.id) }}
                >
                  <h3 className="font-semibold text-slate-900 text-lg group-hover:text-primary transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <Badge className="mt-2 bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200">
                  Electrónica
                </Badge>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-primary font-bold text-xl">{formattedPrice}</p>
                <p className="text-slate-400 text-sm line-through">{originalPrice}</p>
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

            {/* Wishlist button */}
            <button
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`p-3 rounded-xl border transition-all duration-300 ${
                isWishlisted
                  ? 'bg-pink-50 border-pink-200 text-pink-500'
                  : 'border-slate-200 text-slate-400 hover:border-pink-200 hover:text-pink-500 hover:bg-pink-50'
              }`}
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="group relative rounded-2xl overflow-hidden opacity-0 animate-scale-in"
      style={{ animationDelay }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Card content */}
      <div className="relative bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md hover:border-slate-200 transition-all duration-300">
        {/* Quick action buttons */}
        <div
          className={`absolute top-4 right-4 flex flex-col gap-2 z-20 transition-all duration-300 ${
            isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
          }`}
        >
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className={`p-2.5 rounded-xl backdrop-blur-sm transition-all duration-200 ${
              isWishlisted
                ? 'bg-pink-50 text-pink-500 border border-pink-200'
                : 'bg-white/90 text-slate-400 border border-slate-200 hover:text-pink-500 hover:border-pink-200'
            }`}
          >
            <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
          </button>
          <Link
            to="/products/$productId"
            params={{ productId: String(product.id) }}
            className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm border border-slate-200 text-slate-400 hover:text-primary hover:border-primary/30 transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
          </Link>
        </div>

        {/* Sale badge */}
        <Badge className="absolute top-4 left-4 z-20 bg-gradient-to-r from-orange-500 to-amber-500 text-white border-0">
          -15%
        </Badge>

        {/* Product image */}
        <Link to="/products/$productId" params={{ productId: String(product.id) }}>
          <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-50 relative overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-700 ease-out ${
                  isHovered ? 'scale-110' : 'scale-100'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                  <Zap className="w-12 h-12 text-slate-400" />
                </div>
              </div>
            )}
          </div>
        </Link>

        {/* Card content */}
        <div className="p-5">
          <Link to="/products/$productId" params={{ productId: String(product.id) }}>
            <h3 className="font-semibold text-slate-900 text-lg mb-2 truncate group-hover:text-primary transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Star rating */}
          <div className="flex items-center gap-1.5 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < 4 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'
                }`}
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">(128)</span>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-2 mb-4">
            <p className="text-primary font-bold text-xl">{formattedPrice}</p>
            <p className="text-slate-400 text-sm line-through">{originalPrice}</p>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center gap-2">
            <div className="flex items-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="px-3 py-1.5 border-x border-slate-200 font-medium text-slate-900 text-sm min-w-[2.5rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <Button
              onClick={handleAddToCart}
              size="sm"
              className={`flex-1 h-9 rounded-xl font-semibold transition-all duration-300 ${
                isAdding
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-white'
                  : 'bg-primary hover:bg-primary/90 text-white'
              }`}
            >
              {isAdding ? (
                <Check className="w-4 h-4" />
              ) : (
                <ShoppingCart className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductGridCard
