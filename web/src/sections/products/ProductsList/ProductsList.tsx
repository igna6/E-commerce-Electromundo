import { useState } from 'react'
import ProductCard from './components/ProductCard'
import ProductsLoading from './components/ProductsLoading'
import ProductsError from './components/ProductsError'
import ProductsEmpty from './components/ProductsEmpty'
import ProductsPagination from './components/ProductsPagination'
import CategoryFilter from '@/components/CategoryFilter'
import ProductControls from '@/components/ProductControls'
import { useProducts } from '@/hooks/useProducts'

function ProductsList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState('newest')

  const { data, isLoading, error, refetch } = useProducts({
    page,
    limit: 12,
    search: search || undefined,
    category,
    minPrice,
    maxPrice,
    sortBy: sortBy as any,
  })

  const products = data?.data ?? []
  const pagination = data?.pagination ?? null

  const handlePriceChange = (min?: number, max?: number) => {
    setMinPrice(min)
    setMaxPrice(max)
    setPage(1) // Reset to first page
  }

  const handleSearchChange = (value: string) => {
    setSearch(value)
    setPage(1) // Reset to first page
  }

  const handleCategoryChange = (cat?: number) => {
    setCategory(cat)
    setPage(1) // Reset to first page
  }

  const handleSortChange = (sort: string) => {
    setSortBy(sort)
    setPage(1) // Reset to first page
  }

  if (isLoading) {
    return <ProductsLoading />
  }

  if (error) {
    return (
      <ProductsError
        error={error instanceof Error ? error.message : 'Error desconocido'}
        onRetry={() => {
          setPage(1)
          refetch()
        }}
      />
    )
  }

  if (products.length === 0 && !search && !category && !minPrice && !maxPrice) {
    return <ProductsEmpty />
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-3xl font-bold text-brand-dark mb-8 text-center">
          Nuestros Productos
        </h2>

        {/* Filters */}
        <div className="mb-8 space-y-6">
          <CategoryFilter
            selectedCategory={category}
            onCategoryChange={handleCategoryChange}
          />
          <ProductControls
            search={search}
            onSearchChange={handleSearchChange}
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            sortBy={sortBy}
            onSortChange={handleSortChange}
          />
        </div>

        {/* Results */}
        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">
              No se encontraron productos que coincidan con los filtros seleccionados.
            </p>
            <button
              onClick={() => {
                setSearch('')
                setCategory(undefined)
                setMinPrice(undefined)
                setMaxPrice(undefined)
                setSortBy('newest')
                setPage(1)
              }}
              className="text-brand-primary hover:underline"
            >
              Limpiar filtros
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {pagination && (
              <ProductsPagination
                pagination={pagination}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>
    </section>
  )
}

export default ProductsList
