import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '@/services/categories.service'

type Category = {
  id: number
  name: string
  description: string | null
  createdAt: string
}

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setNewName('')
      setNewDescription('')
      setIsAdding(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: { name: string; description: string | null } }) =>
      updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      setEditingId(null)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
  })

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditDescription(category.description || '')
  }

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateMutation.mutate({
        id: editingId,
        data: { name: editName.trim(), description: editDescription.trim() || null },
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta categoría?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreate = () => {
    if (newName.trim()) {
      createMutation.mutate({
        name: newName.trim(),
        description: newDescription.trim() || null,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Cargando categorías...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error al cargar categorías: {error.message}
      </div>
    )
  }

  const categories = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categorías</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Nueva Categoría
          </button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-4 font-semibold">Nueva Categoría</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Nombre
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Nombre de la categoría"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Descripción
              </label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Descripción (opcional)"
                rows={2}
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || createMutation.isPending}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creando...' : 'Crear'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewName('')
                  setNewDescription('')
                }}
                className="rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-lg border bg-white">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50 text-left text-sm text-gray-500">
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Nombre</th>
              <th className="px-4 py-3">Descripción</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category: Category) => (
              <tr key={category.id} className="border-b">
                {editingId === category.id ? (
                  <>
                    <td className="px-4 py-3">{category.id}</td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full rounded-md border px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        className="w-full rounded-md border px-2 py-1"
                      />
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateMutation.isPending}
                        className="mr-2 text-green-600 hover:underline"
                      >
                        Guardar
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancelar
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{category.id}</td>
                    <td className="px-4 py-3 font-medium">{category.name}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {category.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(category)}
                        className="mr-2 text-blue-600 hover:underline"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:underline"
                      >
                        Eliminar
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-gray-500">
                  No hay categorías
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
