import { Link } from '@tanstack/react-router'
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Truck,
  Package,
  ArrowRight,
  Zap,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
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
  const demoCartItems =
    data?.data.slice(0, 3).map((product, index) => ({
      product,
      quantity: index + 1,
    })) || []

  const subtotal = demoCartItems.reduce(
    (sum, item) => sum + (item.product.price / 100) * item.quantity,
    0,
  )
  const itemCount = demoCartItems.reduce((sum, item) => sum + item.quantity, 0)
  const freeShippingThreshold = 50000
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  )

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-slate-900 border-slate-800 p-0">
        <SheetHeader className="p-6 border-b border-slate-800">
          <SheetTitle className="flex items-center gap-3 text-white">
            <div className="p-2 rounded-xl bg-cyan-500/20 border border-cyan-500/30">
              <ShoppingCart className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-display">Mi Carrito</span>
            <Badge className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/30">
              {itemCount} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {demoCartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-2xl bg-slate-800 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-600" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-slate-400 text-sm mb-8 max-w-xs">
              ¡Agrega productos a tu carrito para comenzar tu compra!
            </p>
            <Button
              asChild
              className="bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 hover:from-cyan-400 hover:to-emerald-400 font-semibold rounded-xl"
            >
              <Link to="/products" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Explorar Productos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {demoCartItems.map((item) => (
                <div
                  key={item.product.id}
                  className="group glass rounded-xl p-4 transition-all duration-300 hover:bg-white/10"
                >
                  <div className="flex gap-4">
                    <Link
                      to="/products/$productId"
                      params={{ productId: String(item.product.id) }}
                      className="w-20 h-20 bg-slate-800 rounded-xl overflow-hidden flex-shrink-0"
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-slate-600" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to="/products/$productId"
                        params={{ productId: String(item.product.id) }}
                        className="font-medium text-white hover:text-cyan-400 transition-colors line-clamp-2 text-sm"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gradient-warm font-bold mt-1">
                        {formatPrice(item.product.price / 100)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800/50 overflow-hidden">
                          <button className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1.5 border-x border-slate-700 text-sm font-medium text-white min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button className="px-2.5 py-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors">
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Free Shipping Progress */}
            <div className="px-6">
              <div className="glass rounded-xl p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${remainingForFreeShipping === 0 ? 'bg-emerald-500/20 border border-emerald-500/30' : 'bg-cyan-500/20 border border-cyan-500/30'}`}
                  >
                    <Truck
                      className={`w-4 h-4 ${remainingForFreeShipping === 0 ? 'text-emerald-400' : 'text-cyan-400'}`}
                    />
                  </div>
                  <p className="text-sm text-slate-300">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-400 font-medium">
                        ¡Envío gratis desbloqueado!
                      </span>
                    ) : (
                      <>
                        Agrega{' '}
                        <span className="text-cyan-400 font-semibold">
                          {formatPrice(remainingForFreeShipping)}
                        </span>{' '}
                        más para envío gratis
                      </>
                    )}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${remainingForFreeShipping === 0 ? 'bg-gradient-to-r from-emerald-500 to-emerald-400' : 'bg-gradient-to-r from-cyan-500 to-cyan-400'}`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="p-6 border-t border-slate-800 flex-col gap-4 sm:flex-col">
              <div className="flex justify-between items-center w-full">
                <span className="text-slate-400">Subtotal</span>
                <span className="text-2xl font-bold text-gradient">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-slate-500 text-center">
                Impuestos y envío calculados en el checkout
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white rounded-xl"
                >
                  <Link to="/cart">Ver Carrito</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-400 hover:to-amber-400 font-semibold rounded-xl shadow-glow-orange"
                >
                  <Link
                    to="/checkout"
                    className="flex items-center justify-center gap-2"
                  >
                    Checkout
                    <ArrowRight className="w-4 h-4" />
                  </Link>
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
