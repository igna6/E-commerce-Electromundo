import { useState, useEffect, useMemo } from 'react'
import { Link } from '@tanstack/react-router'
import { Zap } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { applyTax, formatPrice } from '@/utils/formatPrice'
import { toTitleCase } from '@/utils/toTitleCase'

function useCountdown(endTime: Date) {
  const getTimeLeft = () => {
    const diff = endTime.getTime() - Date.now()
    if (diff <= 0) return { h: 0, m: 0, s: 0 }
    const h = Math.floor(diff / 3600000)
    const m = Math.floor((diff % 3600000) / 60000)
    const s = Math.floor((diff % 60000) / 1000)
    return { h, m, s }
  }
  const [time, setTime] = useState(getTimeLeft)
  useEffect(() => {
    const t = setInterval(() => setTime(getTimeLeft()), 1000)
    return () => clearInterval(t)
  }, [])
  return time
}

function TimeBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white/20 rounded-lg px-3 py-1.5 min-w-[3rem] text-center">
        <span className="text-2xl font-black text-white tabular-nums">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-white/70 text-xs mt-1">{label}</span>
    </div>
  )
}

function FlashSale() {
  const { data, isLoading } = useProducts({
    page: 1,
    limit: 4,
    inStock: true,
    sortBy: 'price-asc',
  })

  const endTime = useMemo(() => new Date(Date.now() + 4 * 3600000 + 23 * 60000 + 47000), [])
  const { h, m, s } = useCountdown(endTime)

  const products = data?.data ?? []

  if (isLoading || products.length === 0) return null

  return (
    <section className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] py-6">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500 p-2 rounded-lg">
              <Zap size={20} className="text-white fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">FLASH SALE</h2>
              <p className="text-white/60 text-xs">Ofertas por tiempo limitado</p>
            </div>
          </div>

          {/* Countdown */}
          <div className="flex items-center gap-2">
            <span className="text-white/60 text-sm mr-1">Termina en:</span>
            <TimeBlock value={h} label="Hs" />
            <span className="text-white/60 text-xl font-black mb-4">:</span>
            <TimeBlock value={m} label="Min" />
            <span className="text-white/60 text-xl font-black mb-4">:</span>
            <TimeBlock value={s} label="Seg" />
          </div>

          <Link
            to="/products"
            search={{ sortBy: 'price-asc', inStock: true }}
            className="text-amber-500 text-sm font-semibold hover:underline hidden sm:block"
          >
            Ver todas las ofertas →
          </Link>
        </div>

        {/* Products */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {products.map((product) => {
            const priceWithTax = applyTax(product.price)
            return (
              <Link
                key={product.id}
                to="/products/$productId"
                params={{ productId: String(product.id) }}
                className="bg-white/5 border border-white/10 rounded-xl overflow-hidden hover:border-amber-500/50 hover:bg-white/10 transition-all cursor-pointer group"
              >
                <div className="relative pt-[75%] bg-white/5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={toTitleCase(product.name)}
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Zap size={32} className="text-white/20" />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-white/80 text-xs leading-snug mb-2 line-clamp-2">
                    {toTitleCase(product.name)}
                  </p>
                  <p className="text-amber-500 text-lg font-black">
                    {formatPrice(priceWithTax)}
                  </p>

                  {/* Stock bar */}
                  {product.stock <= 15 && (
                    <div className="mt-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-red-400 font-semibold">
                          ¡Últimas {product.stock} unidades!
                        </span>
                      </div>
                      <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-red-500 rounded-full"
                          style={{ width: `${Math.min((product.stock / 20) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default FlashSale
