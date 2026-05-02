import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/sections/home/Hero'
import BenefitsBar from '@/sections/home/BenefitsBar'
import FeaturedProducts from '@/sections/home/FeaturedProducts/FeaturedProducts'
import FlashSale from '@/sections/home/FlashSale'
import PromoSection from '@/sections/home/PromoSection'
import BestPriceProducts from '@/sections/home/BestPriceProducts'
import PaymentMethods from '@/sections/home/PaymentMethods'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="bg-[#f5f5f5]">
      <Hero />
      <BenefitsBar />

      {/* Divider */}
      <div className="container mx-auto px-4 sm:px-6">
        <div className="border-t border-slate-200" />
      </div>

      <FeaturedProducts />
      <FlashSale />
      <PromoSection />
      <BestPriceProducts />
      <PaymentMethods />
    </main>
  )
}
