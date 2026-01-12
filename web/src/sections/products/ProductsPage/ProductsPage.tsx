import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ProductGridCard from './components/ProductGridCard'
import { useProducts } from '@/hooks/useProducts'

const categories = [
  { id: 'all', label: 'Todos' },
  { id: 'electronics', label: 'Electrónica' },
  { id: 'computers', label: 'Computadoras' },
  { id: 'phones', label: 'Celulares' },
  { id: 'audio', label: 'Audio' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'accessories', label: 'Accesorios' },
]

const brands = [
  'Apple',
  'Samsung',
  'Sony',
  'LG',
  'HP',
  'Dell',
  'Logitech',
  'JBL',
]

function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [priceRange, setPriceRange] = useState([0, 500000])
  const [selectedBrands, setSelectedBrands] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const { data, isLoading } = useProducts({ page: 1, limit: 24 })

  const toggleBrand = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    )
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setPriceRange([0, 500000])
    setSelectedBrands([])
  }

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    priceRange[0] > 0 ||
    priceRange[1] < 500000

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Categories */}
      <div>
        <h3 className="font-semibold text-brand-dark mb-3">Categorías</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                selectedCategory === category.id
                  ? 'bg-brand-blue text-white'
                  : 'hover:bg-gray-100 text-gray-700'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      {/* Price Range */}
      <div>
        <h3 className="font-semibold text-brand-dark mb-3">Rango de Precio</h3>
        <div className="px-2">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500000}
            step={1000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>${priceRange[0].toLocaleString()}</span>
            <span>${priceRange[1].toLocaleString()}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Brands */}
      <div>
        <h3 className="font-semibold text-brand-dark mb-3">Marcas</h3>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 px-2 py-1.5 rounded-lg transition-colors"
            >
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
              />
              <span className="text-gray-700">{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            Limpiar Filtros
          </Button>
        </>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-brand-dark to-brand-blue py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Nuestros Productos
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl">
            Descubre la mejor tecnología con los mejores precios. Calidad garantizada en cada producto.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-11"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-48 h-11">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${
                  viewMode === 'list'
                    ? 'bg-brand-blue text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="lg:hidden h-11">
                  <svg
                    className="w-5 h-5 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                    />
                  </svg>
                  Filtros
                  {hasActiveFilters && (
                    <Badge className="ml-2 bg-brand-orange">
                      {selectedBrands.length + (selectedCategory !== 'all' ? 1 : 0)}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-80">
                <h2 className="text-xl font-bold text-brand-dark mb-6">Filtros</h2>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-100">
              {selectedCategory !== 'all' && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {categories.find((c) => c.id === selectedCategory)?.label}
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className="ml-1 hover:text-red-500"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Badge>
              )}
              {selectedBrands.map((brand) => (
                <Badge
                  key={brand}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1"
                >
                  {brand}
                  <button
                    onClick={() => toggleBrand(brand)}
                    className="ml-1 hover:text-red-500"
                  >
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-24">
              <h2 className="text-lg font-bold text-brand-dark mb-4">Filtros</h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                Mostrando{' '}
                <span className="font-semibold text-brand-dark">
                  {data?.data.length || 0}
                </span>{' '}
                productos
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200 animate-pulse"
                  >
                    <div className="aspect-square bg-gray-200" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-6 bg-gray-200 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {data?.data.map((product) => (
                  <ProductGridCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-10">
                <div className="flex items-center gap-2">
                  <Button variant="outline" disabled={!data.pagination.hasPrev}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Button>
                  {[...Array(Math.min(5, data.pagination.totalPages))].map(
                    (_, i) => (
                      <Button
                        key={i}
                        variant={i === 0 ? 'default' : 'outline'}
                        className={i === 0 ? 'bg-brand-blue' : ''}
                      >
                        {i + 1}
                      </Button>
                    )
                  )}
                  <Button variant="outline" disabled={!data.pagination.hasNext}>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
