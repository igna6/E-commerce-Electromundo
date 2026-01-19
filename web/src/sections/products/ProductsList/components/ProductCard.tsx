import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ShoppingCart, Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useCart } from '@/contexts/CartContext'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const formattedPrice = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(product.price / 100)

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
      className="block"
    >
      <Card className="hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
        <div className="aspect-square bg-gray-100 relative overflow-hidden">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-16 h-16"
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
          {/* Quick Add Button */}
          <Button
            onClick={handleAddToCart}
            size="sm"
            className={`absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all ${
              isAdding ? 'bg-green-500 hover:bg-green-600' : 'bg-brand-orange hover:bg-orange-600'
            }`}
          >
            {isAdding ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </Button>
        </div>
        <CardContent className="p-4">
          <h3 className="font-semibold text-brand-dark text-lg mb-1 truncate">
            {product.name}
          </h3>
          {product.description && (
            <p className="text-gray-500 text-sm mb-3 line-clamp-2">
              {product.description}
            </p>
          )}
          <p className="text-brand-orange font-bold text-xl">{formattedPrice}</p>
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard
