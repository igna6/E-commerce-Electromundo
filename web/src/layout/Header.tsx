import { Link } from '@tanstack/react-router'
import logoImg from '../logo.png'
import CartSidebar from '@/components/CartSidebar'

function Header() {
  // Demo cart count
  const cartItemCount = 3

  return (
    <header className="relative flex items-center justify-center h-20 px-6 bg-white shadow-md border-b border-gray-100">
      <div className="absolute left-6 top-1/2 -translate-y-1/2">
        <Link to="/">
          <img
            src={logoImg}
            alt="Logo"
            className="h-20 w-auto object-contain hover:opacity-80 transition-opacity"
          />
        </Link>
      </div>

      <nav className="hidden md:flex flex-1 justify-center items-center px-4">
        <ul className="flex items-center gap-10">
          <NavItem to="/" text="Inicio" />
          <NavItem to="/products" text="Productos" />
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-4">
        {/* Cart Icon */}
        <CartSidebar>
          <button className="relative p-2 text-gray-600 hover:text-brand-blue transition-colors">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartItemCount}
              </span>
            )}
          </button>
        </CartSidebar>

        <Link
          to="/login"
          className="text-sm font-semibold text-gray-600 hover:text-blue-600 transition-colors whitespace-nowrap"
        >
          Iniciar Sesión
        </Link>
        <Link
          to="/register"
          className="px-5 py-2 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-all shadow-sm hover:shadow-md active:scale-95 whitespace-nowrap"
        >
          Registrarse
        </Link>
      </div>
    </header>
  )
}
function NavItem({ to, text }: { to: string; text: string }) {
  return (
    <li>
      <Link
        to={to}
        className="text-gray-600 font-semibold text-sm uppercase tracking-wide hover:text-blue-600 transition-all duration-300 relative group"
      >
        {text}
        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
      </Link>
    </li>
  )
}
export default Header
