import { Link } from '@tanstack/react-router'
import OrderStatusBadge from './OrderStatusBadge'
import { formatPrice } from '@/utils/formatPrice'

type Order = {
  id: number
  firstName: string
  lastName: string
  email: string
  total: number
  status: string
  createdAt: string
}

type RecentOrdersTableProps = {
  orders: Order[]
}

export default function RecentOrdersTable({ orders }: RecentOrdersTableProps) {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-AR', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (orders.length === 0) {
    return <p className="text-gray-500">No hay pedidos recientes</p>
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b text-left text-sm text-gray-500">
          <th className="pb-2">Pedido</th>
          <th className="pb-2">Cliente</th>
          <th className="pb-2">Total</th>
          <th className="pb-2">Estado</th>
          <th className="pb-2">Fecha</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b">
            <td className="py-3">
              <Link
                to="/admin/orders/$orderId"
                params={{ orderId: String(order.id) }}
                className="text-blue-600 hover:underline"
              >
                #{order.id.toString().padStart(6, '0')}
              </Link>
            </td>
            <td className="py-3">
              {order.firstName} {order.lastName}
            </td>
            <td className="py-3">{formatPrice(order.total)}</td>
            <td className="py-3">
              <OrderStatusBadge status={order.status} />
            </td>
            <td className="py-3 text-sm text-gray-500">
              {formatDate(order.createdAt)}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
