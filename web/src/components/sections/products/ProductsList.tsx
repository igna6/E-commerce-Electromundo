import { useEffect, useState } from 'react'
import ProductCard from './ProductCard'
import { getProducts } from '../../../services/products.service'
import type { Product } from '../../../types/product'
import type { Pagination } from '../../../types/api'

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      setError(null)

      try {
        const response = await getProducts({ page, limit: 12 })
        setProducts(response.data)
        setPagination(response.pagination)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [page])

  if (loading) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">
            Nuestros Productos
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-full" />
                  <div className="h-6 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">
            Nuestros Productos
          </h2>
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => setPage(1)}
            className="mt-4 px-6 py-2 bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-brand-dark mb-4">
            Nuestros Productos
          </h2>
          <p className="text-gray-500">No hay productos disponibles.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">
          Nuestros Productos
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {pagination && pagination.totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-4">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-brand-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Anterior
            </button>

            <span className="text-gray-600">
              Página {pagination.page} de {pagination.totalPages}
            </span>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={!pagination.hasNext}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-brand-dark font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              Siguiente
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductsList
