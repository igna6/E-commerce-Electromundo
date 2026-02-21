import { useState } from 'react'
import { Search, SlidersHorizontal, Grid3X3, List, X, ChevronDown, Truck, Shield, Tag } from 'lucide-react'
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
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import ProductGridCard from './components/ProductGridCard'
import { useProducts } from '@/hooks/useProducts'

const categories = [
  { id: 'all', label: 'Todos', icon: '🌟' },
  { id: 'electronics', label: 'Electrónica', icon: '📱' },
  { id: 'computers', label: 'Computadoras', icon: '💻' },
  { id: 'phones', label: 'Celulares', icon: '📞' },
  { id: 'audio', label: 'Audio', icon: '🎧' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
  { id: 'accessories', label: 'Accesorios', icon: '⌨️' },
]

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Logitech', 'JBL']

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

  const activeFilterCount = selectedBrands.length + (selectedCategory !== 'all' ? 1 : 0)

  const FilterSidebar = () => (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Categorías
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
              {selectedCategory === category.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Rango de Precio
        </h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={500000}
            step={1000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-mono">
              ${priceRange[0].toLocaleString()}
            </span>
            <span className="text-slate-400">—</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-mono">
              ${priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Marcas
        </h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group"
            >
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => toggleBrand(brand)}
                className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                {brand}
              </span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          className="w-full border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen bg-white pt-20">
      {/* Hero Section - compact */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-2">
                Nuestros Productos
              </h1>
              <p className="text-slate-600 max-w-lg">
                Descubre la mejor tecnología con los mejores precios. Calidad garantizada en cada producto.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:gap-6">
              <div className="flex items-center gap-2 text-slate-600">
                <Truck className="w-4 h-4 text-primary" />
                <span className="text-sm">Envío gratis +$50,000</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm">Garantía incluida</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-sm">Mejores precios</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        {/* Search and Controls Bar */}
        <div className="bg-white rounded-2xl p-4 mb-8 shadow-sm border border-slate-100">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-primary/50 focus:ring-primary/20 rounded-xl"
              />
            </div>

            {/* Sort Dropdown */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-full lg:w-52 h-12 bg-slate-50 border-slate-200 text-slate-700 rounded-xl">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="featured">Destacados</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="rating">Mejor Valorados</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode Toggle */}
            <div className="flex rounded-xl overflow-hidden border border-slate-200 bg-slate-50">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-primary text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Grid3X3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all ${
                  viewMode === 'list'
                    ? 'bg-primary text-white'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>

            {/* Mobile Filter Button */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  className="lg:hidden h-12 border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 rounded-xl"
                >
                  <SlidersHorizontal className="w-5 h-5 mr-2" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <Badge className="ml-2 bg-primary text-white hover:bg-primary/90">
                      {activeFilterCount}
                    </Badge>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent
                side="left"
                className="w-80 bg-white border-slate-200 p-6"
              >
                <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" />
                  Filtros
                </h2>
                <FilterSidebar />
              </SheetContent>
            </Sheet>
          </div>

          {/* Active Filters Tags */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-slate-100">
              {selectedCategory !== 'all' && (
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
                  onClick={() => setSelectedCategory('all')}
                >
                  {categories.find((c) => c.id === selectedCategory)?.label}
                  <X className="w-3 h-3" />
                </Badge>
              )}
              {selectedBrands.map((brand) => (
                <Badge
                  key={brand}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 text-slate-700 border border-slate-200 hover:bg-slate-200 cursor-pointer"
                  onClick={() => toggleBrand(brand)}
                >
                  {brand}
                  <X className="w-3 h-3" />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-72 flex-shrink-0">
            <div className="bg-white rounded-2xl p-6 sticky top-28 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <SlidersHorizontal className="w-5 h-5 text-primary" />
                Filtros
              </h2>
              <FilterSidebar />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-slate-500">
                Mostrando{' '}
                <span className="font-semibold text-slate-900">
                  {data?.data.length || 0}
                </span>{' '}
                productos
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl overflow-hidden animate-pulse shadow-sm border border-slate-100"
                  >
                    <div className="aspect-square bg-slate-100" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-slate-100 rounded w-3/4" />
                      <div className="h-4 bg-slate-100 rounded w-1/2" />
                      <div className="h-6 bg-slate-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'space-y-4'
                }
              >
                {data?.data.map((product, index) => (
                  <ProductGridCard
                    key={product.id}
                    product={product}
                    viewMode={viewMode}
                    index={index}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="flex justify-center mt-12">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    disabled={!data.pagination.hasPrev}
                    className="border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </Button>
                  {[...Array(Math.min(5, data.pagination.totalPages))].map((_, i) => (
                    <Button
                      key={i}
                      variant={i === 0 ? 'default' : 'outline'}
                      className={
                        i === 0
                          ? 'bg-primary text-white hover:bg-primary/90'
                          : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                      }
                    >
                      {i + 1}
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    disabled={!data.pagination.hasNext}
                    className="border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 -rotate-90" />
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
