import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/sections/home/Hero'
import FeaturedProducts from '@/sections/home/FeaturedProducts/FeaturedProducts'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <FeaturedProducts />
    </main>
  )
}
