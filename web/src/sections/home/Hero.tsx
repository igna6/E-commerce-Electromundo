import { Link } from '@tanstack/react-router'
import { Truck, Shield, Tag } from 'lucide-react'

function Hero() {
  return (
    <section className="bg-white">
      {/* Main hero content */}
      <div className="container mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left column - Text content */}
          <div>
            <span className="inline-block px-3 py-1 text-sm font-medium text-primary bg-primary/10 rounded-full mb-6">
              Nuevos productos disponibles
            </span>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 leading-tight mb-6">
              Tecnología para tu hogar
            </h1>

            <p className="text-lg text-slate-600 mb-8 max-w-lg">
              Equipa tu casa con los mejores precios en electrodomésticos y tecnología. Calidad garantizada en cada producto.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors"
              >
                Ver productos
              </Link>
              <Link
                to="/products"
                className="inline-flex items-center justify-center px-6 py-3 font-semibold text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Ofertas del día
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="w-5 h-5 text-primary" />
                <span className="text-sm">Envío gratis +$50,000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-5 h-5 text-primary" />
                <span className="text-sm">Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="w-5 h-5 text-primary" />
                <span className="text-sm">Mejores precios</span>
              </div>
            </div>
          </div>

          {/* Right column - Featured product visual */}
          <div className="relative">
            <div className="bg-gradient-to-br from-slate-100 to-slate-50 rounded-2xl p-8 lg:p-12">
              <div className="aspect-square bg-white rounded-xl shadow-sm flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="w-32 h-32 mx-auto mb-6 bg-slate-100 rounded-full flex items-center justify-center">
                    <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-slate-500 text-sm">Descubre nuestros productos destacados</p>
                </div>
              </div>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 bg-white rounded-lg shadow-lg px-4 py-3 border border-slate-100">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white"
                    />
                  ))}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">+2,500</p>
                  <p className="text-xs text-slate-500">clientes satisfechos</p>
                </div>
              </div>
            </div>

            {/* Rating badge */}
            <div className="absolute -top-4 -right-4 bg-white rounded-lg shadow-lg px-4 py-3 border border-slate-100">
              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-700">4.9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom divider */}
      <div className="border-t border-slate-100" />
    </section>
  )
}

export default Hero
