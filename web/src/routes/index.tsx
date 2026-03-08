import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/sections/home/Hero'
import BenefitsBar from '@/sections/home/BenefitsBar'
import CategoryGrid from '@/sections/home/CategoryGrid'
import FeaturedProducts from '@/sections/home/FeaturedProducts/FeaturedProducts'
import PromoSection from '@/sections/home/PromoSection'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <BenefitsBar />
      <CategoryGrid />
      <FeaturedProducts />
      <PromoSection />
    </main>
  )
}
