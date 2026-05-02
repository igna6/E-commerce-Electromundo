import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'

function BestPriceProducts() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 10,
    sortBy: 'discount-desc',
    inStock: true,
    hasPromotion: true,
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
    <section className="py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-amber-500" />
              <h2 className="text-xl font-black text-slate-900">
                Mejores Precios
              </h2>
            </div>
            <p className="text-slate-500 text-sm">
              Precios imperdibles todos los días
            </p>
          </div>
          <Link
            to="/products"
            search={{ sortBy: 'discount-desc', inStock: true, hasPromotion: true }}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-amber-500 hover:underline transition-colors"
          >
            Ver más
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.slice(0, 5).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              categoryName={
                product.category ? categoryMap.get(product.category) : undefined
              }
            />
          ))}
        </div>

        {/* Mobile "ver todos" */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            to="/products"
            search={{ sortBy: 'discount-desc', inStock: true, hasPromotion: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-lg transition-colors"
          >
            Ver todos los productos
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default BestPriceProducts
