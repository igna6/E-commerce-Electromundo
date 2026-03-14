import { Link } from '@tanstack/react-router'
import { ArrowRight, ShieldCheck, Truck } from 'lucide-react'

function PromoSection() {
  return (
    <section className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 py-12 lg:py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left block — Garantía */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white/5 rounded-2xl p-6 sm:p-8">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary/20 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-primary" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                Garantía en todos nuestros productos
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Comprá con confianza. Todos nuestros productos cuentan con
                garantía oficial del fabricante.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
              >
                Ver productos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Right block — Envío gratis */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 bg-white/5 rounded-2xl p-6 sm:p-8">
            <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-500/20 flex items-center justify-center">
              <Truck className="w-7 h-7 text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                Envío gratis en compras +$50,000
              </h2>
              <p className="text-slate-400 text-sm mb-4">
                Hacé tu pedido y recibilo en la puerta de tu casa sin costo de
                envío en compras mayores a $50,000.
              </p>
              <Link
                to="/products"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                Empezar a comprar
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
