import type { Product } from '@/types/product'
import ProductCard from '@/components/ProductCard'

type RelatedProductsProps = {
  products: Array<Product>
  currentProductId: number
}

export default function RelatedProducts({ products, currentProductId }: RelatedProductsProps) {
  const related = products.filter((p) => p.id !== currentProductId).slice(0, 4)

  if (related.length === 0) return null

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-brand-dark mb-6">Productos Relacionados</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {related.map((relatedProduct) => (
          <ProductCard key={relatedProduct.id} product={relatedProduct} />
        ))}
      </div>
    </div>
  )
}
