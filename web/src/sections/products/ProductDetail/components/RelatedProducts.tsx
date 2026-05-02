import { ChevronRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'

type RelatedProductsProps = {
  product: Product
  categoryName?: string
}

export default function RelatedProducts({
  product,
  categoryName,
}: RelatedProductsProps) {
  const { data: productsData } = useProducts(
    product.category
      ? { page: 1, limit: 5, category: product.category }
      : { page: 1, limit: 20 },
  )

  const related = (productsData?.data ?? [])
    .filter((p) => p.id !== product.id)
    .slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <div className="flex items-end justify-between mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-6 rounded-full bg-electric-cyan" />
            <h2 className="text-xl font-black text-gray-900">
              Productos Relacionados
            </h2>
          </div>
          <p className="text-gray-500 text-sm">También te puede interesar</p>
        </div>
        <Link
          to="/products"
          search={product.category ? { category: product.category } : {}}
          className="flex items-center gap-1 text-sm font-semibold text-electric-cyan hover:underline"
        >
          Ver todos
          <ChevronRight size={16} />
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {related.map((relatedProduct) => (
          <ProductCard
            key={relatedProduct.id}
            product={relatedProduct}
            categoryName={categoryName}
          />
        ))}
      </div>
    </div>
  )
}
