import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { authApiRequest } from '@/services/api'
import OrdersTable from '@/sections/admin/OrdersTable'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import type { Order } from '@/types/order'

type OrdersResponse = {
  data: Array<Order>
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

const STATUSES = [
  { value: '', label: 'Todos' },
  { value: 'pending', label: 'Pendiente' },
  { value: 'confirmed', label: 'Confirmado' },
  { value: 'shipped', label: 'Enviado' },
  { value: 'delivered', label: 'Entregado' },
  { value: 'cancelled', label: 'Cancelado' },
]

function OrdersComponent() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', page, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)
      return authApiRequest<OrdersResponse>(`/api/admin/orders?${params}`)
    },
  })

  if (isLoading) {
    return <AdminLoadingState message="Cargando pedidos..." />
  }

  if (error) {
    return <AdminErrorState error={error} />
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pedidos</h1>
      </div>

      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Filtrar por estado:</label>
        <select
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value)
            setPage(1)
          }}
          className="rounded-md border px-3 py-2"
        >
          {STATUSES.map((status) => (
            <option key={status.value} value={status.value}>
              {status.label}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-lg border bg-white">
        <OrdersTable orders={data?.data ?? []} />
      </div>

      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {data.data.length} de {data.pagination.total} pedidos
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.pagination.hasPrev}
              className="rounded-md border px-4 py-2 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-4 py-2">
              Página {data.pagination.page} de {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.pagination.hasNext}
              className="rounded-md border px-4 py-2 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export const Route = createFileRoute('/admin/orders')({
  component: OrdersComponent,
})
