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
  email: string
  phone: string
  firstName: string
  lastName: string
  total: number
  status: string
  createdAt: string
}

type OrdersTableProps = {
  orders: Array<Order>
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
      <div className="px-4 py-8 text-center text-muted-foreground">
        No hay pedidos para mostrar
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="px-4">Pedido</TableHead>
          <TableHead className="px-4">Cliente</TableHead>
          <TableHead className="px-4">Email</TableHead>
          <TableHead className="px-4">Total</TableHead>
          <TableHead className="px-4">Estado</TableHead>
          <TableHead className="px-4">Fecha</TableHead>
          <TableHead className="px-4 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="px-4 font-medium">
              #{order.id.toString().padStart(6, '0')}
            </TableCell>
            <TableCell className="px-4">
              {order.firstName} {order.lastName}
            </TableCell>
            <TableCell className="px-4 text-sm text-muted-foreground">{order.email}</TableCell>
            <TableCell className="px-4">{formatPrice(order.total)}</TableCell>
            <TableCell className="px-4">
              <OrderStatusBadge status={order.status} />
            </TableCell>
            <TableCell className="px-4 text-sm text-muted-foreground">
              {formatDate(order.createdAt)}
            </TableCell>
            <TableCell className="px-4 text-right">
              <Link
                to="/admin/orders/$orderId"
                params={{ orderId: String(order.id) }}
                className="text-blue-600 hover:underline"
              >
                Ver detalles
              </Link>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
