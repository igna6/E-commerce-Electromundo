import { Link } from '@tanstack/react-router'
import logoImg from '../logo.png'

function Header() {
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
          <NavItem to="/" text="Home" />
          <NavItem to="/" text="Menu" />
          <NavItem to="/" text="Productos" />
        </ul>
      </nav>
      <div className="ml-auto flex items-center gap-4">
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
