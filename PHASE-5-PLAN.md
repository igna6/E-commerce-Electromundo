# Phase 5 Implementation Plan: Inventory Management

**Project**: E-commerce Electromundo
**Phase**: 5 of 7
**Focus**: Inventory / Stock Management
**Status**: NOT STARTED

---

<objective>
Add stock tracking to products so the store can manage inventory levels, prevent overselling, and provide accurate stock information to customers.
</objective>

<execution_context>
Files to load before executing:
- `server/src/entities/products.ts` — current products schema
- `server/src/validators/product.ts` — current product validation
- `server/src/routes/products.ts` — current product API
- `server/src/routes/orders.ts` — order creation (needs stock deduction)
- `server/src/routes/admin/stats.ts` — admin dashboard stats
- `web/src/types/product.ts` — frontend Product type
- `web/src/sections/admin/ProductForm.tsx` — admin product form
- `web/src/sections/admin/ProductsTable.tsx` — admin products table
- `web/src/sections/products/ProductDetail/ProductDetail.tsx` — product detail page
- `web/src/contexts/CartContext.tsx` — cart state management
</execution_context>

<context>
- Prices are stored as integers (cents). Stock should be a simple integer (units).
- All user-facing text is in Spanish.
- Backend uses Drizzle ORM, Zod validation, Express.js.
- Frontend uses React, TanStack Router, TanStack Query, Tailwind CSS, shadcn/ui.
- Admin routes are protected with `authenticateToken` + `requireAdmin` middleware.
- Product detail page currently has HARDCODED stock values ("Stock disponible: 25 unidades" and "En Stock" badge).
- Cart context (`CartContext.tsx`) has no stock validation — users can add unlimited quantities.
- Order creation (`orders.ts`) does NOT check or deduct stock.
</context>

---

## Task Breakdown

<tasks>

### GROUP 1: Backend — Database & Validation

#### Task 1.1: Add stock column to products table
**Type**: auto
**File**: `server/src/entities/products.ts`
**Changes**:
- Add `stock: integer('stock').notNull().default(0)` to `productsTable`

**Migration**:
- Run `npx drizzle-kit generate` to create migration
- Run `npx drizzle-kit push` (or migrate) to apply

**Backfill**: Existing products will get stock = 0. After migration, use admin UI to set real stock values.

**Verification**:
- [ ] Column exists in database
- [ ] Existing products have stock = 0
- [ ] New products can be created with stock value

---

#### Task 1.2: Update product validation schemas
**Type**: auto
**File**: `server/src/validators/product.ts`
**Changes**:
- Add `stock: z.number().int().min(0, 'El stock no puede ser negativo')` to `createProductSchema`
- Add `stock: z.number().int().min(0).optional()` to `updateProductSchema`

**Verification**:
- [ ] Create product requires stock >= 0
- [ ] Update product accepts optional stock
- [ ] Negative stock values are rejected

---

### GROUP 2: Backend — API Logic

#### Task 2.1: Update product routes to include stock
**Type**: auto
**File**: `server/src/routes/products.ts`
**Changes**:
- GET endpoints already return all columns, so stock will be included automatically
- Add optional `inStock` query parameter to GET `/api/products`: when `inStock=true`, filter to `stock > 0`

**Verification**:
- [ ] GET /api/products returns stock field
- [ ] GET /api/products/:id returns stock field
- [ ] GET /api/products?inStock=true returns only products with stock > 0

---

#### Task 2.2: Add stock validation and deduction to order creation
**Type**: auto
**File**: `server/src/routes/orders.ts`
**Changes**:
- After fetching products, validate that each requested quantity <= available stock
- If any item has insufficient stock, return 409 with details of which items are unavailable
- Wrap order creation + stock deduction in a database transaction:
  1. Check stock levels
  2. Deduct stock for each item (`SET stock = stock - quantity`)
  3. Create order record
  4. Create order items
- Use Drizzle's `db.transaction()` for atomicity

**Error response format**:
```json
{
  "error": "Stock insuficiente",
  "details": [
    { "productId": 1, "productName": "iPhone", "requested": 3, "available": 1 }
  ]
}
```

**Verification**:
- [ ] Order with sufficient stock succeeds and deducts stock
- [ ] Order with insufficient stock returns 409 with details
- [ ] Stock is not deducted if order creation fails
- [ ] Concurrent orders don't oversell (transaction ensures atomicity)

---

#### Task 2.3: Add inventory stats to admin dashboard
**Type**: auto
**File**: `server/src/routes/admin/stats.ts`
**Changes**:
- Add to the stats response:
  - `outOfStockCount`: number of products where stock = 0 and not deleted
  - `lowStockCount`: number of products where stock > 0 AND stock <= 5 and not deleted
  - `lowStockProducts`: array of { id, name, stock } for products with stock <= 5 (limit 10)

**Verification**:
- [ ] Stats include out-of-stock count
- [ ] Stats include low-stock count
- [ ] Stats include low-stock product list

---

### GROUP 3: Frontend — Type & Service Updates

#### Task 3.1: Update Product type
**Type**: auto
**File**: `web/src/types/product.ts`
**Changes**:
- Add `stock: number` to Product type

**Verification**:
- [ ] Product type includes stock field
- [ ] No TypeScript errors across the project

---

#### Task 3.2: Update product service (if needed)
**Type**: auto
**File**: `web/src/services/products.service.ts`
**Changes**:
- Add `inStock?: boolean` to `GetProductsParams` type
- Include `inStock` query param in the URL builder if set

**Verification**:
- [ ] Can pass inStock filter to getProducts

---

### GROUP 4: Frontend — Admin UI

