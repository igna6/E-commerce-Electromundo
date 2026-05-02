import { Link } from '@tanstack/react-router'
import { Shield } from 'lucide-react'

function PromoSection() {
  return (
    <section className="py-4">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-[#004d40] to-[#00897b] rounded-2xl p-6 flex items-center gap-5 overflow-hidden relative">
          <div
            className="absolute right-0 top-0 bottom-0 w-40 opacity-10"
            style={{
              background:
                'radial-gradient(circle at 80% 50%, white 0%, transparent 70%)',
            }}
          />
          <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
            <Shield size={28} className="text-white" />
          </div>
          <div>
            <h3 className="text-white font-black text-lg leading-tight">
              Garantía en todos
              <br />
              nuestros productos
            </h3>
            <p className="text-white/70 text-sm mt-1">
              Soporte técnico y servicio postventa
            </p>
            <Link
              to="/products"
              className="inline-block mt-3 text-xs font-bold text-cyan-300 hover:underline"
            >
              Más información →
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default PromoSection
