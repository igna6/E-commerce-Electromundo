import { useState, useRef } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Upload, FileSpreadsheet, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { importProductsCSV, type ImportResult } from '@/services/products.service'

type State = 'idle' | 'previewing' | 'importing' | 'done'

type PreviewRow = {
  item: string
  description: string
  stock: string
}

function parseCSVPreview(content: string): { headers: string[]; rows: PreviewRow[]; totalRows: number } {
  const lines = content.split(/\r?\n/).filter((l) => l.trim() !== '')
  if (lines.length < 2) return { headers: [], rows: [], totalRows: 0 }

  const parseRow = (line: string): string[] => {
    const cells: string[] = []
    let current = ''
    let inQuotes = false
    for (let i = 0; i < line.length; i++) {
      const char = line[i]
      if (inQuotes) {
        if (char === '"' && line[i + 1] === '"') {
          current += '"'
          i++
        } else if (char === '"') {
          inQuotes = false
        } else {
          current += char
        }
      } else {
        if (char === '"') {
          inQuotes = true
        } else if (char === ',' || char === ';') {
          cells.push(current.trim())
          current = ''
        } else {
          current += char
        }
      }
    }
    cells.push(current.trim())
    return cells
  }

  const headers = parseRow(lines[0])
  const normalize = (s: string) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
  const itemIdx = headers.findIndex((h) => ['item', 'ítem', 'sku', 'codigo'].includes(normalize(h)))
  const descIdx = headers.findIndex((h) => ['descripcion', 'descripción', 'nombre', 'name'].includes(normalize(h)))
  const stockIdx = headers.findIndex((h) => ['existencia', 'stock', 'cantidad'].includes(normalize(h)))

  const dataLines = lines.slice(1)
  // Filter out totals row (empty item)
  const validLines = dataLines.filter((line) => {
    const cells = parseRow(line)
    const item = cells[itemIdx]?.trim()
    return item && item.toLowerCase() !== 'nan'
  })

  const previewRows: PreviewRow[] = validLines.slice(0, 5).map((line) => {
    const cells = parseRow(line)
    return {
      item: cells[itemIdx] || '',
      description: cells[descIdx] || '',
      stock: cells[stockIdx] || '0',
    }
  })

  return { headers, rows: previewRows, totalRows: validLines.length }
}

type ImportProductsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ImportProductsDialog({ open, onOpenChange }: ImportProductsDialogProps) {
  const [state, setState] = useState<State>('idle')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<{ rows: PreviewRow[]; totalRows: number } | null>(null)
  const [result, setResult] = useState<ImportResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()

  const importMutation = useMutation({
    mutationFn: (csvFile: File) => importProductsCSV(csvFile),
    onSuccess: (data) => {
      setResult(data)
      setState('done')
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: () => {
      setState('previewing')
    },
  })

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const { rows, totalRows } = parseCSVPreview(content)
      setPreview({ rows, totalRows })
      setState('previewing')
    }
    reader.readAsText(selectedFile)
  }

  const handleImport = () => {
    if (!file) return
    setState('importing')
    importMutation.mutate(file)
  }

  const handleClose = () => {
    setState('idle')
    setFile(null)
    setPreview(null)
    setResult(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Importar Productos desde CSV</DialogTitle>
          <DialogDescription>
            Subí un archivo CSV exportado del listado de existencias. Columnas esperadas: Ítem, Descripción, Existencia.
          </DialogDescription>
        </DialogHeader>

        {state === 'idle' && (
          <div className="flex flex-col items-center gap-4 py-8">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <label className="cursor-pointer rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Seleccionar archivo CSV
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
            <p className="text-xs text-gray-500">Solo archivos .csv (máximo 5MB)</p>
          </div>
        )}

        {state === 'previewing' && preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <FileSpreadsheet className="h-4 w-4" />
              <span>
                {file?.name} — {preview.totalRows} productos encontrados
              </span>
            </div>

            <div className="overflow-hidden rounded-md border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-gray-500">
                    <th className="px-3 py-2">Ítem</th>
                    <th className="px-3 py-2">Descripción</th>
                    <th className="px-3 py-2 text-right">Existencia</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.rows.map((row, i) => (
                    <tr key={i} className="border-b last:border-0">
                      <td className="px-3 py-2 font-mono text-xs">{row.item}</td>
                      <td className="px-3 py-2 max-w-[300px] truncate">{row.description}</td>
                      <td className="px-3 py-2 text-right">{row.stock}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {preview.totalRows > 5 && (
              <p className="text-xs text-gray-500 text-center">
                ...y {preview.totalRows - 5} productos más
              </p>
            )}

            {importMutation.isError && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                Error: {importMutation.error?.message || 'Error al importar'}
              </div>
            )}

            <DialogFooter>
              <button
                onClick={handleClose}
                className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleImport}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Importar {preview.totalRows} productos
              </button>
            </DialogFooter>
          </div>
        )}

        {state === 'importing' && (
          <div className="flex flex-col items-center gap-4 py-12">
            <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            <p className="text-sm text-gray-600">Importando productos...</p>
          </div>
        )}

        {state === 'done' && result && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-medium text-green-700">
              <CheckCircle2 className="h-5 w-5" />
              Importación completada
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-md bg-green-50 p-3 text-center">
                <div className="text-2xl font-bold text-green-700">{result.created}</div>
                <div className="text-xs text-green-600">Creados</div>
              </div>
              <div className="rounded-md bg-blue-50 p-3 text-center">
                <div className="text-2xl font-bold text-blue-700">{result.updated}</div>
                <div className="text-xs text-blue-600">Actualizados</div>
              </div>
              <div className="rounded-md bg-red-50 p-3 text-center">
                <div className="text-2xl font-bold text-red-700">{result.errors.length}</div>
                <div className="text-xs text-red-600">Errores</div>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="max-h-40 overflow-y-auto rounded-md border border-red-200 bg-red-50 p-3">
                <div className="mb-2 flex items-center gap-1 text-sm font-medium text-red-700">
                  <AlertCircle className="h-4 w-4" />
                  Errores encontrados
                </div>
                <ul className="space-y-1 text-xs text-red-600">
                  {result.errors.map((err, i) => (
                    <li key={i}>
                      Fila {err.row}: {err.error}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <DialogFooter>
              <button
                onClick={handleClose}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
              >
                Cerrar
              </button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
