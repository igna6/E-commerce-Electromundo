import { useDeferredValue, useEffect, useMemo, useState } from 'react'
import {
  ChevronDown,
  Grid3X3,
  List,
  Search,
  Shield,
  SlidersHorizontal,
  Tag,
  X,
} from 'lucide-react'
import { useNavigate } from '@tanstack/react-router'
import ProductGridCard from './components/ProductGridCard'
import FilterSidebar from './components/FilterSidebar'
import type { GetProductsParams } from '@/services/products.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useProducts } from '@/hooks/useProducts'
import { useCategories } from '@/hooks/useCategories'
import { Route } from '@/routes/products.index'

const SORT_MAP: Record<string, GetProductsParams['sortBy'] | undefined> = {
  'price-low': 'price-asc',
  'price-high': 'price-desc',
  newest: 'newest',
}

const SORT_LABELS: Record<string, string> = {
  'price-low': 'Precio: Menor a Mayor',
  'price-high': 'Precio: Mayor a Menor',
  newest: 'Mas Recientes',
}

const DEFAULT_SORT = 'newest'

const DEFAULT_PRICE_MIN = 0
const DEFAULT_PRICE_MAX = 500000

function ProductsPage() {
  const navigate = useNavigate()
  const {
    search: searchFromRoute,
    category: categoryFromRoute,
    minPrice: minPriceFromRoute,
    maxPrice: maxPriceFromRoute,
    sortBy: sortByFromRoute,
    inStock: inStockFromRoute,
    featured: featuredFromRoute,
  } = Route.useSearch()

  const [searchQuery, setSearchQuery] = useState(searchFromRoute ?? '')
  const deferredSearch = useDeferredValue(searchQuery)

  // Initialize state from URL params
  const [sortBy, setSortBy] = useState(() => {
    if (!sortByFromRoute) return DEFAULT_SORT
    const entry = Object.entries(SORT_MAP).find(
      ([, v]) => v === sortByFromRoute,
    )
    return entry ? entry[0] : DEFAULT_SORT
  })
  const [priceRange, setPriceRange] = useState([
    minPriceFromRoute ?? DEFAULT_PRICE_MIN,
    maxPriceFromRoute ?? DEFAULT_PRICE_MAX,
  ])
  const [inStock, setInStock] = useState(inStockFromRoute ?? false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (searchFromRoute !== undefined) {
      setSearchQuery(searchFromRoute)
      setPage(1)
    }
  }, [searchFromRoute])

  useEffect(() => {
    setPage(1)
  }, [categoryFromRoute])

  useEffect(() => {
    setPage(1)
  }, [featuredFromRoute])

  // Sync filter state to URL search params
  useEffect(() => {
    const mappedSort = SORT_MAP[sortBy]
    const minP = priceRange[0] !== DEFAULT_PRICE_MIN ? priceRange[0] : undefined
    const maxP = priceRange[1] !== DEFAULT_PRICE_MAX ? priceRange[1] : undefined

    void navigate({
      to: '/products',
      search: (prev) => ({
        ...prev,
        sortBy: mappedSort,
        minPrice: minP,
        maxPrice: maxP,
        inStock: inStock || undefined,
      }),
      replace: true,
    })
  }, [sortBy, priceRange, inStock, navigate])

  // Map UI sort value to API param
  const mappedSortBy = SORT_MAP[sortBy]

  // Only send price params when they differ from defaults
  const apiMinPrice =
    priceRange[0] !== DEFAULT_PRICE_MIN ? priceRange[0] * 100 : undefined
  const apiMaxPrice =
    priceRange[1] !== DEFAULT_PRICE_MAX ? priceRange[1] * 100 : undefined

  const { data: categoriesData } = useCategories()

  const categoryMap = useMemo(() => {
    if (!categoriesData) return new Map<number, string>()
    return new Map(categoriesData.map((c) => [c.id, c.name]))
  }, [categoriesData])

  const categoryName =
    categoryFromRoute !== undefined
      ? categoryMap.get(categoryFromRoute)
      : undefined

  const { data, isLoading } = useProducts({
    page,
    limit: 24,
    search: deferredSearch || undefined,
    category: categoryFromRoute,
    minPrice: apiMinPrice,
    maxPrice: apiMaxPrice,
    sortBy: mappedSortBy,
    inStock: inStock || undefined,
    featured: featuredFromRoute,
  })

  const handleSortChange = (value: string) => {
    setSortBy(value)
    setPage(1)
  }

  const handlePriceRangeChange = (range: Array<number>) => {
    setPriceRange(range)
    setPage(1)
  }

  const handleInStockChange = (checked: boolean) => {
    setInStock(checked)
    setPage(1)
  }

  const handleCategoryChange = (categoryId: number | undefined) => {
    void navigate({
      to: '/products',
      search: (prev) => ({
        ...prev,
        category: categoryId,
      }),
    })
    setPage(1)
  }

  const clearSearch = () => {
    setSearchQuery('')
    setPage(1)
    void navigate({
      to: '/products',
      search: (prev) => ({
        ...prev,
        search: undefined,
      }),
    })
  }

  const clearCategory = () => {
    handleCategoryChange(undefined)
  }

  const clearPriceRange = () => {
    setPriceRange([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX])
    setPage(1)
  }

  const clearInStock = () => {
    setInStock(false)
    setPage(1)
  }

  const clearSort = () => {
    setSortBy(DEFAULT_SORT)
    setPage(1)
  }

  const clearFeatured = () => {
    setPage(1)
    void navigate({
      to: '/products',
      search: (prev) => ({ ...prev, featured: undefined }),
    })
  }

  const hasPriceFilter =
    priceRange[0] !== DEFAULT_PRICE_MIN || priceRange[1] !== DEFAULT_PRICE_MAX
  const hasAnyFilter =
    !!deferredSearch ||
    categoryFromRoute !== undefined ||
    hasPriceFilter ||
    inStock ||
    sortBy !== DEFAULT_SORT ||
    !!featuredFromRoute

  const clearFilters = () => {
    setSearchQuery('')
    setPriceRange([DEFAULT_PRICE_MIN, DEFAULT_PRICE_MAX])
    setSortBy(DEFAULT_SORT)
    setInStock(false)
    setPage(1)
    void navigate({
      to: '/products',
      search: {},
    })
  }

  const filterSidebarProps = {
    priceRange,
    onPriceRangeChange: handlePriceRangeChange,
    onClearFilters: clearFilters,
    inStock,
    onInStockChange: handleInStockChange,
    selectedCategoryId: categoryFromRoute,
    onCategoryChange: handleCategoryChange,
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section - compact */}
      <section className="bg-white border-b border-slate-100">
        <div className="container mx-auto px-6 py-8 lg:py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 leading-tight mb-2">
                Nuestros Productos
              </h1>
              <p className="text-slate-600 max-w-lg">
                Descubre la mejor tecnología con los mejores precios. Calidad
                garantizada en cada producto.
              </p>
            </div>

            <div className="flex flex-wrap gap-4 lg:gap-6">
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
            <Select value={sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full lg:w-52 h-12 bg-slate-50 border-slate-200 text-slate-700 rounded-xl">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent className="bg-white border-slate-200">
                <SelectItem value="newest">Más Recientes</SelectItem>
                <SelectItem value="price-low">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-high">
                  Precio: Mayor a Menor
                </SelectItem>
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
                <FilterSidebar {...filterSidebarProps} />
              </SheetContent>
            </Sheet>
          </div>
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
              <FilterSidebar {...filterSidebarProps} />
            </div>
          </aside>

          {/* Products Grid */}
          <main className="flex-1 min-w-0">
            {/* Results Summary */}
            <div className="mb-6 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-slate-500">
                  {data ? (
                    data.pagination.total === 0 ? (
                      'No se encontraron productos'
                    ) : (
                      <>
                        <span className="font-semibold text-slate-900">
                          {data.pagination.total}
                        </span>{' '}
                        {data.pagination.total === 1
                          ? 'producto encontrado'
                          : 'productos encontrados'}
                      </>
                    )
                  ) : null}
                </p>
                {data?.pagination.total === 0 && hasAnyFilter && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                  >
                    Limpiar filtros
                  </button>
                )}
              </div>

              {/* Active Filter Tags */}
              {hasAnyFilter && (
                <div className="flex flex-wrap items-center gap-2">
                  {deferredSearch && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm border border-slate-200">
                      <Search className="w-3 h-3 text-slate-400" />
                      &ldquo;{deferredSearch}&rdquo;
                      <button
                        onClick={clearSearch}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                        aria-label="Quitar busqueda"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </span>
                  )}
                  {categoryFromRoute !== undefined && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm border border-primary/20">
                      {categoryName ?? `Categoria #${categoryFromRoute}`}
                      <button
                        onClick={clearCategory}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-primary/20 transition-colors"
                        aria-label="Quitar categoria"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {hasPriceFilter && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm border border-slate-200">
                      ${priceRange[0].toLocaleString()} &mdash; $
                      {priceRange[1].toLocaleString()}
                      <button
                        onClick={clearPriceRange}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                        aria-label="Quitar filtro de precio"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </span>
                  )}
                  {inStock && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-sm border border-emerald-200">
                      En stock
                      <button
                        onClick={clearInStock}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-emerald-100 transition-colors"
                        aria-label="Quitar filtro de stock"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {sortBy !== DEFAULT_SORT && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-sm border border-slate-200">
                      {SORT_LABELS[sortBy] ?? sortBy}
                      <button
                        onClick={clearSort}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-slate-200 transition-colors"
                        aria-label="Quitar orden"
                      >
                        <X className="w-3 h-3 text-slate-500" />
                      </button>
                    </span>
                  )}
                  {featuredFromRoute && (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-700 text-sm border border-amber-200">
                      Destacados
                      <button
                        onClick={clearFeatured}
                        className="ml-0.5 p-0.5 rounded-full hover:bg-amber-100 transition-colors"
                        aria-label="Quitar filtro destacados"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}
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
                    categoryName={
                      product.category
                        ? categoryMap.get(product.category)
                        : undefined
                    }
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
                    onClick={() => setPage((p) => p - 1)}
                    className="border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900 disabled:opacity-30"
                  >
                    <ChevronDown className="w-4 h-4 rotate-90" />
                  </Button>
                  {[...Array(Math.min(5, data.pagination.totalPages))].map(
                    (_, i) => {
                      const pageNum = i + 1
                      return (
                        <Button
                          key={i}
                          variant={pageNum === page ? 'default' : 'outline'}
                          onClick={() => setPage(pageNum)}
                          className={
                            pageNum === page
                              ? 'bg-primary text-white hover:bg-primary/90'
                              : 'border-slate-200 text-slate-500 hover:bg-slate-100 hover:text-slate-900'
                          }
                        >
                          {pageNum}
                        </Button>
                      )
                    },
                  )}
                  <Button
                    variant="outline"
                    disabled={!data.pagination.hasNext}
                    onClick={() => setPage((p) => p + 1)}
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
