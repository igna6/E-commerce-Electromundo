type OrderStatusBadgeProps = {
  status: string
}

const statusConfig: Record<string, { label: string; className: string }> = {
  pending: {
    label: 'Pendiente',
    className: 'bg-yellow-100 text-yellow-800',
  },
  confirmed: {
    label: 'Confirmado',
    className: 'bg-blue-100 text-blue-800',
  },
  shipped: {
    label: 'Enviado',
    className: 'bg-purple-100 text-purple-800',
  },
  delivered: {
    label: 'Entregado',
    className: 'bg-green-100 text-green-800',
  },
  cancelled: {
    label: 'Cancelado',
    className: 'bg-red-100 text-red-800',
  },
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const config = statusConfig[status] || {
    label: status,
    className: 'bg-gray-100 text-gray-800',
  }

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-medium ${config.className}`}
    >
      {config.label}
    </span>
  )
}
