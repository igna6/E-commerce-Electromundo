import { createFileRoute } from '@tanstack/react-router'
import Hero from '../components/pages/Hero'


export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main className="bg-white">
      <Hero />
    </main>
  )
}