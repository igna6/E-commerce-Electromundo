import { Link } from '@tanstack/react-router'
import OrderStatusBadge from './OrderStatusBadge'
import { formatPrice } from '@/utils/formatPrice'

type Order = {
  id: number
  email: string
  phone: string
  firstName: string
  lastName: string
  total: number
  status: string
  createdAt: string
}

type OrdersTableProps = {
  orders: Order[]
}

export default function OrdersTable({ orders }: OrdersTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (orders.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        No hay pedidos para mostrar
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
          <th className="px-4 py-3">Pedido</th>
          <th className="px-4 py-3">Cliente</th>
          <th className="px-4 py-3">Email</th>
          <th className="px-4 py-3">Total</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3">Fecha</th>
          <th className="px-4 py-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="px-4 py-3 font-medium">
              #{order.id.toString().padStart(6, '0')}
            </td>
            <td className="px-4 py-3">
              {order.firstName} {order.lastName}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">{order.email}</td>
            <td className="px-4 py-3">{formatPrice(order.total)}</td>
            <td className="px-4 py-3">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                to="/admin/orders/$orderId"
                params={{ orderId: String(order.id) }}
                className="text-blue-600 hover:underline"
              >
                Ver detalles
              </Link>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
