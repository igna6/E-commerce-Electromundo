import { useQuery } from '@tanstack/react-query'
import StatsCard from './StatsCard'
import RecentOrdersTable from './RecentOrdersTable'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import { authApiRequest } from '@/services/api'
import { formatPrice } from '@/utils/formatPrice'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'

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
    inventory: {
      outOfStock: number
      lowStock: number
      lowStockProducts: Array<{
        id: number
        name: string
        stock: number
      }>
    }
  }
}

export default function DashboardPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'stats'],
    queryFn: () => authApiRequest<StatsResponse>('/api/admin/stats'),
  })

  if (isLoading) {
    return <AdminLoadingState message="Cargando estadísticas..." />
  }

  if (error) {
    return <AdminErrorState error={error} />
  }

  const stats = data?.data

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
          value={formatPrice(stats?.revenue.total ?? 0)}
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

      {/* Inventory Alerts */}
      {((stats?.inventory.outOfStock ?? 0) > 0 ||
        (stats?.inventory.lowStock ?? 0) > 0) && (
        <Alert className="border-amber-200 bg-amber-50">
          <AlertTitle className="text-lg font-semibold text-amber-800">
            Alertas de Inventario
          </AlertTitle>
          <AlertDescription>
            <div className="mt-2 flex gap-4">
              {(stats?.inventory.outOfStock ?? 0) > 0 && (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-transparent">
                  {stats?.inventory.outOfStock} agotado
                  {(stats?.inventory.outOfStock ?? 0) !== 1 ? 's' : ''}
                </Badge>
              )}
              {(stats?.inventory.lowStock ?? 0) > 0 && (
                <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent">
                  {stats?.inventory.lowStock} con bajo stock
                </Badge>
              )}
            </div>
            {stats?.inventory.lowStockProducts &&
              stats.inventory.lowStockProducts.length > 0 && (
                <div className="mt-3 space-y-1">
                  {stats.inventory.lowStockProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="text-amber-800">
                        {product.name}
                      </span>
                      <span
                        className={
                          product.stock === 0
                            ? 'font-medium text-red-600'
                            : 'font-medium text-amber-600'
                        }
                      >
                        {product.stock === 0
                          ? 'Agotado'
                          : `${product.stock} unidades`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Pedidos por Estado</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-yellow-600">Pendientes</span>
                <span className="font-medium">
                  {stats?.orders.byStatus.pending ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-600">Confirmados</span>
                <span className="font-medium">
                  {stats?.orders.byStatus.confirmed ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-600">Enviados</span>
                <span className="font-medium">
                  {stats?.orders.byStatus.shipped ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-600">Entregados</span>
                <span className="font-medium">
                  {stats?.orders.byStatus.delivered ?? 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-red-600">Cancelados</span>
                <span className="font-medium">
                  {stats?.orders.byStatus.cancelled ?? 0}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Productos por Categoría</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {stats?.products.byCategory.map((cat) => (
                <div key={cat.categoryId} className="flex justify-between">
                  <span>{cat.categoryName}</span>
                  <span className="font-medium">{cat.productCount}</span>
                </div>
              ))}
              {(!stats?.products.byCategory ||
                stats.products.byCategory.length === 0) && (
                <p className="text-muted-foreground">No hay categorías</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recientes</CardTitle>
        </CardHeader>
        <CardContent>
          <RecentOrdersTable orders={stats?.recentOrders ?? []} />
        </CardContent>
      </Card>
    </div>
  )
}
