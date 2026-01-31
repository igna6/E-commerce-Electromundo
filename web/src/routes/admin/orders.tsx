import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { apiRequest } from '@/services/api'
import OrdersTable from '@/sections/admin/OrdersTable'

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

type OrdersResponse = {
  data: Order[]
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
  const { getAccessToken } = useAuth()
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders', page, statusFilter],
    queryFn: () => {
      const params = new URLSearchParams({ page: String(page), limit: '20' })
      if (statusFilter) params.append('status', statusFilter)
      return apiRequest<OrdersResponse>(`/api/admin/orders?${params}`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando pedidos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar pedidos: {error.message}
      </div>
    )
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
