import { Link } from '@tanstack/react-router'
import OrderStatusBadge from './OrderStatusBadge'
import { formatPrice } from '@/utils/formatPrice'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

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
  orders: Array<Order>
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
    return <p className="text-muted-foreground">No hay pedidos recientes</p>
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Pedido</TableHead>
          <TableHead>Cliente</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Fecha</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell>
              <Link
                to="/admin/orders/$orderId"
                params={{ orderId: String(order.id) }}
                className="text-blue-600 hover:underline"
              >
                #{order.id.toString().padStart(6, '0')}
              </Link>
            </TableCell>
            <TableCell>
              {order.firstName} {order.lastName}
            </TableCell>
            <TableCell>{formatPrice(order.total)}</TableCell>
            <TableCell>
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
