import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState, useEffect, useRef } from 'react'
import { getProducts, deleteProduct } from '@/services/products.service'
import { getCategories } from '@/services/categories.service'
import ProductsTable from '@/sections/admin/ProductsTable'
import ImportProductsDialog from '@/sections/admin/ImportProductsDialog'

function ProductsIndexComponent() {
  const queryClient = useQueryClient()
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [importOpen, setImportOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search)
      setPage(1)
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categoryMap = (categoriesData?.data ?? []).reduce<Record<number, string>>(
    (acc, cat) => {
      acc[cat.id] = cat.name
      return acc
    },
    {}
  )

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', { page, limit: 20, search: debouncedSearch }],
    queryFn: () =>
      getProducts({
        page,
        limit: 20,
        ...(debouncedSearch ? { search: debouncedSearch } : {}),
      }),
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

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar productos: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Productos</h1>
        <div className="flex gap-2">
          <button
            onClick={() => setImportOpen(true)}
            className="rounded-md border border-blue-600 px-4 py-2 text-sm text-blue-600 hover:bg-blue-50"
          >
            Importar CSV
          </button>
          <Link
            to="/admin/products/new"
            className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700"
          >
            Nuevo Producto
          </Link>
        </div>
      </div>

      <ImportProductsDialog open={importOpen} onOpenChange={setImportOpen} />

      {/* Search bar */}
      <div className="relative">
        <svg
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        <input
          ref={searchInputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre, SKU o descripción..."
          className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        {search && (
          <button
            onClick={() => {
              setSearch('')
              searchInputRef.current?.focus()
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="rounded-lg border bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-sm text-gray-500">Cargando productos...</div>
          </div>
        ) : (
          <ProductsTable
            products={data?.data ?? []}
            onDelete={handleDelete}
            isDeleting={deleteMutation.isPending}
            categoryMap={categoryMap}
          />
        )}
      </div>

      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500">
            {debouncedSearch
              ? `${data.pagination.total} resultado${data.pagination.total !== 1 ? 's' : ''} para "${debouncedSearch}"`
              : `${data.data.length} de ${data.pagination.total} productos`}
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.pagination.hasPrev}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="px-3 py-1.5 text-sm text-gray-600">
              {data.pagination.page} / {data.pagination.totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.pagination.hasNext}
              className="rounded-md border px-3 py-1.5 text-sm disabled:opacity-50"
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
