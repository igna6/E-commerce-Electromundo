import { Link } from '@tanstack/react-router'
import { formatPrice } from '@/utils/formatPrice'
import type { Product } from '@/types/product'

type RelatedProductsProps = {
  products: Product[]
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
          <Link
            key={relatedProduct.id}
            to="/products/$productId"
            params={{ productId: String(relatedProduct.id) }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group"
          >
            <div className="aspect-square bg-gray-100 overflow-hidden">
              {relatedProduct.image ? (
                <img
                  src={relatedProduct.image}
                  alt={relatedProduct.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              )}
            </div>
            <div className="p-3">
              <h3 className="font-medium text-brand-dark truncate text-sm">
                {relatedProduct.name}
              </h3>
              <p className="text-brand-orange font-bold">
                {formatPrice(relatedProduct.price)}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
