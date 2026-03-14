import type { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'
import { useProducts } from '@/hooks/useProducts'

type RelatedProductsProps = {
  product: Product
  categoryName?: string
}

export default function RelatedProducts({ product, categoryName }: RelatedProductsProps) {
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
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Productos Relacionados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
