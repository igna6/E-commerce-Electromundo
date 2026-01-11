import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/pages/Hero'
import ProductsList from '../components/ProductsList'

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
