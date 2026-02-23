import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useCart } from '@/contexts/CartContext'
import EmptyCart from './components/EmptyCart'
import CartItemRow from './components/CartItemRow'
import CartSummary from './components/CartSummary'

function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clearCart } = useCart()

  // All values in cents
  const shipping = subtotal > 5000000 ? 0 : 500000
  const discount = 0
  const total = subtotal + shipping - discount

  if (items.length === 0) {
    return <EmptyCart />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Carrito</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-brand-dark">Mi Carrito</h1>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {totalItems} productos
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {/* Header */}
            <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 rounded-lg text-sm font-medium text-gray-600">
              <div className="col-span-6">Producto</div>
              <div className="col-span-2 text-center">Precio</div>
              <div className="col-span-2 text-center">Cantidad</div>
              <div className="col-span-2 text-right">Total</div>
            </div>

            {items.map((item) => (
              <CartItemRow
                key={item.product.id}
                item={item}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
              />
            ))}

            {/* Continue Shopping */}
            <div className="flex justify-between items-center pt-4">
              <Button asChild variant="outline" className="gap-2">
                <Link to="/products">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Seguir Comprando
                </Link>
              </Button>
              <Button
                onClick={clearCart}
                variant="ghost"
                className="text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
                Vaciar Carrito
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <CartSummary
            subtotal={subtotal}
            shipping={shipping}
            discount={discount}
            total={total}
          />
        </div>
      </div>
    </div>
  )
}

export default CartPage
