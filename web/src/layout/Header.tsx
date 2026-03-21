import { Link, useNavigate } from '@tanstack/react-router'
import {
  ChevronDown,
  Heart,
  MapPin,
  Menu,
  Phone,
  Search,
  ShoppingCart,
  X,
  Zap,
} from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import type { CategoryWithChildren } from '@/hooks/useCategories'
import CartSidebar from '@/components/CartSidebar'
import { useCart } from '@/contexts/CartContext'
import { useCategoryTree } from '@/hooks/useCategories'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

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
  const { open, setOpen, handleMouseEnter, handleMouseLeave, close } =
    useHoverPopover()

  if (category.children.length === 0) {
    return (
      <Link
        to="/products"
        search={{ category: category.id }}
        className="flex items-center gap-1 flex-shrink-0 text-white/90 hover:text-white hover:bg-white/15 px-4 py-2.5 text-sm transition-colors whitespace-nowrap"
      >
        {category.name}
      </Link>
    )
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 flex-shrink-0 text-white/90 hover:text-white hover:bg-white/15 px-4 py-2.5 text-sm transition-colors whitespace-nowrap">
            {category.name}
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
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

function VerTodasDropdown({
  categories,
}: {
  categories: CategoryWithChildren[]
}) {
  const { open, setOpen, handleMouseEnter, handleMouseLeave, close } =
    useHoverPopover()

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <PopoverTrigger asChild>
          <button className="flex items-center gap-1 flex-shrink-0 text-amber-500 hover:text-amber-400 px-4 py-2.5 text-sm transition-colors font-semibold whitespace-nowrap">
            Más categorías{' '}
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            />
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
      {/* Top announcement bar */}
      <div className="bg-[#0097a7] text-white text-xs py-1.5 px-4 flex items-center justify-between">
        <span className="hidden sm:flex items-center gap-1">
          <Phone size={11} />
          Ventas: 0800-333-4567
        </span>
        <p className="text-center flex-1 font-medium tracking-wide flex items-center justify-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-amber-300" />
          <span>
            Envío gratis en compras mayores a $50.000 · 12 cuotas sin interés
            con todas las tarjetas
          </span>
        </p>
        <span className="hidden sm:flex items-center gap-1">
          <MapPin size={11} />
          Sucursales
        </span>
      </div>

      {/* Main header */}
      <div className="bg-primary px-4 py-3">
        <div className="container mx-auto flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div>
              <span className="text-2xl font-black tracking-tight leading-none text-white">
                Electro
              </span>
              <span className="text-2xl font-black tracking-tight leading-none text-amber-300">
                Mundo
              </span>
            </div>
          </Link>

          {/* Search bar */}
          <form
            onSubmit={handleSearch}
            className="flex-1 max-w-2xl mx-auto hidden md:block"
          >
            <div className="flex bg-white rounded-lg overflow-hidden shadow-md">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar productos, marcas y más..."
                className="flex-1 px-4 py-2.5 text-sm outline-none text-slate-700 placeholder-slate-400"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 px-5 py-2.5 flex items-center justify-center transition-colors"
              >
                <Search size={18} className="text-white" />
              </button>
            </div>
          </form>

          {/* Right icons */}
          <div className="flex items-center gap-1 text-white ml-auto">
            <button className="hidden sm:flex flex-col items-center px-3 py-1 hover:bg-white/10 rounded-lg transition-colors">
              <Heart size={20} />
              <span className="text-xs mt-0.5">Favoritos</span>
            </button>
            <CartSidebar>
              <button className="flex flex-col items-center px-3 py-1 hover:bg-white/10 rounded-lg transition-colors relative">
                <ShoppingCart size={20} />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 right-0.5 bg-amber-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
                <span className="text-xs mt-0.5">Carrito</span>
              </button>
            </CartSidebar>
            <button
              className="sm:hidden p-2"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile search */}
      <div className="md:hidden bg-primary px-4 pb-3">
        <form onSubmit={handleSearch}>
          <div className="flex bg-white rounded-lg overflow-hidden">
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar productos..."
              className="flex-1 text-sm outline-none bg-transparent"
            />
            <button type="submit" className="bg-amber-500 px-4">
              <Search size={16} className="text-white" />
            </button>
          </div>
        </form>
      </div>

      {/* Category nav - desktop */}
      {!categoriesLoading && categoryTree && categoryTree.length > 0 && (
        <div className="hidden sm:block bg-[#007c8a]">
          <div className="container mx-auto px-4 sm:px-6">
            <nav className="flex items-center overflow-x-auto scrollbar-hide">
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

      {/* Mobile menu */}
      <div
        className={`sm:hidden overflow-hidden transition-all duration-300 ease-out bg-white shadow-lg ${
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
