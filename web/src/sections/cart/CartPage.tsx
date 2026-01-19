import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useCart } from '@/contexts/CartContext'

function CartPage() {
  const { items, subtotal, totalItems, updateQuantity, removeItem, clearCart } = useCart()
  const [couponCode, setCouponCode] = useState('')

  // Convert subtotal from cents to display value
  const subtotalDisplay = subtotal / 100
  const shipping = subtotalDisplay > 50000 ? 0 : 5000
  const discount = 0
  const total = subtotalDisplay + shipping - discount

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)

  if (items.length === 0) {
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

        {/* Empty Cart */}
        <div className="max-w-7xl mx-auto px-4 py-16">
          <div className="text-center">
            <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-brand-dark mb-3">Tu carrito está vacío</h1>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              Parece que aún no has agregado ningún producto. ¡Explora nuestra tienda y encuentra lo que necesitas!
            </p>
            <Button asChild size="lg" className="bg-brand-orange hover:bg-orange-600">
              <Link to="/products">Explorar Productos</Link>
            </Button>
          </div>
        </div>
      </div>
    )
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

            {/* Cart Items */}
            {items.map((item) => (
              <div
                key={item.product.id}
                className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 hover:shadow-md transition-shadow"
              >
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
                          onClick={() => removeItem(item.product.id)}
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
                      {formatPrice(item.product.price / 100)}
                    </span>
                  </div>

                  {/* Quantity */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <div className="flex items-center border border-gray-200 rounded-lg">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
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
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
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
                      {formatPrice((item.product.price / 100) * item.quantity)}
                    </span>
                  </div>
                </div>
              </div>
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
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brand-dark mb-6">Resumen del Pedido</h2>

              {/* Coupon Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Descuento
                </label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Ingresa tu código"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1"
                  />
                  <Button variant="outline">Aplicar</Button>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotalDisplay)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span className="flex items-center gap-1">
                    Envío
                    {shipping === 0 && (
                      <Badge className="bg-green-100 text-green-700 text-xs">Gratis</Badge>
                    )}
                  </span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Descuento</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <Separator className="my-6" />

              {/* Total */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-lg font-semibold text-brand-dark">Total</span>
                <span className="text-2xl font-bold text-brand-orange">{formatPrice(total)}</span>
              </div>

              {/* Financing Info */}
              <div className="bg-brand-light rounded-lg p-4 mb-6">
                <p className="text-sm text-brand-blue">
                  <span className="font-semibold">12 cuotas sin interés</span> de{' '}
                  <span className="font-bold">{formatPrice(total / 12)}</span>
                </p>
              </div>

              {/* Checkout Button */}
              <Button
                asChild
                size="lg"
                className="w-full h-14 text-lg bg-brand-orange hover:bg-orange-600 mb-4"
              >
                <Link to="/checkout">
                  Continuar al Checkout
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </Button>

              {/* Trust Badges */}
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">Compra Segura</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">30 Días Devolución</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                    />
                  </svg>
                  <span className="text-xs text-gray-600">Pago Seguro</span>
                </div>
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-xs text-gray-600">Garantía</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CartPage
