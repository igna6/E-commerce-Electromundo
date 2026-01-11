import { createFileRoute } from '@tanstack/react-router'
import Hero from '@/sections/home/Hero'
import ProductsList from '@/sections/products/ProductsList/ProductsList'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="bg-white">
      <Hero />
      <ProductsList />
    </main>
  )
}
