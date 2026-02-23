import { Button } from '@/components/ui/button'
import type { Pagination } from '@/types/api'

interface ProductsPaginationProps {
  pagination: Pagination
  onPageChange: (page: number) => void
}

function ProductsPagination({
  pagination,
  onPageChange,
}: ProductsPaginationProps) {
  if (pagination.totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-12 flex justify-center items-center gap-4">
      <Button
        onClick={() => onPageChange(Math.max(1, pagination.page - 1))}
        disabled={!pagination.hasPrev}
        variant="outline"
        className="font-medium"
      >
        Anterior
      </Button>

      <span className="text-gray-600">
        Página {pagination.page} de {pagination.totalPages}
      </span>

      <Button
        onClick={() => onPageChange(pagination.page + 1)}
        disabled={!pagination.hasNext}
        variant="outline"
        className="font-medium"
      >
        Siguiente
      </Button>
    </div>
  )
}

export default ProductsPagination
