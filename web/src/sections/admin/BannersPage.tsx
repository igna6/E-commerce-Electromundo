import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Banner } from '@/types/banner'
import AdminLoadingState from '@/components/admin/AdminLoadingState'
import AdminErrorState from '@/components/admin/AdminErrorState'
import {
  createBanner,
  deleteBanner,
  getAllBanners,
  updateBanner,
} from '@/services/banners.service'

type BannerFormData = {
  title: string
  subtitle: string
  buttonText: string
  buttonLink: string
  image: string
  displayOrder: number
  isActive: boolean
}

const emptyForm: BannerFormData = {
  title: '',
  subtitle: '',
  buttonText: '',
  buttonLink: '',
  image: '',
  displayOrder: 0,
  isActive: true,
}

export default function BannersPage() {
  const queryClient = useQueryClient()
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<BannerFormData>(emptyForm)
  const [isAdding, setIsAdding] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-banners'],
    queryFn: getAllBanners,
  })

  const createMutation = useMutation({
    mutationFn: createBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      setForm(emptyForm)
      setIsAdding(false)
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data: payload,
    }: {
      id: number
      data: Partial<Banner>
    }) => updateBanner(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['banners'] })
      setEditingId(null)
      setForm(emptyForm)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteBanner,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-banners'] })
      queryClient.invalidateQueries({ queryKey: ['banners'] })
    },
  })

  const handleEdit = (banner: Banner) => {
    setEditingId(banner.id)
    setForm({
      title: banner.title,
      subtitle: banner.subtitle || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      image: banner.image || '',
      displayOrder: banner.displayOrder,
      isActive: banner.isActive,
    })
  }

  const handleSaveEdit = () => {
    if (editingId && form.title.trim()) {
      updateMutation.mutate({
        id: editingId,
        data: {
          title: form.title.trim(),
          subtitle: form.subtitle.trim() || null,
          buttonText: form.buttonText.trim() || null,
          buttonLink: form.buttonLink.trim() || null,
          image: form.image.trim() || null,
          displayOrder: form.displayOrder,
          isActive: form.isActive,
        },
      })
    }
  }

  const handleCreate = () => {
    if (form.title.trim()) {
      createMutation.mutate({
        title: form.title.trim(),
        subtitle: form.subtitle.trim() || null,
        buttonText: form.buttonText.trim() || null,
        buttonLink: form.buttonLink.trim() || null,
        image: form.image.trim() || null,
        displayOrder: form.displayOrder,
        isActive: form.isActive,
      })
    }
  }

  const handleDelete = (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este banner?')) {
      deleteMutation.mutate(id)
    }
  }

  const handleToggleActive = (banner: Banner) => {
    updateMutation.mutate({
      id: banner.id,
      data: { isActive: !banner.isActive },
    })
  }

  if (isLoading) {
    return <AdminLoadingState message="Cargando banners..." />
  }

  if (error) {
    return <AdminErrorState error={error} />
  }

  const banners = data?.data ?? []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners del Carrusel</h1>
          <p className="text-sm text-gray-500 mt-1">
            Administra los banners que se muestran en la página principal.
          </p>
        </div>
        {!isAdding && !editingId && (
          <button
            onClick={() => {
              setIsAdding(true)
              setForm(emptyForm)
            }}
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Nuevo Banner
          </button>
        )}
      </div>

      {/* Create / Edit form */}
      {(isAdding || editingId) && (
        <div className="rounded-lg border bg-white p-6">
          <h3 className="mb-4 font-semibold text-lg">
            {editingId ? 'Editar Banner' : 'Nuevo Banner'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Título *
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Título del banner"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Subtítulo
              </label>
              <textarea
                value={form.subtitle}
                onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Texto secundario (opcional)"
                rows={2}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Texto del botón
              </label>
              <input
                type="text"
                value={form.buttonText}
                onChange={(e) =>
                  setForm({ ...form, buttonText: e.target.value })
                }
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ej: Ver productos"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Link del botón
              </label>
              <input
                type="text"
                value={form.buttonLink}
                onChange={(e) =>
                  setForm({ ...form, buttonLink: e.target.value })
                }
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ej: /products"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                URL de imagen
              </label>
              <input
                type="text"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                className="w-full rounded-md border px-3 py-2"
                placeholder="https://... (opcional, se usa fondo de color si está vacío)"
              />
              {form.image && (
                <div className="mt-2 rounded-lg overflow-hidden border bg-gray-50">
                  <img
                    src={form.image}
                    alt="Preview"
                    className="w-full h-40 object-cover"
                    onError={(e) => {
                      ;(e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Orden
              </label>
              <input
                type="number"
                value={form.displayOrder}
                onChange={(e) =>
                  setForm({
                    ...form,
                    displayOrder: parseInt(e.target.value) || 0,
                  })
                }
                className="w-full rounded-md border px-3 py-2"
                min={0}
              />
              <p className="text-xs text-gray-400 mt-1">
                Menor = aparece primero
              </p>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium text-gray-700">
                  Activo
                </span>
              </label>
            </div>
          </div>

          <div className="flex gap-2 mt-6">
            <button
              onClick={editingId ? handleSaveEdit : handleCreate}
              disabled={
                !form.title.trim() ||
                createMutation.isPending ||
                updateMutation.isPending
              }
              className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Guardando...'
                : editingId
                  ? 'Guardar cambios'
                  : 'Crear Banner'}
            </button>
            <button
              onClick={() => {
                setIsAdding(false)
                setEditingId(null)
                setForm(emptyForm)
              }}
              className="rounded-md border px-4 py-2 hover:bg-gray-50"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* Banners list */}
      <div className="space-y-3">
        {banners.map((banner: Banner) => (
          <div
            key={banner.id}
            className={`rounded-lg border bg-white p-4 flex flex-col sm:flex-row gap-4 ${
              !banner.isActive ? 'opacity-60' : ''
            }`}
          >
            {/* Preview */}
            <div className="w-full sm:w-48 h-28 flex-shrink-0 rounded-lg overflow-hidden bg-gradient-to-br from-primary to-teal-700">
              {banner.image ? (
                <img
                  src={banner.image}
                  alt={banner.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/60 text-xs">
                  Sin imagen
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-gray-900 truncate">
                    {banner.title}
                  </h3>
                  {banner.subtitle && (
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">
                      {banner.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                      banner.isActive
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {banner.isActive ? 'Activo' : 'Inactivo'}
                  </span>
                  <span className="text-xs text-gray-400">
                    Orden: {banner.displayOrder}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 mt-3 text-sm">
                {banner.buttonText && (
                  <span className="text-gray-500">
                    Botón: &quot;{banner.buttonText}&quot; → {banner.buttonLink}
                  </span>
                )}
              </div>

              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => handleEdit(banner)}
                  className="text-sm text-blue-600 hover:underline"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleActive(banner)}
                  className="text-sm text-amber-600 hover:underline"
                >
                  {banner.isActive ? 'Desactivar' : 'Activar'}
                </button>
                <button
                  onClick={() => handleDelete(banner.id)}
                  disabled={deleteMutation.isPending}
                  className="text-sm text-red-600 hover:underline"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </div>
        ))}

        {banners.length === 0 && (
          <div className="rounded-lg border bg-white p-8 text-center text-gray-500">
            No hay banners creados. Crea el primero para que aparezca en el
            carrusel de la página principal.
          </div>
        )}
      </div>
    </div>
  )
}
