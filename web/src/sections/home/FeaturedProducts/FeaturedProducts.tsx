import { useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { ChevronRight } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import ProductsLoading from './components/ProductsLoading'
import ProductCard from '@/components/ProductCard'
import { useCategories } from '@/hooks/useCategories'
import { getFeaturedProducts } from '@/services/featuredProducts.service'

function FeaturedProducts() {
  const { data, isLoading } = useQuery({
    queryKey: ['featured-products', 'home'],
    queryFn: () => getFeaturedProducts('home'),
  })
  const { data: categoriesData } = useCategories()

  const categoryMap = useMemo(() => {
    if (!categoriesData) return new Map<number, string>()
    return new Map(categoriesData.map((c) => [c.id, c.name]))
  }, [categoriesData])

  const products = (data?.data ?? []).map((item) => item.product)

  if (isLoading) {
    return <ProductsLoading />
  }

  if (products.length === 0) return null

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section header */}
        <div className="flex items-end justify-between mb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-1 h-6 rounded-full bg-primary" />
              <h2 className="text-xl font-black text-slate-900">
                Productos Destacados
              </h2>
            </div>
            <p className="text-slate-500 text-sm">
              Los más elegidos de la semana
            </p>
          </div>
          <Link
            to="/products"
            search={{ featured: true }}
            className="hidden sm:flex items-center gap-1 text-sm font-semibold text-primary hover:underline transition-colors"
          >
            Ver todos
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Product grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {products.map((product) => (
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
            search={{ featured: true }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-white font-semibold rounded-lg transition-colors"
          >
            Ver todos los destacados
            <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}

export default FeaturedProducts
