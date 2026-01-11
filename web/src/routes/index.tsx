import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/sections/home/Hero'
import ProductsList from '../components/sections/products/ProductsList'

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
