import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { useProducts } from '@/hooks/useProducts'

type CartSidebarProps = {
  children: React.ReactNode
}

function CartSidebar({ children }: CartSidebarProps) {
  const { data } = useProducts({ page: 1, limit: 10 })

  // Demo cart items
  const demoCartItems = data?.data.slice(0, 3).map((product, index) => ({
    product,
    quantity: index + 1,
  })) || []

  const subtotal = demoCartItems.reduce(
    (sum, item) => sum + (item.product.price / 100) * item.quantity,
    0
  )
  const itemCount = demoCartItems.reduce((sum, item) => sum + item.quantity, 0)

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="border-b border-gray-200 pb-4">
          <SheetTitle className="flex items-center gap-3">
            <svg className="w-6 h-6 text-brand-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            Mi Carrito
            <Badge variant="secondary">{itemCount} items</Badge>
          </SheetTitle>
        </SheetHeader>

        {demoCartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-brand-dark mb-2">Tu carrito está vacío</h3>
            <p className="text-gray-500 text-sm mb-6">
              ¡Agrega productos a tu carrito para comenzar!
            </p>
            <Button asChild className="bg-brand-orange hover:bg-orange-600">
              <Link to="/products">Explorar Productos</Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {demoCartItems.map((item) => (
                <div key={item.product.id} className="flex gap-4 group">
                  <Link
                    to="/products/$productId"
                    params={{ productId: String(item.product.id) }}
                    className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
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
                  <div className="flex-1 min-w-0">
                    <Link
                      to="/products/$productId"
                      params={{ productId: String(item.product.id) }}
                      className="font-medium text-brand-dark hover:text-brand-blue transition-colors line-clamp-2"
                    >
                      {item.product.name}
                    </Link>
                    <p className="text-brand-orange font-semibold mt-1">
                      {formatPrice(item.product.price / 100)}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border border-gray-200 rounded">
                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors">
                          -
                        </button>
                        <span className="px-3 py-1 border-x border-gray-200 text-sm font-medium">
                          {item.quantity}
                        </span>
                        <button className="px-2 py-1 text-gray-600 hover:bg-gray-100 transition-colors">
                          +
                        </button>
                      </div>
                      <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Promo Banner */}
            <div className="bg-brand-light p-3 rounded-lg text-sm text-brand-blue flex items-center gap-2">
              <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                ¡Agrega {formatPrice(50000 - subtotal)} más para envío gratis!
              </span>
            </div>

            <Separator className="my-4" />

            {/* Footer */}
            <SheetFooter className="flex-col gap-4 sm:flex-col">
              <div className="flex justify-between items-center w-full">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-xl font-bold text-brand-dark">{formatPrice(subtotal)}</span>
              </div>
              <p className="text-xs text-gray-500 text-center">
                Impuestos y envío calculados en el checkout
              </p>
              <div className="flex gap-3 w-full">
                <Button asChild variant="outline" className="flex-1">
                  <Link to="/cart">Ver Carrito</Link>
                </Button>
                <Button asChild className="flex-1 bg-brand-orange hover:bg-orange-600">
                  <Link to="/checkout">Checkout</Link>
                </Button>
              </div>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  )
}

export default CartSidebar
