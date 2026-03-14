import { Link, useNavigate } from '@tanstack/react-router'
import { ChevronRight, Menu, Search, ShoppingCart, X, Zap } from 'lucide-react'
import { useRef, useState } from 'react'
import CartSidebar from '@/components/CartSidebar'
import { useCart } from '@/contexts/CartContext'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { totalItems } = useCart()
  const navigate = useNavigate()
  const searchInputRef = useRef<HTMLInputElement>(null)

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
              <span className="font-medium">Envío gratis</span> en compras mayores a $50,000
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

      {/* Mobile Navigation Drawer */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-out bg-white shadow-lg ${
          mobileMenuOpen ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <nav className="container mx-auto px-4 py-3 space-y-1">
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
        </nav>
      </div>
    </header>
  )
}

export default Header
