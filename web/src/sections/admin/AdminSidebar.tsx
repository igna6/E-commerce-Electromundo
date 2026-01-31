import { Link, useLocation } from '@tanstack/react-router'

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/admin/orders', label: 'Pedidos', icon: '📦' },
  { to: '/admin/products', label: 'Productos', icon: '🏷️' },
  { to: '/admin/categories', label: 'Categorías', icon: '📁' },
]

export default function AdminSidebar() {
  const location = useLocation()

  const isActive = (to: string) => {
    return location.pathname === to || location.pathname.startsWith(to + '/')
  }

  return (
    <aside className="w-64 border-r bg-white">
      <div className="border-b p-6">
        <Link to="/" className="text-xl font-bold text-blue-600">
          ElectroMundo
        </Link>
        <p className="mt-1 text-sm text-gray-500">Administración</p>
      </div>

      <nav className="p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                className={`flex items-center gap-3 rounded-md px-4 py-2 transition-colors ${
                  isActive(item.to)
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="border-t p-4">
        <Link
          to="/"
          className="flex items-center gap-3 rounded-md px-4 py-2 text-gray-600 hover:bg-gray-50"
        >
          <span>🏠</span>
          <span>Ver Tienda</span>
        </Link>
      </div>
    </aside>
  )
}
