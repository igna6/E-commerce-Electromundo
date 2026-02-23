import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/utils/formatPrice'
import type { CartItem } from '@/types/cart'

type CartItemRowProps = {
  item: CartItem
  onUpdateQuantity: (productId: number, quantity: number) => void
  onRemove: (productId: number) => void
}

export default function CartItemRow({ item, onUpdateQuantity, onRemove }: CartItemRowProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Product Info */}
        <div className="md:col-span-6 flex gap-4">
          <Link
            to="/products/$productId"
            params={{ productId: String(item.product.id) }}
            className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
          >
            {item.product.image ? (
              <img
                src={item.product.image}
                alt={item.product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            )}
          </Link>
          <div className="flex flex-col justify-center">
            <Link
              to="/products/$productId"
              params={{ productId: String(item.product.id) }}
              className="font-semibold text-brand-dark hover:text-brand-blue transition-colors"
            >
              {item.product.name}
            </Link>
            <p className="text-sm text-gray-500 mt-1">SKU: EM-{item.product.id.toString().padStart(6, '0')}</p>
            <div className="flex items-center gap-2 mt-2">
              <button className="text-sm text-gray-500 hover:text-brand-blue transition-colors flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
                Guardar
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => onRemove(item.product.id)}
                className="text-sm text-red-500 hover:text-red-600 transition-colors flex items-center gap-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Eliminar
              </button>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="md:col-span-2 text-center">
          <span className="md:hidden text-sm text-gray-500">Precio: </span>
          <span className="font-medium text-brand-dark">
            {formatPrice(item.product.price)}
          </span>
        </div>

        {/* Quantity */}
        <div className="md:col-span-2 flex items-center justify-center">
          <div className="flex items-center border border-gray-200 rounded-lg">
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors rounded-l-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span className="px-4 py-1.5 border-x border-gray-200 font-medium min-w-[3rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
              className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 transition-colors rounded-r-lg"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>
        </div>

        {/* Total */}
        <div className="md:col-span-2 text-right">
          <span className="md:hidden text-sm text-gray-500">Total: </span>
          <span className="font-bold text-brand-orange text-lg">
            {formatPrice(item.product.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  )
}
