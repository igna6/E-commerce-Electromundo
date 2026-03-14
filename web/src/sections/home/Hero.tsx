import { useCallback, useEffect, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { ArrowRight, ChevronLeft, ChevronRight, Zap } from 'lucide-react'
import type { Banner } from '@/types/banner'
import { getActiveBanners } from '@/services/banners.service'

function HeroSlide({ banner }: { banner: Banner }) {
  return (
    <div className="relative w-full flex-shrink-0">
      {banner.image ? (
        <div className="relative">
          <img
            src={banner.image}
            alt={banner.title}
            className="w-full h-[320px] sm:h-[400px] lg:h-[480px] object-cover"
          />
          {/* Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-4 sm:px-6">
              <div className="max-w-xl">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                  {banner.title}
                </h2>
                {banner.subtitle && (
                  <p className="text-base sm:text-lg text-white/85 mb-6 max-w-md leading-relaxed">
                    {banner.subtitle}
                  </p>
                )}
                {banner.buttonText && banner.buttonLink && (
                  <Link
                    to={banner.buttonLink}
                    className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-primary bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    {banner.buttonText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative bg-gradient-to-br from-primary via-primary to-teal-700 overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

          <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-24">
            <div className="max-w-xl">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-3">
                {banner.title}
              </h2>
              {banner.subtitle && (
                <p className="text-base sm:text-lg text-white/80 mb-6 max-w-md leading-relaxed">
                  {banner.subtitle}
                </p>
              )}
              {banner.buttonText && banner.buttonLink && (
                <Link
                  to={banner.buttonLink}
                  className="inline-flex items-center gap-2 px-6 py-3 font-semibold text-primary bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-lg"
                >
                  {banner.buttonText}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function DefaultHero() {
  return (
    <section className="relative bg-gradient-to-br from-primary via-primary to-teal-700 overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white/5 rounded-full translate-y-1/3 -translate-x-1/4" />
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-amber-400/10 rounded-full -translate-x-1/2 -translate-y-1/2" />

      <div className="relative container mx-auto px-4 sm:px-6 py-16 sm:py-20 lg:py-28">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6">
            <Zap className="w-4 h-4 text-amber-300" />
            <span className="text-sm font-medium text-white/90">
              Nuevos productos disponibles
            </span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
            Tecnología y electrodomésticos al mejor precio
          </h1>
          <p className="text-lg sm:text-xl text-white/80 mb-8 max-w-xl leading-relaxed">
            Equipá tu hogar con calidad garantizada. Envío gratis, las mejores marcas y atención personalizada.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 px-7 py-3.5 font-semibold text-primary bg-white rounded-lg hover:bg-slate-50 transition-colors shadow-lg shadow-black/10"
          >
            Ver productos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

function Hero() {
  const { data } = useQuery({
    queryKey: ['banners', 'active'],
    queryFn: getActiveBanners,
  })

  const banners = data?.data ?? []
  const [current, setCurrent] = useState(0)

  const goTo = useCallback(
    (index: number) => {
      setCurrent(((index % banners.length) + banners.length) % banners.length)
    },
    [banners.length],
  )

  // Auto-advance every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return
    const timer = setInterval(() => goTo(current + 1), 5000)
    return () => clearInterval(timer)
  }, [current, banners.length, goTo])

  // No banners from API → show default static hero
  if (banners.length === 0) {
    return <DefaultHero />
  }

  // Single banner → no carousel controls
  if (banners.length === 1) {
    return (
      <section className="relative overflow-hidden">
        <HeroSlide banner={banners[0]} />
      </section>
    )
  }

  return (
    <section className="relative overflow-hidden group">
      {/* Slides */}
      <div
        className="flex transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {banners.map((banner) => (
          <HeroSlide key={banner.id} banner={banner} />
        ))}
      </div>

      {/* Navigation arrows */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Banner anterior"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 hover:bg-white text-slate-700 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label="Siguiente banner"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {banners.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-2.5 h-2.5 rounded-full transition-all ${
              i === current
                ? 'bg-white w-7'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Ir al banner ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}

export default Hero
