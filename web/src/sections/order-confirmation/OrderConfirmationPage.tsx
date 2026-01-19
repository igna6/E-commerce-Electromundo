import { useState, useEffect } from 'react'
import { Link, useSearch, useNavigate } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { getOrder } from '@/services/orders.service'
import type { Order } from '@/types/order'

function OrderConfirmationPage() {
  const navigate = useNavigate()
  const { orderId } = useSearch({ from: '/order-confirmation' })
  const [order, setOrder] = useState<Order | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!orderId) {
      navigate({ to: '/' })
      return
    }

    async function fetchOrder() {
      try {
        const response = await getOrder(orderId)
        setOrder(response.data)
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('No se pudo cargar el pedido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchOrder()
  }, [orderId, navigate])

  const copyToClipboard = async () => {
    if (!order?.orderText) return

    try {
      await navigator.clipboard.writeText(order.orderText)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Error copying to clipboard:', err)
    }
  }

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(cents / 100)

  const formatOrderNumber = (id: number) => String(id).padStart(6, '0')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue" />
      </div>
    )
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-brand-dark mb-4">Pedido no encontrado</h1>
          <p className="text-gray-600 mb-6">{error || 'No se pudo cargar la información del pedido'}</p>
          <Button asChild className="bg-brand-blue hover:bg-blue-700">
            <Link to="/">Volver al Inicio</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Confirmación de Pedido</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-xl border border-gray-200 p-8 mb-6 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-brand-dark mb-2">
            ¡Gracias por tu compra!
          </h1>
          <p className="text-gray-600 mb-4">
            Tu pedido #{formatOrderNumber(order.id)} ha sido recibido correctamente.
          </p>
          <p className="text-sm text-gray-500">
            Te enviamos un correo a <strong>{order.email}</strong> con los detalles de tu pedido.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-brand-dark mb-6">Resumen del Pedido</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Customer Info */}
            <div>
              <h3 className="font-semibold text-brand-dark mb-2">Datos de Contacto</h3>
              <p className="text-gray-600 text-sm">
                {order.firstName} {order.lastName}
              </p>
              <p className="text-gray-600 text-sm">{order.email}</p>
              <p className="text-gray-600 text-sm">{order.phone}</p>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-semibold text-brand-dark mb-2">Dirección de Envío</h3>
              <p className="text-gray-600 text-sm">{order.address}</p>
              {order.apartment && <p className="text-gray-600 text-sm">{order.apartment}</p>}
              <p className="text-gray-600 text-sm">
                {order.city}, {order.province}
              </p>
              <p className="text-gray-600 text-sm">CP: {order.zipCode}</p>
            </div>
          </div>

          <Separator className="my-6" />

          {/* Order Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center">
                <div>
                  <p className="font-medium text-brand-dark">{item.productName}</p>
                  <p className="text-sm text-gray-500">
                    {item.quantity} x {formatPrice(item.productPrice)}
                  </p>
                </div>
                <p className="font-semibold text-brand-dark">{formatPrice(item.lineTotal)}</p>
              </div>
            ))}
          </div>

          <Separator className="my-6" />

          {/* Totals */}
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Envío</span>
              <span>{order.shippingCost === 0 ? 'Gratis' : formatPrice(order.shippingCost)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>IVA (21%)</span>
              <span>{formatPrice(order.tax)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between text-lg font-bold">
              <span className="text-brand-dark">Total</span>
              <span className="text-brand-orange">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Order Text */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-brand-dark">Detalle del Pedido</h2>
            <Button
              variant="outline"
              size="sm"
              onClick={copyToClipboard}
              className="flex items-center gap-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar
                </>
              )}
            </Button>
          </div>
          <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm font-mono whitespace-pre-wrap">
            {order.orderText}
          </pre>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild className="bg-brand-blue hover:bg-blue-700">
            <Link to="/">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Volver al Inicio
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/products">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Seguir Comprando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmationPage
