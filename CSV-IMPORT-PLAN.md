# Plan: CSV Product Import

## Goal
Add CSV import functionality to the admin panel so administrators can bulk-import/update products from a CSV file exported from their inventory system. Products are matched by SKU code (`Ítem`). New products are created with price = 0; existing products get their stock updated.

---

## Source File Structure

The inventory export (`Listado de Existencias electromundo.xls`) has this structure — the admin will convert to CSV before uploading:

```csv
Ítem,Descripción,Grupo,Existencia,Producción,Comprometido
BICGCANV,BICICLETA GCA MOUNTAINBIKE RODADO 29 21 VELOCIDADES ALUMINIO ZEUS 1 NEGRA/VERDE,,1,0,0
CACEL0005,CABLE MICRO USB 5A LEGATUS TC-5008,,11,0,0
```

**Column mapping:**
| CSV Column     | DB Field    | Required | Notes                                          |
|---------------|-------------|----------|-------------------------------------------------|
| Ítem          | **sku** (new) | Yes    | Unique product code — match key for upsert      |
| Descripción   | name        | Yes      | Product display name                             |
| Grupo         | category    | No       | Always empty in current file — ignored for now   |
| Existencia    | stock       | Yes      | Integer; negative values clamped to 0            |
| Producción    | —           | No       | Ignored                                          |
| Comprometido  | —           | No       | Ignored                                          |

**Data rules:**
- Last row is a totals row (NaN Ítem) — must be skipped
- Negative `Existencia` → set stock to 0
- No price in file → new products get price = 0 (admin updates later)
- Existing products (matched by SKU) → only stock and name are updated

---

## Architecture

```
[Admin UI: File Upload (.csv)]
    → POST /api/admin/products/import (multipart/form-data)
    → [Parse CSV → Skip totals row → Validate → Clamp negatives → Upsert by SKU]
    → [Return { created, updated, errors }]
```

---

## Step 1: Add `sku` column to products table

**New file:** `server/drizzle/0004_add-sku-column.sql`

```sql
ALTER TABLE products ADD COLUMN sku VARCHAR UNIQUE;
```

**Edit file:** `server/src/entities/products.ts`

Add the `sku` column to the Drizzle schema:
```ts
sku: varchar().unique(),
```

**Edit file:** `server/src/validators/product.ts`

Add `sku` as an optional field to `createProductSchema` and `updateProductSchema`:
```ts
sku: z.string().max(50).optional().nullable(),
```

**Edit file:** `web/src/types/product.ts`

Add `sku?: string | null` to the Product type.

**Verification:** Run `npx drizzle-kit push` or apply migration. The `sku` column exists in the products table.

---

## Step 2: Install `multer` for file uploads (server)

**File:** `server/package.json`

```bash
cd server && npm install multer @types/multer
```

**Verification:** `multer` appears in dependencies.

---

## Step 3: Create CSV import endpoint (server)

**New file:** `server/src/routes/admin/importProducts.ts`

### `POST /api/admin/products/import`

Protected with `authenticateToken` + `requireAdmin`.

**Logic:**
1. Accept CSV file via `multer` (memory storage, max 5MB, `.csv` only)
2. Parse CSV content (split by newlines, split by comma, handle quoted fields)
3. Map columns: find indexes for `Ítem`, `Descripción`, `Existencia` by header names
4. For each data row:
   - Skip if `Ítem` is empty/NaN (totals row)
   - Validate: `Ítem` (required string), `Descripción` (required string), `Existencia` (integer)
   - Clamp negative `Existencia` to 0
5. Upsert by SKU:
   - Query all existing products' SKUs in one batch
   - Build a `Map<string, number>` (sku → product id)
   - If SKU exists → UPDATE stock and name
   - If SKU doesn't exist → INSERT with price = 0, stock from CSV
6. Return JSON result:
   ```json
   {
     "created": 450,
     "updated": 37,
     "skipped": 32,
     "errors": [{ "row": 3, "error": "Ítem vacío" }],
     "total": 877
   }
   ```

