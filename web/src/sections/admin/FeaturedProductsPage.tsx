import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import {
  addFeaturedProduct,
  getAdminFeaturedProducts,
  removeFeaturedProduct,
  updateFeaturedProduct,
} from '@/services/featuredProducts.service'
import { getProducts } from '@/services/products.service'
import { formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'
import type { FeaturedProduct } from '@/types/featuredProduct'

const SECTION = 'home'

export default function FeaturedProductsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [debounceTimer, setDebounceTimer] =
    useState<ReturnType<typeof setTimeout>>()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [positionDraft, setPositionDraft] = useState(0)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    if (debounceTimer) clearTimeout(debounceTimer)
    setDebounceTimer(setTimeout(() => setDebouncedSearch(value), 300))
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-featured-products', SECTION],
    queryFn: () => getAdminFeaturedProducts(SECTION),
  })

  const { data: searchResults } = useQuery({
    queryKey: ['products', { search: debouncedSearch, limit: 8 }],
    queryFn: () => getProducts({ search: debouncedSearch, limit: 8 }),
    enabled: debouncedSearch.length >= 2,
  })

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['admin-featured-products'] })
    queryClient.invalidateQueries({ queryKey: ['featured-products'] })
    queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const addMutation = useMutation({
    mutationFn: (productId: number) =>
      addFeaturedProduct({
        section: SECTION,
        productId,
        position: data?.data.length ?? 0,
      }),
    onSuccess: () => {
      invalidate()
      setSearch('')
      setDebouncedSearch('')
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, position }: { id: number; position: number }) =>
      updateFeaturedProduct(id, { position }),
    onSuccess: () => {
      invalidate()
      setEditingId(null)
    },
  })

  const removeMutation = useMutation({
    mutationFn: removeFeaturedProduct,
    onSuccess: () => invalidate(),
  })

  if (isLoading)
    return <AdminLoadingState message="Cargando productos destacados..." />
  if (error) return <AdminErrorState error={error} />

  const featured = [...(data?.data ?? [])].sort(
    (a, b) => a.position - b.position,
  )
  const featuredIds = new Set(featured.map((f) => f.productId))

  const filteredResults = (searchResults?.data ?? []).filter(
    (p) => !featuredIds.has(p.id),
  )

  const startEdit = (item: FeaturedProduct) => {
    setEditingId(item.id)
    setPositionDraft(item.position)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Productos Destacados (Home)</h1>
        <p className="text-sm text-gray-500 mt-1">
          Administra los productos que aparecen en la sección &ldquo;Productos
          Destacados&rdquo; de la página principal. Posición menor aparece
          primero.
        </p>
      </div>

      {/* Search to add products */}
      <div className="rounded-lg border bg-white p-6">
        <h3 className="mb-4 font-semibold text-lg">Agregar producto</h3>
        <input
          type="text"
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="w-full rounded-md border px-3 py-2"
          placeholder="Buscar producto por nombre..."
        />

        {debouncedSearch.length >= 2 && filteredResults.length > 0 && (
          <div className="mt-2 rounded-md border divide-y max-h-64 overflow-y-auto">
            {filteredResults.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-3 px-3 py-2 hover:bg-gray-50"
              >
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-10 h-10 rounded object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded bg-gray-100 flex-shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {toTitleCase(product.name)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatPrice(product.price)} &middot; Stock: {product.stock}
                  </p>
                </div>
                <button
                  onClick={() => addMutation.mutate(product.id)}
                  disabled={addMutation.isPending}
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700 disabled:opacity-50 flex-shrink-0"
                >
                  Agregar
                </button>
              </div>
            ))}
          </div>
        )}

        {debouncedSearch.length >= 2 && filteredResults.length === 0 && (
          <p className="mt-2 text-sm text-gray-500">
            No se encontraron productos disponibles.
          </p>
        )}
      </div>

      {/* Current featured products */}
      <div className="space-y-3">
        <h3 className="font-semibold text-lg">
          Productos destacados ({featured.length})
        </h3>

        {featured.length === 0 ? (
          <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
            No hay productos destacados. Busca y agrega productos arriba.
          </div>
        ) : (
          featured.map((item) => (
            <div
              key={item.id}
              className="rounded-lg border bg-white p-4 flex items-center gap-4"
            >
              {item.product.image ? (
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-gray-100 flex-shrink-0" />
              )}

              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">
                  {toTitleCase(item.product.name)}
                </p>
                <p className="text-sm text-gray-500">
                  {formatPrice(item.product.price)} &middot; Stock:{' '}
                  {item.product.stock}
                </p>
              </div>

              {editingId === item.id ? (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <input
                    type="number"
                    value={positionDraft}
                    onChange={(e) =>
                      setPositionDraft(parseInt(e.target.value) || 0)
                    }
                    className="w-20 rounded-md border px-2 py-1 text-sm"
                    min={0}
                  />
                  <button
                    onClick={() =>
                      updateMutation.mutate({
                        id: item.id,
                        position: positionDraft,
                      })
                    }
                    disabled={updateMutation.isPending}
                    className="rounded-md bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:opacity-50"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    Posición: {item.position}
                  </span>
                  <button
                    onClick={() => startEdit(item)}
                    className="text-sm text-blue-600 hover:underline flex-shrink-0"
                  >
                    Editar posición
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm('¿Quitar este producto de Destacados?')
                      ) {
                        removeMutation.mutate(item.id)
                      }
                    }}
                    disabled={removeMutation.isPending}
                    className="text-sm text-red-600 hover:underline flex-shrink-0"
                  >
                    Quitar
                  </button>
                </>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
