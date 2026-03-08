import { Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import {
  Smartphone,
  Tv,
  Laptop,
  Refrigerator,
  WashingMachine,
  Wind,
  Headphones,
  Gamepad2,
  Speaker,
  Package,
} from 'lucide-react'
import { getCategories } from '@/services/categories.service'
import type { Category } from '@/types/category'

// Map common category names to icons
const categoryIconMap: Record<string, typeof Smartphone> = {
  celulares: Smartphone,
  telefonos: Smartphone,
  smartphones: Smartphone,
  televisores: Tv,
  tv: Tv,
  smart: Tv,
  computacion: Laptop,
  notebooks: Laptop,
  computadoras: Laptop,
  heladeras: Refrigerator,
  refrigeracion: Refrigerator,
  lavarropas: WashingMachine,
  lavado: WashingMachine,
  climatizacion: Wind,
  aire: Wind,
  audio: Speaker,
  parlantes: Speaker,
  auriculares: Headphones,
  gaming: Gamepad2,
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (lower.includes(key)) return icon
  }
  return Package
}

// Assign a color from a palette based on index
const categoryColors = [
  { bg: 'bg-cyan-50', text: 'text-cyan-600', hover: 'hover:bg-cyan-100' },
  { bg: 'bg-amber-50', text: 'text-amber-600', hover: 'hover:bg-amber-100' },
  { bg: 'bg-violet-50', text: 'text-violet-600', hover: 'hover:bg-violet-100' },
  { bg: 'bg-emerald-50', text: 'text-emerald-600', hover: 'hover:bg-emerald-100' },
  { bg: 'bg-rose-50', text: 'text-rose-600', hover: 'hover:bg-rose-100' },
  { bg: 'bg-blue-50', text: 'text-blue-600', hover: 'hover:bg-blue-100' },
  { bg: 'bg-orange-50', text: 'text-orange-600', hover: 'hover:bg-orange-100' },
  { bg: 'bg-teal-50', text: 'text-teal-600', hover: 'hover:bg-teal-100' },
]

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const Icon = getCategoryIcon(category.name)
  const color = categoryColors[index % categoryColors.length]!

  return (
    <Link
      to="/products"
      className={`group flex flex-col items-center gap-3 p-5 sm:p-6 rounded-2xl ${color.bg} ${color.hover} border border-transparent hover:border-slate-200 transition-all duration-200 hover:shadow-sm`}
    >
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm flex items-center justify-center group-hover:scale-105 transition-transform duration-200">
        <Icon className={`w-6 h-6 sm:w-7 sm:h-7 ${color.text}`} />
      </div>
      <span className="font-semibold text-sm sm:text-base text-slate-800 text-center leading-tight">
        {category.name}
      </span>
    </Link>
  )
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-slate-50 animate-pulse">
          <div className="w-14 h-14 rounded-xl bg-slate-200" />
          <div className="h-4 w-20 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

function CategoryGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const categories = data?.data ?? []

  if (isLoading) {
    return (
      <section className="bg-slate-50 py-10 lg:py-14">
        <div className="container mx-auto px-4 sm:px-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
            Explorá por Categoría
          </h2>
          <CategoryGridSkeleton />
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  return (
    <section className="bg-slate-50 py-10 lg:py-14">
      <div className="container mx-auto px-4 sm:px-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8 text-center">
          Explorá por Categoría
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {categories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
