import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { Product } from '@/types/product'

type ProductDetailTabsProps = {
  product: Product
}

export default function ProductDetailTabs({ product }: ProductDetailTabsProps) {
  return (
    <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <Tabs defaultValue="specifications" className="w-full">
        <TabsList className="w-full justify-start border-b border-gray-200 rounded-none bg-gray-50 p-0 h-auto">
          <TabsTrigger
            value="specifications"
            className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-white"
          >
            Especificaciones
          </TabsTrigger>
          <TabsTrigger
            value="reviews"
            className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-white"
          >
            Reseñas (128)
          </TabsTrigger>
          <TabsTrigger
            value="shipping"
            className="py-4 px-6 rounded-none border-b-2 border-transparent data-[state=active]:border-brand-blue data-[state=active]:bg-white"
          >
            Envío y Devoluciones
          </TabsTrigger>
        </TabsList>

        <TabsContent value="specifications" className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Marca</span>
              <span className="font-medium text-brand-dark">Genérica</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Modelo</span>
              <span className="font-medium text-brand-dark">2024</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Garantía</span>
              <span className="font-medium text-brand-dark">12 meses</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">País de origen</span>
              <span className="font-medium text-brand-dark">Argentina</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">Condición</span>
              <span className="font-medium text-brand-dark">Nuevo</span>
            </div>
            <div className="flex justify-between py-3 border-b border-gray-100">
              <span className="text-gray-600">SKU</span>
              <span className="font-medium text-brand-dark">EM-{product.id.toString().padStart(6, '0')}</span>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="reviews" className="p-6">
          <div className="space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="border-b border-gray-100 pb-6 last:border-0">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-brand-light rounded-full flex items-center justify-center">
                    <span className="text-brand-blue font-semibold">JD</span>
                  </div>
                  <div>
                    <p className="font-medium text-brand-dark">Juan D.</p>
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {[...Array(5)].map((_, j) => (
                          <svg
                            key={j}
                            className={`w-4 h-4 ${j < 5 - i ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">hace 2 días</span>
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">
                  Excelente producto, llegó en perfectas condiciones. La calidad es muy buena y el precio fue justo.
                  Recomiendo totalmente esta compra.
                </p>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 bg-green-50 rounded-lg">
              <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <div>
                <h4 className="font-semibold text-green-800">Envío Gratis</h4>
                <p className="text-green-700 text-sm">En compras mayores a $50.000. Tiempo estimado: 3-5 días hábiles.</p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-lg">
              <svg className="w-6 h-6 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <div>
                <h4 className="font-semibold text-blue-800">Devolución Gratuita</h4>
                <p className="text-blue-700 text-sm">Tienes 30 días para devolver tu producto sin costo adicional.</p>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
