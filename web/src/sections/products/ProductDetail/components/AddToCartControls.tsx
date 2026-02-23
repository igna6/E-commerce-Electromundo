import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import type { Product } from '@/types/product'

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
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700">Cantidad:</span>
        <div className="flex items-center border border-gray-200 rounded-lg">
          <button
            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>
          <span className="px-6 py-2 border-x border-gray-200 font-medium min-w-[4rem] text-center">
            {quantity}
          </span>
          <button
            onClick={() => onQuantityChange(Math.min(product.stock, quantity + 1))}
            disabled={product.stock === 0 || quantity >= product.stock}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        {product.stock > 5 ? (
          <span className="text-sm text-gray-500">Stock disponible: {product.stock} unidades</span>
        ) : product.stock > 0 ? (
          <span className="text-sm text-amber-600 font-medium">Últimas {product.stock} unidades!</span>
        ) : (
          <span className="text-sm text-red-600 font-medium">Producto agotado</span>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          onClick={onAddToCart}
          disabled={product.stock === 0}
          size="lg"
          className={`flex-1 h-14 text-lg transition-all ${
            product.stock === 0
              ? 'bg-gray-400 cursor-not-allowed'
              : isAdding
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-brand-orange hover:bg-orange-600'
          }`}
        >
          {product.stock === 0 ? (
            'Producto Agotado'
          ) : isAdding ? (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Agregado al Carrito!
            </>
          ) : (
            <>
              <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              Agregar al Carrito
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="h-14 px-6 border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </Button>
      </div>

      <Button
        asChild
        variant="outline"
        size="lg"
        className="w-full h-14 text-lg border-brand-dark text-brand-dark hover:bg-brand-dark hover:text-white"
      >
        <Link to="/checkout">Comprar Ahora</Link>
      </Button>
    </div>
  )
}
