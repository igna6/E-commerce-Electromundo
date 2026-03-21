import { Link } from '@tanstack/react-router'
import {
  Baby,
  Bike,
  Cable,
  Droplets,
  Gamepad2,
  Hammer,
  Headphones,
  HeartPulse,
  Home,
  Laptop,
  Package,
  Refrigerator,
  Scissors,
  ShieldCheck,
  Smartphone,
  Sofa,
  Speaker,
  Tent,
  Thermometer,
  Tv,
  Watch,
  Wind,
  Waves,
} from 'lucide-react'
import type { Category } from '@/types/category'
import { useCategories } from '@/hooks/useCategories'

const categoryIconMap: Record<string, typeof Smartphone> = {
  celulares: Smartphone,
  telefonos: Smartphone,
  smartphones: Smartphone,
  'tv y video': Tv,
  televisores: Tv,
  tv: Tv,
  audio: Speaker,
  parlantes: Speaker,
  auriculares: Headphones,
  informatica: Laptop,
  'informática': Laptop,
  notebooks: Laptop,
  computadoras: Laptop,
  computacion: Laptop,
  electrodomesticos: Refrigerator,
  'electrodomésticos': Refrigerator,
  'pequeños': Package,
  climatizacion: Wind,
  'climatización': Wind,
  aire: Wind,
  belleza: Scissors,
  'cuidado personal': Scissors,
  salud: HeartPulse,
  bicicletas: Bike,
  camping: Tent,
  'hogar y muebles': Sofa,
  hogar: Home,
  herramientas: Hammer,
  'jardín': Hammer,
  termotanques: Thermometer,
  accesorios: Cable,
  cables: Cable,
  smartwatches: Watch,
  wearables: Watch,
  gaming: Gamepad2,
  consolas: Gamepad2,
  seguridad: ShieldCheck,
  purificadores: Droplets,
  piletas: Waves,
  'bebés': Baby,
  'niños': Baby,
}

function getCategoryIcon(name: string) {
  const lower = name.toLowerCase()
  for (const [key, icon] of Object.entries(categoryIconMap)) {
    if (lower.includes(key)) return icon
  }
  return Package
}

const categoryColors = [
  { color: '#00bcd4', bg: '#e0f7fa' },
  { color: '#9c27b0', bg: '#f3e5f5' },
  { color: '#f44336', bg: '#ffebee' },
  { color: '#2196f3', bg: '#e3f2fd' },
  { color: '#ff9800', bg: '#fff3e0' },
  { color: '#4caf50', bg: '#e8f5e9' },
  { color: '#e91e63', bg: '#fce4ec' },
  { color: '#3f51b5', bg: '#e8eaf6' },
  { color: '#009688', bg: '#e0f2f1' },
  { color: '#795548', bg: '#efebe9' },
]

function CategoryCard({ category, index }: { category: Category; index: number }) {
  const Icon = getCategoryIcon(category.name)
  const palette = categoryColors[index % categoryColors.length]

  return (
    <Link
      to="/products"
      search={{ category: category.id }}
      className="flex flex-col items-center gap-2 p-4 rounded-xl hover:shadow-md transition-all hover:-translate-y-0.5 cursor-pointer flex-shrink-0 w-[110px]"
      style={{ backgroundColor: palette.bg }}
    >
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center"
        style={{ backgroundColor: palette.color + '22' }}
      >
        <Icon size={22} style={{ color: palette.color }} />
      </div>
      <span className="text-xs text-slate-700 font-medium text-center leading-tight">
        {category.name}
      </span>
    </Link>
  )
}

function CategoryGridSkeleton() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 lg:grid-cols-10 gap-2 sm:gap-3">
      {[...Array(10)].map((_, i) => (
        <div key={i} className="flex flex-col items-center gap-2 p-3 rounded-xl bg-slate-50 animate-pulse">
          <div className="w-10 h-10 rounded-xl bg-slate-200" />
          <div className="h-3 w-12 rounded bg-slate-200" />
        </div>
      ))}
    </div>
  )
}

function CategoryGrid() {
  const { data, isLoading } = useCategories()

  // Only show top-level categories (no parent) on the homepage grid
  const categories = (data ?? []).filter((c) => c.parentCategoryId === null)

  if (isLoading) {
    return (
      <section className="py-6">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-slate-800">Categorías</h2>
          </div>
          <CategoryGridSkeleton />
        </div>
      </section>
    )
  }

  if (categories.length === 0) return null

  // Show up to 10 on the grid, link to see all
  const visibleCategories = categories.slice(0, 10)

  return (
    <section className="py-6">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-black text-slate-800">Categorías</h2>
          {categories.length > 10 && (
            <Link
              to="/products"
              className="text-primary text-sm font-semibold hover:underline"
            >
              Ver todas →
            </Link>
          )}
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
          {visibleCategories.map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default CategoryGrid
