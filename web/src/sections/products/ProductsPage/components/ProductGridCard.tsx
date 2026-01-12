import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

type ProductGridCardProps = {
  product: Product
  viewMode: 'grid' | 'list'
}

function ProductGridCard({ product, viewMode }: ProductGridCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price / 100)

  const handleAddToCart = () => {
    setIsAdding(true)
    // Visual feedback only - no actual logic
    setTimeout(() => setIsAdding(false), 600)
  }

  if (viewMode === 'list') {
    return (
      <Card className="flex flex-col sm:flex-row overflow-hidden hover:shadow-lg transition-shadow duration-300 border-gray-200">
        <Link
          to="/products/$productId"
          params={{ productId: String(product.id) }}
          className="sm:w-48 flex-shrink-0"
        >
          <div className="aspect-square sm:aspect-auto sm:h-full bg-gray-100 relative overflow-hidden">
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </Link>
        <CardContent className="flex-1 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  to="/products/$productId"
                  params={{ productId: String(product.id) }}
                >
                  <h3 className="font-semibold text-brand-dark text-lg hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <Badge variant="secondary" className="mt-1">
                  Electrónica
                </Badge>
              </div>
              <p className="text-brand-orange font-bold text-xl whitespace-nowrap">
                {formattedPrice}
              </p>
            </div>
            {product.description && (
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {product.description}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center border border-gray-200 rounded-lg">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
              >
                -
              </button>
              <span className="px-4 py-1.5 border-x border-gray-200 font-medium min-w-[3rem] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
              >
                +
              </button>
            </div>
            <Button
              onClick={handleAddToCart}
              className={`flex-1 transition-all ${
                isAdding
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-brand-orange hover:bg-orange-600'
              }`}
            >
              {isAdding ? (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              )}
              {isAdding ? 'Agregado!' : 'Agregar al Carrito'}
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card
      className="overflow-hidden group hover:shadow-xl transition-all duration-300 border-gray-200 relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Quick Action Buttons */}
      <div
        className={`absolute top-3 right-3 flex flex-col gap-2 z-10 transition-all duration-300 ${
          isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
        }`}
      >
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
        <button className="p-2 bg-white rounded-full shadow-lg hover:bg-brand-blue hover:text-white transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
        </button>
      </div>

      {/* Sale Badge */}
      <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600 z-10">
        -15%
      </Badge>

      <Link to="/products/$productId" params={{ productId: String(product.id) }}>
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      </Link>

      <CardContent className="p-4">
        <Link to="/products/$productId" params={{ productId: String(product.id) }}>
          <h3 className="font-semibold text-brand-dark text-lg mb-1 truncate hover:text-brand-blue transition-colors">
            {product.name}
          </h3>
        </Link>

        {/* Star Rating */}
        <div className="flex items-center gap-1 mb-2">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`w-4 h-4 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          ))}
          <span className="text-xs text-gray-500 ml-1">(128)</span>
        </div>

        <div className="flex items-baseline gap-2 mb-3">
          <p className="text-brand-orange font-bold text-xl">{formattedPrice}</p>
          <p className="text-gray-400 text-sm line-through">
            {new Intl.NumberFormat('es-AR', {
              style: 'currency',
              currency: 'ARS',
            }).format((product.price * 1.15) / 100)}
          </p>
        </div>

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
            >
              -
            </button>
            <span className="px-3 py-1 border-x border-gray-200 font-medium text-sm">
              {quantity}
            </span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="px-2.5 py-1 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              +
            </button>
          </div>
          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`flex-1 transition-all ${
              isAdding
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-brand-orange hover:bg-orange-600'
            }`}
          >
            {isAdding ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default ProductGridCard
