import { Link } from '@tanstack/react-router'
import { ShoppingCart, User, Menu, X, Zap } from 'lucide-react'
import { useState } from 'react'
import CartSidebar from '@/components/CartSidebar'

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const cartItemCount = 3

  return (
    <header className="fixed top-0 left-0 right-0 z-50">
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

      {/* Glass background */}
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-xl" />

      <nav className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link
            to="/"
            className="group flex items-center gap-2 transition-transform duration-300 hover:scale-[1.02]"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full group-hover:bg-cyan-500/30 transition-colors" />
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-glow-sm group-hover:shadow-glow transition-shadow">
                <Zap className="w-5 h-5 text-slate-900" />
              </div>
            </div>
            <span className="font-display text-xl font-bold text-white tracking-tight">
              Electro<span className="text-gradient">Mundo</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            <NavLink to="/" label="Inicio" />
            <NavLink to="/products" label="Productos" />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <CartSidebar>
              <button className="relative group p-2.5 rounded-xl glass glass-hover transition-all duration-300">
                <ShoppingCart className="w-5 h-5 text-slate-300 group-hover:text-cyan-400 transition-colors" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-glow-orange animate-pulse-glow">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </CartSidebar>

            {/* Auth buttons - Desktop */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                to="/login"
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Iniciar Sesión</span>
              </Link>

              <Link
                to="/register"
                className="group relative px-5 py-2.5 text-sm font-semibold rounded-xl overflow-hidden transition-all duration-300"
              >
                {/* Button background */}
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-cyan-400" />
                <span className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-emerald-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                {/* Glow effect */}
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-glow" />

                <span className="relative text-slate-900">Registrarse</span>
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-xl glass glass-hover transition-all duration-300"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-slate-300" />
              ) : (
                <Menu className="w-5 h-5 text-slate-300" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ease-out ${
            mobileMenuOpen ? 'max-h-80 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="py-4 space-y-2 border-t border-white/10">
            <MobileNavLink
              to="/"
              label="Inicio"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/products"
              label="Productos"
              onClick={() => setMobileMenuOpen(false)}
            />

            <div className="pt-4 space-y-2 border-t border-white/10 mt-4">
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 transition-all"
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Iniciar Sesión</span>
              </Link>

              <Link
                to="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-400 text-slate-900 font-semibold transition-all hover:shadow-glow"
              >
                <span>Crear Cuenta</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}

function NavLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="group relative px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
    >
      {label}
      {/* Hover underline */}
      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-cyan-400 group-hover:w-3/4 transition-all duration-300 rounded-full" />
    </Link>
  )
}

function MobileNavLink({
  to,
  label,
  onClick,
}: {
  to: string
  label: string
  onClick: () => void
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/50" />
      <span className="font-medium">{label}</span>
    </Link>
  )
}

export default Header
