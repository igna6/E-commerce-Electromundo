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
import { formatPrice } from '@/utils/formatPrice'
import { STORE_WHATSAPP_NUMBER } from '@/constants/config'
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

  const formatOrderNumber = (id: number) => String(id).padStart(6, '0')

  const getWhatsAppUrl = (orderText: string) =>
    `https://wa.me/${STORE_WHATSAPP_NUMBER}?text=${encodeURIComponent(orderText)}`

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
            ¡Gracias por tu pedido!
          </h1>
          <p className="text-gray-600 mb-6">
            Tu pedido #{formatOrderNumber(order.id)} ha sido registrado correctamente.
          </p>

          {/* WhatsApp Button — Primary CTA */}
          <a
            href={getWhatsAppUrl(order.orderText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 w-full sm:w-auto px-8 py-4 rounded-lg text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all"
            style={{ backgroundColor: '#25D366' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.168L2 22l4.832-1.438A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18a7.96 7.96 0 01-4.11-1.14l-.29-.174-3.01.79.8-2.93-.19-.3A7.96 7.96 0 014 12c0-4.41 3.59-8 8-8s8 3.59 8 8-3.59 8-8 8z" />
            </svg>
            Enviar Pedido por WhatsApp
          </a>

          {/* Copy Button — Secondary */}
          <div className="mt-4">
            <Button
              variant="outline"
              size="lg"
              onClick={copyToClipboard}
              className="w-full sm:w-auto"
            >
              {copied ? (
                <>
                  <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Copiado
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copiar Pedido
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8 mb-6">
          <h2 className="text-xl font-bold text-brand-dark mb-6">Resumen del Pedido</h2>

          {/* Contact Info */}
          <div className="mb-6">
            <h3 className="font-semibold text-brand-dark mb-2">Datos de Contacto</h3>
            <p className="text-gray-600 text-sm">
              {order.firstName} {order.lastName}
            </p>
            <p className="text-gray-600 text-sm">{order.email}</p>
            <p className="text-gray-600 text-sm">{order.phone}</p>
          </div>

          {/* Delivery Method */}
          <div className="mb-6">
            <h3 className="font-semibold text-brand-dark mb-2">Método de Entrega</h3>
            <p className="text-gray-600 text-sm">Retiro en sucursal</p>
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

        {/* Navigation Actions */}
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
