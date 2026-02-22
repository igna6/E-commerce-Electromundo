import { eq, isNull } from 'drizzle-orm'
import db from '../../db/db.ts'
import { productsTable } from '../../db/schema.ts'
import { BadRequestError } from '../../utils/errors.ts'

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

export async function importProducts(fileBuffer: Buffer) {
  const content = fileBuffer.toString('utf-8')
  const rows = parseCSV(content)

  if (rows.length < 2) {
    throw new BadRequestError('El archivo CSV está vacío o no tiene datos')
  }

  const header = rows[0]!.map((h) =>
    h.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]/g, '')
  )
  const itemIdx = header.findIndex((h) => ['item', 'sku', 'codigo', 'cod', 'code', 'articulo', 'nro'].includes(h))
  const descIdx = header.findIndex((h) => ['descripcion', 'nombre', 'name', 'producto', 'detalle', 'articulo'].includes(h) || h.includes('descripcion'))
  const stockIdx = header.findIndex((h) => ['existencia', 'stock', 'cantidad', 'cant', 'qty', 'disponible'].includes(h) || h.includes('exist') || h.includes('stock'))

  if (itemIdx === -1) {
    throw new BadRequestError(`No se encontró la columna "Ítem" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`)
  }
  if (descIdx === -1) {
    throw new BadRequestError(`No se encontró la columna "Descripción" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`)
  }
  if (stockIdx === -1) {
    throw new BadRequestError(`No se encontró la columna "Existencia" en el CSV. Columnas encontradas: ${rows[0]!.join(', ')}`)
  }

  const dataRows = rows.slice(1)
  const errors: Array<{ row: number; error: string }> = []
  const validProducts: Array<{ sku: string; name: string; stock: number }> = []

  for (let i = 0; i < dataRows.length; i++) {
    const row = dataRows[i]!
    const rowNum = i + 2

    const sku = (row[itemIdx] ?? '').trim()
    const name = (row[descIdx] ?? '').trim()
    const stockRaw = (row[stockIdx] ?? '').trim()

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

    const stock = Math.max(0, stockNum)
    validProducts.push({ sku, name, stock })
  }

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

  await db.transaction(async (tx) => {
    for (const product of validProducts) {
      const existingId = skuToId.get(product.sku.toLowerCase())

      if (existingId) {
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

  return {
    created,
    updated,
    errors,
    total: validProducts.length,
  }
}