**Key patterns:**
- Use Drizzle ORM transaction for atomicity
- Use `ilike` for case-insensitive SKU matching
- Follow existing error handling with `next(error)`
- Process in batches if needed (878 rows is fine in a single transaction)

---

## Step 4: Register import route in admin router

**File:** `server/src/routes/admin/index.ts`

```ts
import importProductsRouter from './importProducts'
router.use('/products', importProductsRouter)
```

**Verification:** `POST /api/admin/products/import` is accessible.

---

## Step 5: Add `importProductsCSV` service function (frontend)

**File:** `web/src/services/products.service.ts`

Add:
```ts
export type ImportResult = {
  created: number
  updated: number
  skipped: number
  errors: Array<{ row: number; error: string }>
  total: number
}

export async function importProductsCSV(file: File): Promise<ImportResult> {
  const formData = new FormData()
  formData.append('file', file)
  // Custom fetch — don't set Content-Type (browser sets multipart boundary)
  const token = localStorage.getItem('electromundo-access-token')
  const res = await fetch(`${API_URL}/api/admin/products/import`, {
    method: 'POST',
    headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    body: formData,
  })
  if (!res.ok) throw new ApiError(...)
  return res.json()
}
```

---

## Step 6: Create CSV Import dialog component (frontend)

**New file:** `web/src/sections/admin/ImportProductsDialog.tsx`

A Radix UI Dialog with these states:

1. **`idle`** — File input (accepts `.csv` only) with instructions:
   > "Seleccioná un archivo CSV exportado del listado de existencias. Columnas esperadas: Ítem, Descripción, Existencia."

2. **`previewing`** — After file selection, parse CSV client-side and show:
   - Total row count
   - Preview table of first 5 rows (Ítem, Descripción, Existencia)
   - "Importar" button

3. **`importing`** — Spinner with "Importando productos..."

4. **`done`** — Results summary:
   - Creados: N (green)
   - Actualizados: N (blue)
   - Omitidos: N (yellow, for negative stock clamped to 0)
   - Errores: N (red, expandable list with row numbers)
   - "Cerrar" button

**UI text in Spanish** matching existing admin panel.

---

## Step 7: Add import button to admin products page

**File:** `web/src/routes/admin/products.index.tsx`

Add "Importar CSV" button next to "Nuevo Producto" in the header. Opens the `ImportProductsDialog`.

After successful import, invalidate `['products']` query to refresh the table.

---

## File Summary

| Action  | File                                              | Description                        |
|---------|---------------------------------------------------|------------------------------------|
| Create  | `server/drizzle/0004_add-sku-column.sql`          | Migration: add SKU column          |
| Edit    | `server/src/entities/products.ts`                 | Add `sku` to Drizzle schema        |
| Edit    | `server/src/validators/product.ts`                | Add `sku` to Zod schemas           |
| Edit    | `web/src/types/product.ts`                        | Add `sku` to Product type          |
| Install | `server/package.json`                             | Add `multer`, `@types/multer`      |
| Create  | `server/src/routes/admin/importProducts.ts`       | CSV import endpoint                |
| Edit    | `server/src/routes/admin/index.ts`                | Register import route              |
| Edit    | `web/src/services/products.service.ts`            | Add `importProductsCSV()`          |
| Create  | `web/src/sections/admin/ImportProductsDialog.tsx`  | Import UI dialog                   |
| Edit    | `web/src/routes/admin/products.index.tsx`          | Add "Importar CSV" button          |

**Total: 3 new files, 6 edited files.**

---

## Verification Criteria

- [ ] Products table has a `sku` column (unique, nullable)
- [ ] Admin can click "Importar CSV" in the products page
- [ ] Dialog opens with file picker (accepts only `.csv`)
- [ ] After selecting file, preview of first 5 rows is shown
- [ ] Clicking "Importar" uploads and processes the file
- [ ] New products are created with price = 0 and correct stock
- [ ] Existing products (same SKU) get stock and name updated
- [ ] Negative stock values are clamped to 0
- [ ] Totals row (empty Ítem) is skipped
- [ ] Invalid rows are reported with row number and error
- [ ] Products table refreshes after successful import
- [ ] Endpoint is protected (requires admin auth)
