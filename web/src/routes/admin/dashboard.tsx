import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import StatsCard from '@/sections/admin/StatsCard'
import RecentOrdersTable from '@/sections/admin/RecentOrdersTable'
import { apiRequest } from '@/services/api'

type StatsResponse = {
  data: {
    orders: {
      total: number
      byStatus: {
        pending: number
        confirmed: number
        shipped: number
        delivered: number
        cancelled: number
      }
    }
    revenue: {
      total: number
    }
    products: {
      total: number
      byCategory: Array<{
        categoryId: number
        categoryName: string
        productCount: number
      }>
    }
    categories: {
      total: number
    }
    recentOrders: Array<{
      id: number
      firstName: string
      lastName: string
      email: string
      total: number
      status: string
      createdAt: string
    }>
  }
}

function DashboardComponent() {
  const { getAccessToken } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () =>
      apiRequest<StatsResponse>('/api/admin/stats', {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      }),
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando estadísticas...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar estadísticas: {error.message}
      </div>
    )
  }

  const stats = data?.data

  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(cents / 100)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Pedidos Totales"
          value={stats?.orders.total ?? 0}
          icon="📦"
        />
        <StatsCard
          title="Ingresos Totales"
          value={formatCurrency(stats?.revenue.total ?? 0)}
          icon="💰"
        />
        <StatsCard
          title="Productos"
          value={stats?.products.total ?? 0}
          icon="🏷️"
        />
        <StatsCard
          title="Categorías"
          value={stats?.categories.total ?? 0}
          icon="📁"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Pedidos por Estado</h2>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-yellow-600">Pendientes</span>
              <span className="font-medium">{stats?.orders.byStatus.pending ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-blue-600">Confirmados</span>
              <span className="font-medium">{stats?.orders.byStatus.confirmed ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-purple-600">Enviados</span>
              <span className="font-medium">{stats?.orders.byStatus.shipped ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-green-600">Entregados</span>
              <span className="font-medium">{stats?.orders.byStatus.delivered ?? 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-red-600">Cancelados</span>
              <span className="font-medium">{stats?.orders.byStatus.cancelled ?? 0}</span>
            </div>
          </div>
        </div>

        <div className="rounded-lg border bg-white p-4">
          <h2 className="mb-4 text-lg font-semibold">Productos por Categoría</h2>
          <div className="space-y-2">
            {stats?.products.byCategory.map((cat) => (
              <div key={cat.categoryId} className="flex justify-between">
                <span>{cat.categoryName}</span>
                <span className="font-medium">{cat.productCount}</span>
              </div>
            ))}
            {(!stats?.products.byCategory || stats.products.byCategory.length === 0) && (
              <p className="text-gray-500">No hay categorías</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <h2 className="mb-4 text-lg font-semibold">Pedidos Recientes</h2>
        <RecentOrdersTable orders={stats?.recentOrders ?? []} />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/dashboard')({
  component: DashboardComponent,
})
