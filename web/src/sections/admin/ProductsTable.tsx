import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product'

type ProductsTableProps = {
  products: Product[]
  onDelete: (id: number) => void
  isDeleting: boolean
  categoryMap?: Record<number, string>
}

export default function ProductsTable({
  products,
  onDelete,
  isDeleting,
  categoryMap = {},
}: ProductsTableProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(cents / 100)
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-gray-500">
        No se encontraron productos
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
          <th className="px-4 py-3">Producto</th>
          <th className="px-4 py-3">SKU</th>
          <th className="px-4 py-3">Precio</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Categoría</th>
          <th className="px-4 py-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y">
        {products.map((product) => (
          <tr key={product.id} className="hover:bg-gray-50">
            <td className="px-4 py-3">
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-gray-100 text-xs text-gray-400">
                    —
                  </div>
                )}
                <span className="text-sm font-medium">{product.name}</span>
              </div>
            </td>
            <td className="px-4 py-3">
              <span className="text-xs text-gray-500 font-mono">
                {product.sku || '—'}
              </span>
            </td>
            <td className="px-4 py-3 text-sm">{formatCurrency(product.price)}</td>
            <td className="px-4 py-3">
              {product.stock === 0 ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                  Agotado
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
                  {product.stock}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {product.category ? (categoryMap[product.category] || `#${product.category}`) : '—'}
            </td>
            <td className="px-4 py-3 text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  to="/admin/products/$productId/edit"
                  params={{ productId: String(product.id) }}
                  className="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50"
                >
                  Editar
                </Link>
                <button
                  onClick={() => onDelete(product.id)}
                  disabled={isDeleting}
                  className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
                >
                  Eliminar
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
