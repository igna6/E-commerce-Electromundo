import { Badge } from '@/components/ui/badge'

type OrderStatusBadgeProps = {
  status: string
}

const statusConfig: Record<
  string,
  { label: string; className: string } | undefined
> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100',
  },
  confirmed: {
    label: 'Confirmado',
    className: 'bg-blue-100 text-blue-800 hover:bg-blue-100',
  },
  shipped: {
    label: 'Enviado',
    className: 'bg-purple-100 text-purple-800 hover:bg-purple-100',
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-green-100 text-green-800 hover:bg-green-100',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800 hover:bg-red-100',
  },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] ?? {
    label: status,
    className: 'bg-gray-100 text-gray-800 hover:bg-gray-100',
  }

  return (
    <Badge
      variant="outline"
      className={`border-transparent ${config.className}`}
    >
      {config.label}
    </Badge>
  )
}
