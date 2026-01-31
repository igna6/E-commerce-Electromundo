import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProduct, updateProduct } from '@/services/products.service'
import ProductForm from '@/sections/admin/ProductForm'

function EditProductComponent() {
  const { productId } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['products', productId],
    queryFn: () => getProduct(Number(productId)),
  })

  const mutation = useMutation({
    mutationFn: (formData: Parameters<typeof updateProduct>[1]) =>
      updateProduct(Number(productId), formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      navigate({ to: '/admin/products' })
    },
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando producto...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar producto: {error.message}
      </div>
    )
  }

  const product = data?.data

  if (!product) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-700">
        Producto no encontrado
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          to="/admin/products"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Volver a productos
        </Link>
        <h1 className="mt-2 text-2xl font-bold">Editar Producto</h1>
      </div>

      <div className="rounded-lg border bg-white p-6">
        <ProductForm
          initialData={product}
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
          error={mutation.error?.message}
        />
      </div>
    </div>
  )
}

export const Route = createFileRoute('/admin/products/$productId/edit')({
  component: EditProductComponent,
})
