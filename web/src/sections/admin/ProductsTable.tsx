import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product'

type ProductsTableProps = {
  products: Product[]
  onDelete: (id: number) => void
  isDeleting: boolean
}

export default function ProductsTable({
  products,
  onDelete,
  isDeleting,
}: ProductsTableProps) {
  const formatCurrency = (cents: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(cents / 100)
  }

  if (products.length === 0) {
    return (
      <div className="px-4 py-8 text-center text-gray-500">
        No hay productos para mostrar
      </div>
    )
  }

  return (
    <table className="w-full">
      <thead>
        <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
          <th className="px-4 py-3">ID</th>
          <th className="px-4 py-3">Imagen</th>
          <th className="px-4 py-3">Nombre</th>
          <th className="px-4 py-3">Precio</th>
          <th className="px-4 py-3">Stock</th>
          <th className="px-4 py-3">Categoría</th>
          <th className="px-4 py-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.id} className="border-b">
            <td className="px-4 py-3">{product.id}</td>
            <td className="px-4 py-3">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="h-12 w-12 rounded object-cover"
                />
              ) : (
                <div className="flex h-12 w-12 items-center justify-center rounded bg-gray-100 text-gray-400">
                  Sin imagen
                </div>
              )}
            </td>
            <td className="px-4 py-3 font-medium">{product.name}</td>
            <td className="px-4 py-3">{formatCurrency(product.price)}</td>
            <td className="px-4 py-3">
              {product.stock === 0 ? (
                <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
                  Agotado
                </span>
              ) : product.stock <= 5 ? (
                <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  {product.stock}
                </span>
              ) : (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock}
                </span>
              )}
            </td>
            <td className="px-4 py-3 text-sm text-gray-500">
              {product.category || '-'}
            </td>
            <td className="px-4 py-3 text-right">
              <Link
                to="/admin/products/$productId/edit"
                params={{ productId: String(product.id) }}
                className="mr-2 text-blue-600 hover:underline"
              >
                Editar
              </Link>
              <button
                onClick={() => onDelete(product.id)}
                disabled={isDeleting}
                className="text-red-600 hover:underline disabled:opacity-50"
              >
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
