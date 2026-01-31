import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { createProduct } from '@/services/products.service'
import ProductForm from '@/sections/admin/ProductForm'

function NewProductComponent() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const mutation = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/admin/products' })
    },
  })

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/products"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a productos
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Nuevo Producto</h1>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <ProductForm
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          error={mutation.error?.message}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/products/new')({
  component: NewProductComponent,
})
