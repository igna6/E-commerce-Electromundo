import { Link } from '@tanstack/react-router'
import type { Product } from '@/types/product'
import { formatPrice } from '@/utils/formatPrice'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type ProductsTableProps = {
  products: Array<Product>
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
  if (products.length === 0) {
    return (
      <div className="px-4 py-12 text-center text-sm text-muted-foreground">
        No se encontraron productos
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead className="px-4">Producto</TableHead>
          <TableHead className="px-4">SKU</TableHead>
          <TableHead className="px-4">Precio</TableHead>
          <TableHead className="px-4">Stock</TableHead>
          <TableHead className="px-4">Categoría</TableHead>
          <TableHead className="px-4 text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell className="px-4">
              <div className="flex items-center gap-3">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-10 w-10 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-muted text-xs text-muted-foreground">
                    —
                  </div>
                )}
                <span className="text-sm font-medium">{product.name}</span>
              </div>
            </TableCell>
            <TableCell className="px-4">
              <span className="text-xs text-muted-foreground font-mono">
                {product.sku || '—'}
              </span>
            </TableCell>
            <TableCell className="px-4 text-sm">{formatPrice(product.price)}</TableCell>
            <TableCell className="px-4">
              {product.stock === 0 ? (
                <Badge variant="destructive" className="bg-red-100 text-red-700 hover:bg-red-100 border-transparent">
                  Agotado
                </Badge>
              ) : product.stock <= 5 ? (
                <Badge variant="outline" className="bg-amber-100 text-amber-700 hover:bg-amber-100 border-transparent">
                  {product.stock}
                </Badge>
              ) : (
                <span className="text-sm text-green-600 font-medium">
                  {product.stock}
                </span>
              )}
            </TableCell>
            <TableCell className="px-4 text-sm text-muted-foreground">
              {product.category ? (categoryMap[product.category] || `#${product.category}`) : '—'}
            </TableCell>
            <TableCell className="px-4 text-right">
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
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
