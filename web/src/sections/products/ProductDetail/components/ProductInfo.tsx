import type { Product } from '@/types/product'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

type ProductInfoProps = {
  product: Product
  categoryName?: string
}

export default function ProductInfo({ product, categoryName }: ProductInfoProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        {categoryName && (
          <p className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-2">
            {categoryName}
          </p>
        )}
        <div className="flex items-center gap-2 mb-2">
          {product.stock > 0 ? (
            <Badge className="bg-green-500 hover:bg-green-600">En Stock</Badge>
          ) : (
            <Badge className="bg-red-500 hover:bg-red-600">Agotado</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-brand-dark mb-3">
          {toTitleCase(product.name)}
        </h1>
      </div>

      <Separator className="mb-6" />

      {/* Price */}
      <div className="mb-6">
        <span className="text-4xl font-bold text-brand-orange">
          {formatPrice(product.price)}
        </span>
      </div>

      {/* Description */}
      {product.description && (
        <div className="mb-6">
          <h3 className="font-semibold text-brand-dark mb-2">Descripción</h3>
          <p className="text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}

      <Separator className="mb-6" />
    </>
  )
}