#### Task 4.1: Add stock field to admin product form
**Type**: auto
**File**: `web/src/sections/admin/ProductForm.tsx`
**Changes**:
- Add stock number input field (label: "Stock disponible", min: 0, step: 1)
- Default value: 0 for new products, current stock for editing
- Include stock in form submission data

**Verification**:
- [ ] Stock field visible in create and edit forms
- [ ] Stock value is saved correctly
- [ ] Cannot enter negative values

---

#### Task 4.2: Add stock column to admin products table
**Type**: auto
**File**: `web/src/sections/admin/ProductsTable.tsx`
**Changes**:
- Add "Stock" column after price column
- Color coding:
  - stock = 0 → red text + "Agotado" badge
  - stock <= 5 → yellow/amber text + stock number
  - stock > 5 → green text + stock number

**Verification**:
- [ ] Stock column displays in table
- [ ] Color coding works correctly
- [ ] Zero stock shows "Agotado"

---

#### Task 4.3: Add inventory alerts to admin dashboard
**Type**: auto
**File**: Find the admin dashboard component (likely `web/src/sections/admin/` or `web/src/routes/admin/dashboard.tsx`)
**Changes**:
- Add inventory summary card showing:
  - Out of stock count (red)
  - Low stock count (amber)
- Add "Productos con bajo stock" section listing low-stock products (name + stock count)
- Link each product to its edit page

**Verification**:
- [ ] Dashboard shows inventory alerts
- [ ] Out of stock and low stock counts display
- [ ] Low stock products list appears
- [ ] Links navigate to product edit

---

### GROUP 5: Frontend — Customer-Facing UI

#### Task 5.1: Update product detail page with real stock data
**Type**: auto
**File**: `web/src/sections/products/ProductDetail/ProductDetail.tsx`
**Changes**:
- Replace hardcoded "En Stock" badge:
  - stock > 0 → green "En Stock" badge
  - stock = 0 → red "Agotado" badge
- Replace hardcoded "Stock disponible: 25 unidades" with actual `product.stock`
- Show "Últimas {stock} unidades" when stock <= 5 and stock > 0
- Quantity selector: set max to `product.stock`
- Disable "Agregar al Carrito" button when stock = 0
- Show "Producto agotado" message when stock = 0

**Verification**:
- [ ] In-stock products show green badge and stock count
- [ ] Out-of-stock products show red badge and disabled button
- [ ] Low stock shows urgency message
- [ ] Quantity selector cannot exceed available stock

---

#### Task 5.2: Add stock validation to cart context
**Type**: auto
**File**: `web/src/contexts/CartContext.tsx`
**Changes**:
- In `addItem`: check if adding quantity would exceed `product.stock`
  - If yes, cap at available stock or show warning
- In `updateQuantity`: validate against the product's stock level
  - Need product stock info — store it in CartItem (add `stock` field to CartItem type)
- When product is out of stock, prevent adding to cart

**Note**: Since stock can change server-side, this is client-side optimistic validation. The real check happens at order creation (Task 2.2).

**Verification**:
- [ ] Cannot add more than available stock to cart
- [ ] Quantity updates are capped at available stock
- [ ] Out-of-stock products cannot be added

---

#### Task 5.3: Handle insufficient stock at checkout
**Type**: auto
**File**: `web/src/sections/checkout/CheckoutPage.tsx` (or the order submission logic)
**Changes**:
- If order creation returns 409 (insufficient stock), display a clear error message listing which items are unavailable
- Show each item name, requested quantity, and available quantity
- Allow user to go back to cart and adjust

**Verification**:
- [ ] 409 error is caught and displayed clearly
- [ ] User can see which items have insufficient stock
- [ ] User can navigate back to cart to adjust

---

</tasks>

<verification>

### Backend Verification
- [ ] Products table has `stock` integer column
- [ ] GET /api/products returns stock field for all products
- [ ] POST /api/products requires stock >= 0
- [ ] PUT /api/products/:id can update stock
- [ ] POST /api/orders validates stock before creating order
- [ ] POST /api/orders deducts stock on successful order
- [ ] POST /api/orders returns 409 with details when stock is insufficient
- [ ] GET /api/admin/stats includes inventory metrics
- [ ] Database transaction prevents overselling on concurrent orders

### Frontend Verification
- [ ] Product type includes stock field
- [ ] Admin product form has stock input
- [ ] Admin products table shows stock with color coding
- [ ] Admin dashboard shows inventory alerts
- [ ] Product detail page shows real stock data
- [ ] Out-of-stock products show disabled "Add to Cart"
- [ ] Cart respects stock limits
- [ ] Checkout handles 409 stock errors gracefully

### Integration Verification
- [ ] Create product with stock → shows in admin table → shows on product detail
- [ ] Add to cart respects stock limit → checkout succeeds → stock decreases
- [ ] Out-of-stock product → cannot add to cart → cannot checkout
- [ ] Admin updates stock → product detail reflects new value
- [ ] Low stock product → shows in admin dashboard alerts

</verification>

<success_criteria>
- Products have trackable stock levels managed through admin UI
- Customers see accurate stock information on product pages
- Orders cannot be placed for quantities exceeding available stock
- Stock is atomically deducted when orders are created
- Admin dashboard shows inventory health (out-of-stock, low-stock alerts)
- All hardcoded stock values are replaced with real data
</success_criteria>

---

## Implementation Order

**Recommended sequence**: Backend-first, then frontend

1. **Tasks 1.1-1.2**: Schema + validation (foundation)
2. **Tasks 2.1-2.3**: API logic (stock in responses, order deduction, stats)
3. **Task 3.1-3.2**: Frontend types + service
4. **Tasks 4.1-4.3**: Admin UI (form, table, dashboard)
5. **Tasks 5.1-5.3**: Customer UI (detail page, cart, checkout)

**Estimated files to modify**: ~12 files
**New files**: 1 (migration file, auto-generated)
