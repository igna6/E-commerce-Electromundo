type OrderStatusSelectProps = {
  currentStatus: string
  onStatusChange: (status: string) => void
  isLoading?: boolean
}

const VALID_TRANSITIONS: Record<string, { value: string; label: string }[]> = {
  pending: [
    { value: 'confirmed', label: 'Confirmar Pedido' },
    { value: 'cancelled', label: 'Cancelar Pedido' },
  ],
  confirmed: [
    { value: 'shipped', label: 'Marcar como Enviado' },
    { value: 'cancelled', label: 'Cancelar Pedido' },
  ],
  shipped: [{ value: 'delivered', label: 'Marcar como Entregado' }],
  delivered: [],
  cancelled: [],
}

export default function OrderStatusSelect({
  currentStatus,
  onStatusChange,
  isLoading = false,
}: OrderStatusSelectProps) {
  const transitions = VALID_TRANSITIONS[currentStatus] || []

  if (transitions.length === 0) {
    return (
      <p className="text-sm text-gray-500">
        No hay transiciones disponibles para este estado
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {transitions.map((transition) => (
        <button
          key={transition.value}
          onClick={() => onStatusChange(transition.value)}
          disabled={isLoading}
          className={`block w-full rounded-md px-4 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
            transition.value === 'cancelled'
              ? 'border border-red-200 text-red-600 hover:bg-red-50'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Actualizando...' : transition.label}
        </button>
      ))}
    </div>
  )
}
