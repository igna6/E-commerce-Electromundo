import type { Product } from '@/types/product'

type ProductDetailTabsProps = {
  product: Product
}

export default function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  if (!product.description) {
    return null
  }

  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-6">
        <h3 className="text-lg font-semibold text-brand-dark mb-4">Descripción</h3>
        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
          {product.description}
        </p>
      </div>
    </div>
  )
}
