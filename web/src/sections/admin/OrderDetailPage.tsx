import { Link, useParams } from '@tanstack/react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import OrderStatusBadge from './OrderStatusBadge'
import OrderStatusSelect from './OrderStatusSelect'
import type { Order } from '@/types/order'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { authApiRequest } from '@/services/api'
import { formatPrice } from '@/utils/formatPrice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type OrderResponse = {
  data: Order
}

export default function OrderDetailPage() {
  const { orderId } = useParams({ from: '/admin/orders/$orderId' })
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', orderId],
    queryFn: () =>
      authApiRequest<OrderResponse>(`/api/admin/orders/${orderId}`),
  })

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus: string) =>
      authApiRequest(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
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
    return <AdminLoadingState message="Cargando pedido..." />
  }

  if (error) {
    return <AdminErrorState error={error} />
  }

  const order = data?.data

  if (!order) {
    return (
      <Alert className="border-yellow-200 bg-yellow-50">
        <AlertDescription className="text-yellow-700">
          Pedido no encontrado
        </AlertDescription>
      </Alert>
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
        <Card>
          <CardHeader>
            <CardTitle>Información del Cliente</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Nombre</dt>
                <dd className="font-medium">
                  {order.firstName} {order.lastName}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Email</dt>
                <dd className="font-medium">{order.email}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Teléfono</dt>
                <dd className="font-medium">{order.phone}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Dirección de Envío</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Dirección</dt>
                <dd className="font-medium">
                  {order.address}
                  {order.apartment && `, ${order.apartment}`}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Ciudad</dt>
                <dd className="font-medium">
                  {order.city}, {order.province} {order.zipCode}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Método de Envío</dt>
                <dd className="font-medium">
                  {shippingMethodLabels[order.shippingMethod] || order.shippingMethod}
                </dd>
              </div>
            </dl>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Productos</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Precio</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.productName}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.productPrice)}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">{formatPrice(item.lineTotal)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter className="bg-transparent">
              <TableRow className="border-0">
                <TableCell colSpan={3} className="text-right text-muted-foreground">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">{formatPrice(order.subtotal)}</TableCell>
              </TableRow>
              <TableRow className="border-0">
                <TableCell colSpan={3} className="text-right text-muted-foreground">
                  Envío
                </TableCell>
                <TableCell className="text-right">{formatPrice(order.shippingCost)}</TableCell>
              </TableRow>
              <TableRow className="border-0">
                <TableCell colSpan={3} className="text-right text-muted-foreground">
                  IVA (21%)
                </TableCell>
                <TableCell className="text-right">{formatPrice(order.tax)}</TableCell>
              </TableRow>
              <TableRow className="border-0 font-bold">
                <TableCell colSpan={3} className="text-right">
                  Total
                </TableCell>
                <TableCell className="text-right">{formatPrice(order.total)}</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Información del Pedido</CardTitle>
          </CardHeader>
          <CardContent>
            <dl className="space-y-2">
              <div>
                <dt className="text-sm text-muted-foreground">Fecha</dt>
                <dd className="font-medium">{formatDate(order.createdAt)}</dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Método de Pago</dt>
                <dd className="font-medium">
                  {paymentMethodLabels[order.paymentMethod] || order.paymentMethod}
                </dd>
              </div>
              <div>
                <dt className="text-sm text-muted-foreground">Última Actualización</dt>
                <dd className="font-medium">{formatDate(order.updatedAt)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actualizar Estado</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
