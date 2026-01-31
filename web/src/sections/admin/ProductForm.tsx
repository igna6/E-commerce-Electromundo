import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/categories.service'
import type { Product } from '@/types/product'

type ProductFormData = {
  name: string
  price: number
  description?: string | null
  image?: string | null
  category?: number | null
}

type ProductFormProps = {
  initialData?: Product
  onSubmit: (data: ProductFormData) => void
  isLoading?: boolean
  error?: string
}

export default function ProductForm({
  initialData,
  onSubmit,
  isLoading = false,
  error,
}: ProductFormProps) {
  const [name, setName] = useState(initialData?.name || '')
  const [price, setPrice] = useState(initialData ? String(initialData.price / 100) : '')
  const [description, setDescription] = useState(initialData?.description || '')
  const [image, setImage] = useState(initialData?.image || '')
  const [category, setCategory] = useState<string>(
    initialData?.category ? String(initialData.category) : ''
  )

  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const priceInCents = Math.round(parseFloat(price) * 100)

    onSubmit({
      name,
      price: priceInCents,
      description: description || null,
      image: image || null,
      category: category ? parseInt(category) : null,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Nombre *
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="Nombre del producto"
        />
      </div>

      <div>
        <label htmlFor="price" className="block text-sm font-medium text-gray-700">
          Precio (ARS) *
        </label>
        <input
          type="number"
          id="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="0.00"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Descripción
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="Descripción del producto"
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-medium text-gray-700">
          URL de Imagen
        </label>
        <input
          type="url"
          id="image"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {image && (
          <div className="mt-2">
            <img
              src={image}
              alt="Preview"
              className="h-32 w-32 rounded object-cover"
              onError={(e) => {
                ;(e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
      </div>

      <div>
        <label htmlFor="category" className="block text-sm font-medium text-gray-700">
          Categoría
        </label>
        <select
          id="category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="mt-1 block w-full rounded-md border px-3 py-2"
        >
          <option value="">Sin categoría</option>
          {categoriesData?.data.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isLoading || !name || !price}
          className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  )
}
