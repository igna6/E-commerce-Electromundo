import { Link } from '@tanstack/react-router'
import { Zap, ChevronRight, Sparkles } from 'lucide-react'

function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-mesh-hero">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Floating orbs */}
        <div className="absolute top-20 left-[15%] w-72 h-72 bg-cyan-500/20 rounded-full blur-[100px] animate-float" />
        <div className="absolute bottom-20 right-[10%] w-96 h-96 bg-orange-500/15 rounded-full blur-[120px] animate-float [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[150px] animate-pulse" />

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Diagonal accent line */}
        <div className="absolute top-0 right-0 w-[2px] h-[300px] bg-gradient-to-b from-cyan-500 via-cyan-500/50 to-transparent transform rotate-[30deg] origin-top-right translate-x-20" />
        <div className="absolute bottom-0 left-0 w-[2px] h-[200px] bg-gradient-to-t from-orange-500 via-orange-500/50 to-transparent transform -rotate-[30deg] origin-bottom-left -translate-x-10" />
      </div>

      {/* Noise texture */}
      <div className="absolute inset-0 noise pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl">
          {/* Announcement badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass mb-8 opacity-0 animate-slide-up">
            <span className="flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            <span className="text-sm text-cyan-300 font-medium">Nuevos productos disponibles</span>
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </div>

          {/* Main heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[0.9] tracking-tight mb-6 opacity-0 animate-slide-up [animation-delay:100ms]">
            <span className="block text-white">ElectroMundo</span>
            <span className="block mt-2 text-gradient">
              transforma tu hogar
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-xl mb-10 leading-relaxed opacity-0 animate-slide-up [animation-delay:200ms]">
            Equipa tu casa con los mejores precios en tecnología.
            <span className="text-cyan-400"> Calidad garantizada</span> en cada producto.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 opacity-0 animate-slide-up [animation-delay:300ms]">
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold text-slate-900 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-glow-lg active:scale-[0.98]"
            >
              {/* Button gradient background */}
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-cyan-500 to-emerald-400 transition-all duration-300" />
              <span className="absolute inset-0 bg-gradient-to-r from-cyan-300 via-cyan-400 to-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Button content */}
              <span className="relative flex items-center gap-2">
                <Zap className="w-5 h-5" />
                <span>Ver Ofertas</span>
              </span>

              {/* Shimmer effect */}
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            </Link>

            <Link
              to="/products"
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 font-semibold rounded-xl border border-white/20 text-white/90 transition-all duration-300 hover:border-cyan-500/50 hover:text-cyan-400 hover:bg-cyan-500/10 active:scale-[0.98]"
            >
              <Sparkles className="w-5 h-5" />
              <span>Más Vendidos</span>
            </Link>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center gap-8 mt-16 pt-8 border-t border-white/10 opacity-0 animate-slide-up [animation-delay:400ms]">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 border-2 border-slate-900 flex items-center justify-center text-xs font-bold text-cyan-400"
                  >
                    {['A', 'M', 'L', 'R'][i]}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-white">+2,500</p>
                <p className="text-xs text-slate-500">clientes satisfechos</p>
              </div>
            </div>

            <div className="h-10 w-px bg-white/10" />

            <div>
              <div className="flex items-center gap-1 mb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-xs text-slate-500">4.9 de calificación</p>
            </div>

            <div className="h-10 w-px bg-white/10 hidden sm:block" />

            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-white">Envío Gratis</p>
              <p className="text-xs text-slate-500">en compras +$50,000</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  )
}

export default Hero
