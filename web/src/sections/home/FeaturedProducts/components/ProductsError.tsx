import { Button } from '@/components/ui/button'

interface ProductsErrorProps {
  error: string
  onRetry: () => void
}

function ProductsError({ error, onRetry }: ProductsErrorProps) {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold text-brand-dark mb-4">
          Nuestros Productos
        </h2>
        <p className="text-red-500">{error}</p>
        <Button
          onClick={onRetry}
          className="mt-4 bg-brand-blue hover:bg-blue-700"
        >
          Reintentar
        </Button>
      </div>
    </section>
  )
}

export default ProductsError
