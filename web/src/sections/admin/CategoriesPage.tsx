import { useMemo, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Category } from '@/types/category'
import {
  createCategory,
  deleteCategory,
  getCategories,
  updateCategory,
} from '@/services/categories.service'

/** Sort categories: parents first (alphabetical), then subcategories grouped under their parent */
function sortCategoriesHierarchically(categories: Array<Category>): Array<Category> {
  const parentCategories = categories
    .filter((c) => c.parentCategoryId === null)
    .sort((a, b) => a.name.localeCompare(b.name))

  const result: Array<Category> = []
  for (const parent of parentCategories) {
    result.push(parent)
    const children = categories
      .filter((c) => c.parentCategoryId === parent.id)
      .sort((a, b) => a.name.localeCompare(b.name))
    result.push(...children)
  }

  // Include orphan subcategories whose parent may have been deleted
  const includedIds = new Set(result.map((c) => c.id))
  const orphans = categories
    .filter((c) => !includedIds.has(c.id))
    .sort((a, b) => a.name.localeCompare(b.name))
  result.push(...orphans)

  return result
}

export default function CategoriesPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editName, setEditName] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editParentCategoryId, setEditParentCategoryId] = useState<number | null>(null)
  const [newName, setNewName] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newParentCategoryId, setNewParentCategoryId] = useState<number | null>(null)
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
      setNewParentCategoryId(null)
      setIsAdding(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data: payload,
    }: {
      id: number
      data: { name: string; description: string | null; parentCategoryId: number | null }
    }) => updateCategory(id, payload),
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

  const categories: Array<Category> = useMemo(() => data?.data ?? [], [data])

  const sortedCategories = useMemo(
    () => sortCategoriesHierarchically(categories),
    [categories]
  )

  /** Parent categories available for the dropdown (exclude the category being edited) */
  const parentOptions = useMemo(
    () => categories.filter((c) => c.parentCategoryId === null),
    [categories]
  )

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setEditName(category.name)
    setEditDescription(category.description || '')
    setEditParentCategoryId(category.parentCategoryId)
  }

  const handleSaveEdit = () => {
    if (editingId && editName.trim()) {
      updateMutation.mutate({
        id: editingId,
        data: {
          name: editName.trim(),
          description: editDescription.trim() || null,
          parentCategoryId: editParentCategoryId,
        },
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleCreate = () => {
    if (newName.trim()) {
      createMutation.mutate({
        name: newName.trim(),
        description: newDescription.trim() || null,
        parentCategoryId: newParentCategoryId,
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-lg">Loading categories...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-700">
        Error loading categories: {error.message}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Categories</h1>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            New Category
          </button>
        )}
      </div>

      {isAdding && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="mb-4 font-semibold">New Category</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Category name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                className="mt-1 w-full rounded-md border px-3 py-2"
                placeholder="Description (optional)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Parent Category
              </label>
              <select
                value={newParentCategoryId ?? ''}
                onChange={(e) =>
                  setNewParentCategoryId(e.target.value ? Number(e.target.value) : null)
                }
                className="mt-1 w-full rounded-md border px-3 py-2"
              >
                <option value="">None (top-level category)</option>
                {parentOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleCreate}
                disabled={!newName.trim() || createMutation.isPending}
                className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
              >
                {createMutation.isPending ? 'Creating...' : 'Create'}
              </button>
              <button
                onClick={() => {
                  setIsAdding(false)
                  setNewName('')
                  setNewDescription('')
                  setNewParentCategoryId(null)
                }}
                className="rounded-md border px-4 py-2 hover:bg-gray-50"
              >
                Cancel
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Parent</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedCategories.map((category) => (
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
                    <td className="px-4 py-3">
                      <select
                        value={editParentCategoryId ?? ''}
                        onChange={(e) =>
                          setEditParentCategoryId(
                            e.target.value ? Number(e.target.value) : null
                          )
                        }
                        className="w-full rounded-md border px-2 py-1"
                      >
                        <option value="">None</option>
                        {parentOptions
                          .filter((cat) => cat.id !== category.id)
                          .map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={handleSaveEdit}
                        disabled={updateMutation.isPending}
                        className="mr-2 text-green-600 hover:underline"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="text-gray-600 hover:underline"
                      >
                        Cancel
                      </button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-4 py-3">{category.id}</td>
                    <td className="px-4 py-3 font-medium">
                      {category.parentCategoryId !== null && (
                        <span className="mr-1 text-gray-400">&mdash;</span>
                      )}
                      {category.name}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {category.description || '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {category.parentCategoryId !== null
                        ? categories.find((c) => c.id === category.parentCategoryId)
                            ?.name ?? '-'
                        : '-'}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleEdit(category)}
                        className="mr-2 text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleteMutation.isPending}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                  </>
                )}
              </tr>
            ))}
            {categories.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                  No categories
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
