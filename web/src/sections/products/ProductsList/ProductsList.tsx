import { useEffect, useState } from 'react'
import ProductCard from './components/ProductCard'
import ProductsLoading from './components/ProductsLoading'
import ProductsError from './components/ProductsError'
import ProductsEmpty from './components/ProductsEmpty'
import ProductsSearchBar from './components/ProductsSearchBar'
import ProductsPagination from './components/ProductsPagination'
import { getProducts } from '@/services/products.service'
import type { Product } from '@/types/product'
import type { Pagination } from '@/types/api'

function ProductsList() {
  const [products, setProducts] = useState<Product[]>([])
  const [pagination, setPagination] = useState<Pagination | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')

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

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (loading) {
    return <ProductsLoading />
  }

  if (error) {
    return <ProductsError error={error} onRetry={() => setPage(1)} />
  }

  if (products.length === 0) {
    return <ProductsEmpty />
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">
          Nuestros Productos
        </h2>

        <ProductsSearchBar value={searchQuery} onChange={setSearchQuery} />

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {pagination && (
          <ProductsPagination pagination={pagination} onPageChange={setPage} />
        )}
      </div>
    </section>
  )
}

export default ProductsList
