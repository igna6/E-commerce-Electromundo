import { Check } from 'lucide-react'
import type { Product } from '@/types/product'
import { applyTax, formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

type ProductInfoProps = {
  product: Product
  categoryName?: string
}

export default function ProductInfo({
  product,
  categoryName,
}: ProductInfoProps) {
  const hasPromotion =
    product.promotionPrice != null && product.promotionPrice < product.price
  const displayPrice = applyTax(
    hasPromotion ? product.promotionPrice! : product.price,
  )
  const originalPrice = hasPromotion ? applyTax(product.price) : null
  const discount = hasPromotion
    ? Math.round(
        ((product.price - product.promotionPrice!) / product.price) * 100,
      )
    : 0

  return (
    <div className="flex flex-col gap-3">
      {/* Category + Stock */}
      <div className="flex items-center gap-2 flex-wrap">
        {categoryName && (
          <>
            <span className="text-xs text-electric-cyan font-semibold uppercase tracking-wide">
              {categoryName}
            </span>
            <span className="text-gray-300">&middot;</span>
          </>
        )}
        {product.stock > 0 ? (
          <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-xs font-bold px-2 py-0.5 rounded-full">
            <Check size={10} />
            En Stock
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
            Agotado
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="text-amber-500 text-xs font-bold">
            &iexcl;Últimas {product.stock} unidades!
          </span>
        )}
      </div>

      {/* Title */}
      <h1 className="text-xl sm:text-2xl font-black text-gray-900 leading-tight">
        {toTitleCase(product.name)}
      </h1>

      {/* SKU */}
      {product.sku && (
        <p className="text-xs text-gray-400">
          SKU: {product.sku} &nbsp;|&nbsp; Vendido por:{' '}
          <span className="text-electric-cyan font-semibold">
            ElectroMundo Oficial
          </span>
        </p>
      )}

      <hr className="border-gray-100" />

      {/* Price */}
      <div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <p className="text-3xl font-black text-gray-900">
            {formatPrice(displayPrice)}
          </p>
          {originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(originalPrice)}
              </span>
              <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-lg">
                -{discount}%
              </span>
            </>
          )}
        </div>
      </div>

      <hr className="border-gray-100" />

      {/* Description */}
      {product.description && (
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-1">
            Descripción
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}
