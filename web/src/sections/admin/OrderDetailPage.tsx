import { Link, useParams } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { apiRequest } from '@/services/api'
import { formatPrice } from '@/utils/formatPrice'
import OrderStatusBadge from './OrderStatusBadge'
import OrderStatusSelect from './OrderStatusSelect'

type OrderItem = {
  id: number
  productId: number
  productName: string
  productPrice: number
  quantity: number
  lineTotal: number
}

type Order = {
  id: number
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment: string | null
  city: string
  province: string
  zipCode: string
  shippingMethod: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  orderText: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

type OrderResponse = {
  data: Order
}

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/admin/orders/$orderId' })
  const { getAccessToken } = useAuth()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', orderId],
    queryFn: () =>
      apiRequest<OrderResponse>(`/api/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }),
  })

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      apiRequest(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: JSON.stringify({ status: newStatus }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] })
    },
  })

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const shippingMethodLabels: Record<string, string> = {
    pickup: 'Retiro en Sucursal',
    standard: 'Envío Estándar',
    express: 'Envío Express',
  }

  const paymentMethodLabels: Record<string, string> = {
    card: 'Tarjeta',
    mercadopago: 'MercadoPago',
    transfer: 'Transferencia',
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando pedido...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar pedido: {error.message}
      </div>
    )
  }

  const order = data?.data

  if (!order) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        Pedido no encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link
            to="/admin/orders"
            className="text-sm text-blue-600 hover:underline"
          >
            &larr; Volver a pedidos
          </Link>
          <h1 className="mt-2 text-2xl font-bold">
            Pedido #{order.id.toString().padStart(6, '0')}
          </h1>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Información del Cliente</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Nombre</dt>
              <dd className="font-medium">
                {order.firstName} {order.lastName}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Email</dt>
              <dd className="font-medium">{order.email}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Teléfono</dt>
              <dd className="font-medium">{order.phone}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Dirección de Envío</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Dirección</dt>
              <dd className="font-medium">
                {order.address}
                {order.apartment && `, ${order.apartment}`}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Ciudad</dt>
              <dd className="font-medium">
                {order.city}, {order.province} {order.zipCode}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Método de Envío</dt>
              <dd className="font-medium">
                {shippingMethodLabels[order.shippingMethod] || order.shippingMethod}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Productos</h2>
        <table className="w-full">
          <thead>
            <tr className="border-b text-left text-sm text-gray-500">
              <th className="pb-2">Producto</th>
              <th className="pb-2 text-right">Precio</th>
              <th className="pb-2 text-right">Cantidad</th>
              <th className="pb-2 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item) => (
              <tr key={item.id} className="border-b">
                <td className="py-3">{item.productName}</td>
                <td className="py-3 text-right">{formatPrice(item.productPrice)}</td>
                <td className="py-3 text-right">{item.quantity}</td>
                <td className="py-3 text-right">{formatPrice(item.lineTotal)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan={3} className="pt-4 text-right text-gray-500">
                Subtotal
              </td>
              <td className="pt-4 text-right">{formatPrice(order.subtotal)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right text-gray-500">
                Envío
              </td>
              <td className="text-right">{formatPrice(order.shippingCost)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right text-gray-500">
                IVA (21%)
              </td>
              <td className="text-right">{formatPrice(order.tax)}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="pt-2 text-right">
                Total
              </td>
              <td className="pt-2 text-right">{formatPrice(order.total)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Información del Pedido</h2>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm text-gray-500">Fecha</dt>
              <dd className="font-medium">{formatDate(order.createdAt)}</dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Método de Pago</dt>
              <dd className="font-medium">
                {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-gray-500">Última Actualización</dt>
              <dd className="font-medium">{formatDate(order.updatedAt)}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Actualizar Estado</h2>
          <OrderStatusSelect
            currentStatus={order.status}
            onStatusChange={(status) => updateStatusMutation.mutate(status)}
            isLoading={updateStatusMutation.isPending}
          />
          {updateStatusMutation.isError && (
            <p className="mt-2 text-sm text-red-600">
              Error al actualizar estado
            </p>
          )}
          {updateStatusMutation.isSuccess && (
            <p className="mt-2 text-sm text-green-600">
              Estado actualizado correctamente
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
