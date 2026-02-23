import { useState } from 'react'
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
import { useCart } from '@/contexts/CartContext'
import { formatPrice } from '@/utils/formatPrice'

type CartSidebarProps = {
  children: React.ReactNode
}

function CartSidebar({ children }: CartSidebarProps) {
  const [open, setOpen] = useState(false)
  const { items, subtotal, totalItems, updateQuantity, removeItem } = useCart()

  const itemCount = totalItems
  const freeShippingThreshold = 5000000 // 50,000 ARS in cents
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal)
  const freeShippingProgress = Math.min(
    100,
    (subtotal / freeShippingThreshold) * 100,
  )

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md flex flex-col bg-white border-slate-200 p-0">
        <SheetHeader className="p-6 border-b border-slate-100">
          <SheetTitle className="flex items-center gap-3 text-slate-900">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
              <ShoppingCart className="w-5 h-5 text-primary" />
            </div>
            <span className="font-display">Mi Carrito</span>
            <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20">
              {itemCount} items
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="w-24 h-24 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
              <ShoppingCart className="w-12 h-12 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">
              Tu carrito está vacío
            </h3>
            <p className="text-slate-500 text-sm mb-8 max-w-xs">
              ¡Agrega productos a tu carrito para comenzar tu compra!
            </p>
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
            >
              <Link to="/products" onClick={() => setOpen(false)} className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Explorar Productos
              </Link>
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {items.map((item) => (
                <div
                  key={item.product.id}
                  className="group bg-slate-50 rounded-xl p-4 transition-all duration-300 hover:bg-slate-100 border border-slate-100"
                >
                  <div className="flex gap-4">
                    <Link
                      to="/products/$productId"
                      params={{ productId: String(item.product.id) }}
                      onClick={() => setOpen(false)}
                      className="w-20 h-20 bg-white rounded-xl overflow-hidden flex-shrink-0 border border-slate-200"
                    >
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-8 h-8 text-slate-400" />
                        </div>
                      )}
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link
                        to="/products/$productId"
                        params={{ productId: String(item.product.id) }}
                        onClick={() => setOpen(false)}
                        className="font-medium text-slate-900 hover:text-primary transition-colors line-clamp-2 text-sm"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-primary font-bold mt-1">
                        {formatPrice(item.product.price)}
                      </p>

                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center rounded-lg border border-slate-200 bg-white overflow-hidden">
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="px-3 py-1.5 border-x border-slate-200 text-sm font-medium text-slate-900 min-w-[2.5rem] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                            className="px-2.5 py-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
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
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                <div className="flex items-center gap-3 mb-3">
                  <div
                    className={`p-2 rounded-lg ${remainingForFreeShipping === 0 ? 'bg-emerald-100 border border-emerald-200' : 'bg-primary/10 border border-primary/20'}`}
                  >
                    <Truck
                      className={`w-4 h-4 ${remainingForFreeShipping === 0 ? 'text-emerald-600' : 'text-primary'}`}
                    />
                  </div>
                  <p className="text-sm text-slate-600">
                    {remainingForFreeShipping === 0 ? (
                      <span className="text-emerald-600 font-medium">
                        ¡Envío gratis desbloqueado!
                      </span>
                    ) : (
                      <>
                        Agrega{' '}
                        <span className="text-primary font-semibold">
                          {formatPrice(remainingForFreeShipping)}
                        </span>{' '}
                        más para envío gratis
                      </>
                    )}
                  </p>
                </div>
                <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${remainingForFreeShipping === 0 ? 'bg-emerald-500' : 'bg-primary'}`}
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <SheetFooter className="p-6 border-t border-slate-100 flex-col gap-4 sm:flex-col">
              <div className="flex justify-between items-center w-full">
                <span className="text-slate-500">Subtotal</span>
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="text-xs text-slate-400 text-center">
                Impuestos y envío calculados en el checkout
              </p>
              <div className="flex gap-3 w-full">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl"
                >
                  <Link to="/cart" onClick={() => setOpen(false)}>Ver Carrito</Link>
                </Button>
                <Button
                  asChild
                  className="flex-1 bg-primary hover:bg-primary/90 text-white font-semibold rounded-xl"
                >
                  <Link
                    to="/checkout"
                    onClick={() => setOpen(false)}
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
