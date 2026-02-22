import { Router } from 'express'
import multer from 'multer'
import { eq, isNull } from 'drizzle-orm'
import db from '../../db/db.ts'
import { productsTable } from '../../db/schema.ts'

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten archivos CSV'))
    }
  },
})

const router = Router()

function parseCSV(content: string): string[][] {
  const rows: string[][] = []
  const lines = content.split(/\r?\n/)

  for (const line of lines) {
    if (line.trim() === '') continue

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
    rows.push(cells)
  }

  return rows
}

// POST /api/admin/products/import
router.post(
  '/import',
  upload.single('file'),
  async (req, res, next) => {
    try {
      console.log('[CSV Import] Route hit, file:', req.file?.originalname, 'size:', req.file?.size)
      const file = req.file
      if (!file) {
        return res.status(400).json({ error: 'No se proporcionó un archivo' })
      }

      const content = file.buffer.toString('utf-8')
      const rows = parseCSV(content)
      console.log('[CSV Import] Parsed rows:', rows.length, 'Header:', rows[0])

      if (rows.length < 2) {
        return res.status(400).json({ error: 'El archivo CSV está vacío o no tiene datos' })
      }

      // Find column indexes from header
      const header = rows[0]!.map((h) =>
        h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
      )
      const itemIdx = header.findIndex((h) => ['item', 'sku', 'codigo', 'cod', 'code', 'articulo', 'nro'].includes(h))
      const descIdx = header.findIndex((h) => ['descripcion', 'nombre', 'name', 'producto', 'detalle', 'articulo'].includes(h) || h.includes('descripcion'))
      const stockIdx = header.findIndex((h) => ['existencia', 'stock', 'cantidad', 'cant', 'qty', 'disponible'].includes(h) || h.includes('exist') || h.includes('stock'))

      if (itemIdx === -1) {
        return res.status(400).json({
          error: `No se encontró la columna "Ítem" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`,
        })
      }
      if (descIdx === -1) {
        return res.status(400).json({
          error: `No se encontró la columna "Descripción" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`,
        })
      }
      if (stockIdx === -1) {
        return res.status(400).json({
          error: `No se encontró la columna "Existencia" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`,
        })
      }

      // Parse data rows
      const dataRows = rows.slice(1)
      const errors: Array<{ row: number; error: string }> = []
      const validProducts: Array<{ sku: string; name: string; stock: number }> = []

      for (let i = 0; i < dataRows.length; i++) {
        const row = dataRows[i]!
        const rowNum = i + 2 // 1-indexed, +1 for header

        const sku = (row[itemIdx] ?? '').trim()
        const name = (row[descIdx] ?? '').trim()
        const stockRaw = (row[stockIdx] ?? '').trim()

        // Skip totals row or empty rows
        if (!sku || sku.toLowerCase() === 'nan' || sku === '') {
          continue
        }

        if (!name || name.toLowerCase() === 'nan' || name === '') {
          errors.push({ row: rowNum, error: `Descripción vacía para Ítem "${sku}"` })
          continue
        }

        const stockNum = parseInt(stockRaw, 10)
        if (isNaN(stockNum)) {
          errors.push({ row: rowNum, error: `Stock inválido "${stockRaw}" para Ítem "${sku}"` })
          continue
        }

        // Clamp negative stock to 0
        const stock = Math.max(0, stockNum)

        validProducts.push({ sku, name, stock })
      }

      // Fetch all existing products with SKUs
      const existingProducts = await db
        .select({ id: productsTable.id, sku: productsTable.sku })
        .from(productsTable)
        .where(isNull(productsTable.deletedAt))

      const skuToId = new Map<string, number>()
      for (const p of existingProducts) {
        if (p.sku) {
          skuToId.set(p.sku.toLowerCase(), p.id)
        }
      }

      let created = 0
      let updated = 0

      // Process in a transaction
      await db.transaction(async (tx) => {
        for (const product of validProducts) {
          const existingId = skuToId.get(product.sku.toLowerCase())

          if (existingId) {
            // Update existing product
            await tx
              .update(productsTable)
              .set({
                name: product.name,
                stock: product.stock,
                updatedAt: new Date(),
              })
              .where(eq(productsTable.id, existingId))
            updated++
          } else {
            // Create new product
            await tx.insert(productsTable).values({
              sku: product.sku,
              name: product.name,
              price: 0,
              stock: product.stock,
            })
            created++
          }
        }
      })

      res.json({
        created,
        updated,
        errors,
        total: validProducts.length,
      })
    } catch (error) {
      next(error)
    }
  }
)

export default router
