import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import ProductsLoading from './components/ProductsLoading'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

function FeaturedProducts() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    sortBy: 'newest',
  })
  const { data: categoriesData } = useCategories()

  const categoryMap = useMemo(() => {
    if (!categoriesData) return new Map<number, string>()
    return new Map(categoriesData.map((c) => [c.id, c.name]))
  }, [categoriesData])

  const products = data?.data ?? []

  if (isLoading) {
    return <ProductsLoading />
  }

  if (products.length === 0) return null

  return (
    <section className="bg-white py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Productos Destacados
          </h2>
          <Link
            to="/products"
            className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
          >
            Ver todos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={product.category ? categoryMap.get(product.category) : undefined}
            />
          ))}
        </div>

        {/* Mobile "ver todos" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
          >
            Ver todos los productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
