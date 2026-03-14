import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, Menu, Search, ShoppingCart, X, Zap } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import type {CategoryWithChildren} from '@/hooks/useCategories';
import CartSidebar from '@/components/CartSidebar'
import { useCart } from '@/contexts/CartContext'
import {  useCategoryTree } from '@/hooks/useCategories'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'


function useHoverPopover(closeDelay = 150) {
  const [open, setOpen] = useState(false)
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null)

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setOpen(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), closeDelay)
  }, [closeDelay])

  const close = useCallback(() => setOpen(false), [])

  return { open, setOpen, handleMouseEnter, handleMouseLeave, close }
}

function CategoryDropdown({ category }: { category: CategoryWithChildren }) {
  const { open, setOpen, handleMouseEnter, handleMouseLeave, close } = useHoverPopover()

  if (category.children.length === 0) {
    return (
      <Link
        to="/products"
        search={{ category: category.id }}
        className="flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-primary font-medium transition-colors whitespace-nowrap"
      >
        {category.name}
      </Link>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-primary font-medium transition-colors whitespace-nowrap">
            {category.name}
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        align="start"
        className="w-auto min-w-[200px] p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <Link
          to="/products"
          search={{ category: category.id }}
          onClick={close}
          className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-sm transition-colors font-medium"
        >
          Todo en {category.name}
        </Link>
        {category.children.map((child) => (
          <Link
            key={child.id}
            to="/products"
            search={{ category: child.id }}
            onClick={close}
            className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-sm transition-colors"
          >
            {child.name}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function MobileCategorySection({
  category,
  onClose,
}: {
  category: CategoryWithChildren
  onClose: () => void
}) {
  const [expanded, setExpanded] = useState(false)

  if (category.children.length === 0) {
    return (
      <Link
        to="/products"
        search={{ category: category.id }}
        onClick={onClose}
        className="flex items-center gap-3 px-4 py-2.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/5 transition-all text-sm"
      >
        {category.name}
      </Link>
    )
  }

  return (
    <div>
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 rounded-lg text-slate-600 hover:text-primary hover:bg-primary/5 transition-all text-sm"
      >
        <span>{category.name}</span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="pl-4 space-y-0.5">
          <Link
            to="/products"
            search={{ category: category.id }}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-all text-sm"
          >
            Todo en {category.name}
          </Link>
          {category.children.map((child) => (
            <Link
              key={child.id}
              to="/products"
              search={{ category: child.id }}
              onClick={onClose}
              className="flex items-center gap-3 px-4 py-2 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/5 transition-all text-sm"
            >
              {child.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

function VerTodasDropdown({ categories }: { categories: CategoryWithChildren[] }) {
  const { open, setOpen, handleMouseEnter, handleMouseLeave, close } = useHoverPopover()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 px-3 py-2 text-sm text-slate-700 hover:text-primary font-medium transition-colors whitespace-nowrap">
            Ver todas
            <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
          </button>
        </PopoverTrigger>
      </div>
      <PopoverContent
        align="end"
        className="w-auto min-w-[220px] max-h-[var(--radix-popover-content-available-height,400px)] overflow-y-auto p-1"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {categories.map((cat) => (
          <Link
            key={cat.id}
            to="/products"
            search={{ category: cat.id }}
            onClick={close}
            className="block px-3 py-2 text-sm text-slate-600 hover:text-primary hover:bg-primary/5 rounded-sm transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </PopoverContent>
    </Popover>
  )
}

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)
  const { data: categoryTree, isLoading: categoriesLoading } = useCategoryTree()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate({ to: '/products', search: { search: searchQuery.trim() } })
      setSearchQuery('')
      searchInputRef.current?.blur()
    }
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Top promotional bar */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center h-9 text-xs sm:text-sm">
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-medium">Envio gratis</span> en compras mayores a $50,000
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </span>
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="bg-primary shadow-md">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 h-16">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-white/90 hover:text-white transition-colors"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>

            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2 flex-shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-white/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="font-display text-xl font-bold text-white tracking-tight hidden sm:block">
                Electro<span className="text-amber-300">Mundo</span>
              </span>
            </Link>

            {/* Search bar - desktop */}
            <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar productos..."
                  className="w-full h-11 pl-4 pr-12 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 h-11 w-11 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-r-lg transition-colors"
                >
                  <Search className="w-5 h-5 text-white" />
                </button>
              </div>
            </form>

            {/* Right actions */}
            <div className="flex items-center gap-2 ml-auto">
              {/* Nav links - desktop */}
              <nav className="hidden lg:flex items-center gap-1 mr-2">
                <Link
                  to="/"
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Inicio
                </Link>
                <Link
                  to="/products"
                  className="px-3 py-2 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-lg hover:bg-white/10"
                >
                  Productos
                </Link>
              </nav>

              {/* Cart */}
              <CartSidebar>
                <button className="relative p-2.5 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all">
                  <ShoppingCart className="w-5 h-5" />
                  {totalItems > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
              </CartSidebar>
            </div>
          </div>

          {/* Search bar - mobile */}
          <form onSubmit={handleSearch} className="md:hidden pb-3">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos..."
                className="w-full h-10 pl-4 pr-11 rounded-lg bg-white text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-white/30"
              />
              <button
                type="submit"
                className="absolute right-0 top-0 h-10 w-10 flex items-center justify-center bg-amber-500 hover:bg-amber-600 rounded-r-lg transition-colors"
              >
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Category navigation bar - desktop */}
      {!categoriesLoading && categoryTree && categoryTree.length > 0 && (
        <div className="hidden lg:block bg-white border-b border-slate-200">
          <div className="container mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-0.5 h-10">
              {categoryTree.slice(0, 8).map((category) => (
                <CategoryDropdown key={category.id} category={category} />
              ))}
              {categoryTree.length > 8 && (
                <VerTodasDropdown categories={categoryTree.slice(8)} />
              )}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white shadow-lg ${
          mobileMenuOpen ? 'max-h-[80vh] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container mx-auto px-4 py-3 space-y-1 overflow-y-auto max-h-[70vh]">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:text-primary hover:bg-primary/5 transition-all font-medium"
          >
            Inicio
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-4 py-3 rounded-lg text-slate-700 hover:text-primary hover:bg-primary/5 transition-all font-medium"
          >
            Productos
          </Link>

          {/* Mobile categories */}
          {!categoriesLoading && categoryTree && categoryTree.length > 0 && (
            <>
              <div className="border-t border-slate-100 my-2" />
              <p className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Categorias
              </p>
              {categoryTree.map((category) => (
                <MobileCategorySection
                  key={category.id}
                  category={category}
                  onClose={() => setMobileMenuOpen(false)}
                />
              ))}
            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
