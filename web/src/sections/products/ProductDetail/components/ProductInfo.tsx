import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { formatPrice } from '@/utils/formatPrice'
import type { Product } from '@/types/product'

type ProductInfoProps = {
  product: Product
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="secondary">Electrónica</Badge>
          {product.stock > 0 ? (
            <Badge className="bg-green-500 hover:bg-green-600">En Stock</Badge>
          ) : (
            <Badge className="bg-red-500 hover:bg-red-600">Agotado</Badge>
          )}
        </div>
        <h1 className="text-3xl font-bold text-brand-dark mb-3">
          {product.name}
        </h1>

        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-600">(4.2) - 128 reseñas</span>
        </div>
      </div>

      <Separator className="mb-6" />

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-brand-orange">
            {formatPrice(product.price)}
          </span>
          <span className="text-xl text-gray-400 line-through">
            {formatPrice(Math.round(product.price * 1.15))}
          </span>
          <Badge className="bg-red-500 hover:bg-red-600">-15%</Badge>
        </div>
        <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          ¡12 cuotas sin interés de {formatPrice(Math.round(product.price / 12))}!
        </p>
      </div>

      {/* Description */}
      <div className="mb-6">
        <h3 className="font-semibold text-brand-dark mb-2">Descripción</h3>
        <p className="text-gray-600 leading-relaxed">
          {product.description || 'Producto de alta calidad con garantía oficial. Envío a todo el país.'}
        </p>
      </div>

      {/* Quick Features */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-brand-light rounded-lg">
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Garantía 12 meses</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-brand-light rounded-lg">
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Envío gratis</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-brand-light rounded-lg">
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Compra protegida</span>
        </div>
        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
          <div className="p-2 bg-brand-light rounded-lg">
            <svg className="w-5 h-5 text-brand-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <span className="text-sm text-gray-700">Devolución gratis</span>
        </div>
      </div>

      <Separator className="mb-6" />
    </>
  )
}
