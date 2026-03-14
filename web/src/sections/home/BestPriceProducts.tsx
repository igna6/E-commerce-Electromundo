import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

function BestPriceProducts() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 8,
    sortBy: 'price-asc',
    inStock: true,
  })

  const { data: categories } = useCategories()

  const categoryMap = useMemo(() => {
    if (!categories) return new Map<number, string>()
    const map = new Map<number, string>()
    for (const cat of categories) {
      map.set(cat.id, cat.name)
    }
    return map
  }, [categories])

  const products = data?.data ?? []

  if (isLoading) return null
  if (products.length === 0) return null

  return (
    <section className="bg-slate-50 py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Mejores Precios
          </h2>
          <Link
            to="/products"
            search={{ sortBy: 'price-asc', inStock: true }}
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
              categoryName={
                product.category
                  ? categoryMap.get(product.category)
                  : undefined
              }
            />
          ))}
        </div>

        {/* Mobile "ver todos" */}
        <div className="mt-8 text-center sm:hidden">
          <Link
            to="/products"
            search={{ sortBy: 'price-asc', inStock: true }}
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

export default BestPriceProducts
