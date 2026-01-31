import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { getProducts, deleteProduct } from '@/services/products.service'
import ProductsTable from '@/sections/admin/ProductsTable'

function ProductsIndexComponent() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { page, limit: 20 }],
    queryFn: () => getProducts({ page, limit: 20 }),
  })

  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
  })

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      deleteMutation.mutate(id)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando productos...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar productos: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <Link
          to="/admin/products/new"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Nuevo Producto
        </Link>
      </div>

      <div className="rounded-lg border bg-white">
        <ProductsTable
          products={data?.data ?? []}
          onDelete={handleDelete}
          isDeleting={deleteMutation.isPending}
        />
      </div>

      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Mostrando {data.data.length} de {data.pagination.total} productos
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

export const Route = createFileRoute('/admin/products/')({
  component: ProductsIndexComponent,
})
