# What's Next - E-commerce Electromundo Handoff

**Last Updated**: February 21, 2026
**Current Phase**: Phase 5 Complete - Phases 6-7 Remaining
**Session**: Implemented Phase 5 (Inventory Management) + UX fixes

---

<original_task>
Execute Phase 5 of the e-commerce project roadmap: Inventory Management. This involved adding stock tracking to products, preventing overselling, showing stock data to customers, and providing admin inventory alerts. Additionally, two small UX fixes were requested during the session: fixing a Zod 4 TypeScript error in the error handler middleware, and reducing the products page hero section height to show actual content on initial load.
</original_task>

<work_completed>

## Session Work: Phase 5 Inventory Management (19 files, 2 commits)

### Commit `31126a8` — `feat: stock handler`

**Backend Changes (7 files):**

1. **`server/src/entities/products.ts`** — Added `stock: integer().notNull().default(0)` to productsTable schema
2. **`server/drizzle/0003_add-stock-column.sql`** + snapshot/journal — Drizzle migration generated and applied via `drizzle-kit push`
3. **`server/src/validators/product.ts`** — Added `stock` field to both `createProductSchema` (`.default(0)`) and `updateProductSchema` (`.optional()`) with `min(0)` validation
4. **`server/src/routes/products.ts`** — Added `inStock` query parameter filter (`gt(productsTable.stock, 0)`) to GET `/api/products`, imported `gt` from drizzle-orm
5. **`server/src/routes/orders.ts`** — Major rewrite of POST `/api/orders`:
   - Added stock availability check before order creation (returns 409 with `{ error: 'Stock insuficiente', details: [{ productId, productName, requested, available }] }`)
   - Wrapped entire order creation + stock deduction in `db.transaction()` for atomicity
   - Stock deducted via `sql\`${productsTable.stock} - ${item.quantity}\`` inside transaction
   - Imported `sql` from drizzle-orm
6. **`server/src/routes/admin/stats.ts`** — Added 3 new queries to stats endpoint:
   - `outOfStockCount`: products where `stock = 0` and not deleted
   - `lowStockCount`: products where `stock > 0 AND stock <= 5` and not deleted
   - `lowStockProducts`: top 10 products with `stock <= 5`, ordered by stock ascending
   - Added to response under `inventory: { outOfStock, lowStock, lowStockProducts }`
   - Imported `and, gt, lte, asc` from drizzle-orm

**Frontend Changes (10 files):**

7. **`web/src/types/product.ts`** — Added `stock: number` to Product type
8. **`web/src/services/products.service.ts`** — Added `inStock?: boolean` to `GetProductsParams`, added `stock?: number` to create/update function signatures, included inStock query param in URL builder
9. **`web/src/services/api.ts`** — Enhanced `ApiError` class with `data?: any` field; updated `apiRequest` to parse error response JSON body and attach it to the thrown `ApiError` (enables 409 stock error handling at checkout)
10. **`web/src/sections/admin/ProductForm.tsx`** — Added `stock` field to `ProductFormData` type, added `stock` state variable, added stock number input field (label: "Stock disponible *", min: 0, step: 1), included stock in form submission
11. **`web/src/sections/admin/ProductsTable.tsx`** — Added "Stock" column header and data cell with color-coded display:
    - stock = 0 → red badge "Agotado"
    - stock <= 5 → amber badge with number
    - stock > 5 → green text with number
12. **`web/src/routes/admin/dashboard.tsx`** — Updated `StatsResponse` type with `inventory` section; added `Link` import; added conditional inventory alerts panel (amber bg) showing:
    - Out-of-stock count (red badge)
    - Low stock count (amber badge)
    - List of low-stock products with links to their edit pages
13. **`web/src/sections/products/ProductDetail/ProductDetail.tsx`** — Replaced all hardcoded stock data:
    - "En Stock" badge → dynamic green/red based on `product.stock`
    - Quantity + button max capped at `product.stock`, disabled when stock = 0
    - "Stock disponible: 25 unidades" → real stock with urgency messaging ("Ultimas N unidades!" when <= 5)
    - Add to cart button disabled + "Producto Agotado" text when stock = 0
14. **`web/src/contexts/CartContext.tsx`** — Added stock validation:
    - `addItem`: prevents adding when `product.stock <= 0`, caps quantity at `product.stock`, updates product data on existing cart items
    - `updateQuantity`: caps at `item.product.stock` via `Math.min()`
15. **`web/src/sections/checkout/CheckoutPage.tsx`** — Added `stockErrors` state; updated `onSubmit` error handler to detect `error.status === 409` and extract `error.data.details`; enhanced error display to show per-item stock details (product name, requested qty, available qty) with "Volver al carrito" link

### Commit `3d9f5d8` — `improve product display`

16. **`server/src/middleware/errorHandler.ts`** — Fixed Zod 4 compatibility: changed `err.errors` to `err.issues` (Zod 4 renamed the property)
17. **`web/src/sections/products/ProductsPage/ProductsPage.tsx`** — Replaced full-viewport two-column hero section (with decorative illustration, floating badges, `py-16 lg:py-24`) with compact single-row header (`py-8 lg:py-10`) containing title, subtitle, and trust badges inline. Removed ~75 lines of decorative JSX.

### Plan Document Created
18. **`PHASE-5-PLAN.md`** — Detailed implementation plan with objective, execution context, 13 tasks across 5 groups, verification criteria, and success criteria

### Existing Products Note
All existing products in the database now have `stock = 0` (the migration default). Admin needs to set real stock values through the admin UI.

## Previously Completed Phases (1-4)

### Phase 1: Product Management & Categories
- Product CRUD API with pagination (12-50 items/page)
- Category management endpoints (secured with admin auth)
- Product search by name/description, price range filtering
- Sorting options (newest, price asc/desc, name)
- Soft delete support (deletedAt timestamps)
- Frontend product browsing, detail pages, category filtering

### Phase 2: Session-Based Shopping Cart
- CartContext: React Context + localStorage persistence (key: `electromundo-cart`)
- Add/remove/update quantity, cart totals, cart badge in header

### Phase 3: Guest Checkout & Order Text Generation
- Orders table (21 columns) + OrderItems table (8 columns)
- Backend price calculation, shipping costs, 21% IVA tax
- Multi-step checkout form with Zod validation (Spanish)
- Order confirmation page with copy-to-clipboard

### Phase 4: Admin Panel
- JWT auth system (access + refresh tokens)
- Admin dashboard with live stats
- Orders management with status updates
- Products CRUD + Categories CRUD
- Protected routes (backend middleware + frontend route guards)

### Additional Features
- Floating WhatsApp button for customer support

</work_completed>

<work_remaining>

## Phase 6: Reports & Analytics
Per ROADMAP.md, this phase covers:
- Sales reports with date filtering
- Revenue tracking over time
- Best-selling products report
- Charts/graphs on admin dashboard (consider recharts library)
- Export functionality (CSV)

## Phase 7: Production Deployment
Per ROADMAP.md:
- Environment configuration (production vs development)
- Security hardening (CORS whitelist, rate limiting via express-rate-limit, Helmet.js, input sanitization)
- Performance optimization (compression middleware, database indexes, lazy loading routes)
- SEO enhancements (meta tags, Open Graph, sitemap)
- Deployment setup (backend: Railway/Render/Fly.io, frontend: Netlify, database: managed PostgreSQL)
- Monitoring and error tracking

## Optional Enhancements (from ROADMAP.md Phase 5: Enhanced Features & Polish)
These were in the original ROADMAP.md Phase 5 but were deprioritized in favor of inventory management:
- Debounced search with autocomplete/suggestions
- Multi-select category filter with checkboxes
- Price range slider instead of inputs
- Mobile-friendly filter drawer
- Product image upload (currently URL-only, consider Cloudinary/S3)
- Image optimization (lazy loading, responsive srcset, zoom on detail)
- Skeleton loading screens
- Toast notifications for all actions
- Quick view modal for products
- Cart slide-out drawer
- Admin dashboard charts (recharts)
- Bulk operations (bulk delete, bulk status update)
- Order export/printing
- Admin activity logging

## Known Issues / Polish Items
- Products page filters (categories, brands, price slider) are UI-only — not wired to actual API query params. The FilterSidebar component manages state locally but doesn't pass it to `useProducts()`.
- ProductDetail fetches all products via `useProducts({ page: 1, limit: 20 })` and finds by ID client-side — should use dedicated `getProduct(id)` endpoint instead.
- Some pages may still use old `brand-*` color tokens (checkout was migrated to `primary`/`slate-*`, but product detail page still uses `brand-blue`, `brand-dark`, `brand-orange`, `brand-light` tokens).

</work_remaining>

<attempted_approaches>

## Patterns Established

1. **Backend-First Development**: Create entities, validators, and routes before frontend
2. **Price Calculation on Backend**: Fetch current prices from DB, calculate server-side for security
3. **Zod Validation**: Matching schemas on frontend and backend
4. **Spanish Localization**: All user-facing text in Spanish
5. **TanStack Router Search Params**: Use `z.number().catch(0)` for ID parsing
6. **Auth Pattern**: `authApiRequest` for protected endpoints, `apiRequest` for public
7. **Design Token Migration**: Project moved from `brand-*` tokens to `primary`/`slate-*` system
8. **Stock Validation Pattern**: Client-side optimistic check (cart caps at stock) + server-side authoritative check (409 on insufficient stock in transaction)
9. **Drizzle Transactions**: `db.transaction(async (tx) => { ... })` for atomic multi-table operations
10. **ApiError Enhancement**: Error responses now include parsed response body in `error.data` field for rich error handling

## What Worked Well
- Drizzle ORM transactions for atomic stock deduction + order creation
- `sql` template literal for `stock = stock - quantity` atomic decrement
- ApiError class enhancement to carry response body (enables 409 stock error display)
- Compact hero section significantly improves above-the-fold content visibility
- Color-coded stock badges in admin table provide instant visual inventory health

## Technical Decisions
- **Stock as simple integer**: No separate inventory table, stock movement history, or reserved stock — kept simple for MVP. Stock is just a column on products.
- **Low stock threshold = 5**: Hardcoded in admin stats query and product detail page. Consider making configurable if needed.
- **Client-side stock validation is optimistic**: Cart context caps at `product.stock` from last fetch, but real validation happens server-side at order creation. Stale stock data in cart is possible.
- **Zod 4 uses `.issues` not `.errors`**: The `ZodError` property was renamed in Zod 4.x.

## Pre-existing Technical Debt (not introduced this session)
- TypeScript strict mode warnings in `server/src/routes/products.ts` and `server/src/routes/categories.ts` for `req.params.id` type handling (doesn't affect runtime)
- Some pages still use old `brand-*` color tokens (product detail page notably)

</attempted_approaches>

<critical_context>

## Tech Stack

**Backend (`/server`):**
- Node.js + TypeScript + Express.js 5.2.1
- PostgreSQL 17.1 + Drizzle ORM 0.45.1
- JWT authentication with bcryptjs
- Zod 4.3.5 for validation

**Frontend (`/web`):**
- React 19.2.0 + Vite 7.1.7
- TanStack Router 1.132.0 (file-based routing)
- TanStack Query 5.90.16 (server state)
- Tailwind CSS 3.4.17 + Radix UI/shadcn (52+ components)
- React Hook Form 7.71.0 + Zod

## Price Handling Convention
- **All prices stored as integers (cents)**
- Example: 99999 cents = ARS $999.99
- Display: `Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' })`

## Stock Handling Convention
- **Stock stored as integer (units)** on products table
- Default: 0 for new/existing products
- Low stock threshold: <= 5 units
- Out of stock: 0 units

## Order Calculation Logic
```
Subtotal = sum of (item.price * item.quantity)
Shipping = varies by method (0 / 300000 / 800000 cents)
Tax = Subtotal * 0.21 (21% IVA)
Total = Subtotal + Shipping + Tax
```

## API Endpoints

**Public Endpoints:**
```
GET  /api/products          - List with pagination, search, filter, sort, inStock
GET  /api/products/:id      - Single product (includes stock)
GET  /api/categories        - List categories
GET  /api/categories/:id    - Single category
POST /api/orders            - Create order (validates stock, deducts in transaction)
GET  /api/orders/:id        - Get order with items
```

**Auth Endpoints:**
```
POST /api/auth/login        - JWT login
POST /api/auth/refresh      - Refresh access token
POST /api/auth/logout       - Logout
GET  /api/auth/me           - Get current user (protected)
```

**Protected Admin Endpoints (JWT + Admin Required):**
```
POST /api/products          - Create product (with stock)
PUT  /api/products/:id      - Update product (with stock)
DEL  /api/products/:id      - Soft delete product
POST /api/categories        - Create category
PUT  /api/categories/:id    - Update category
DEL  /api/categories/:id    - Delete category
GET  /api/admin/orders      - List all orders with pagination
GET  /api/admin/orders/:id  - Get order details
PUT  /api/admin/orders/:id/status - Update order status
GET  /api/admin/stats       - Dashboard statistics (includes inventory alerts)
```

## Database Tables
1. `products` - Product catalog (10 columns including `stock`)
2. `product_categories` - Category definitions
3. `users` - Admin users (JWT authentication)
4. `orders` - 21 columns with full order details
5. `order_items` - Order line items
6. `refresh_tokens` - JWT refresh token storage

## Key File Locations
```
Backend:
server/src/db/schema.ts           # Database schema exports
server/src/entities/products.ts   # Products table (has stock column)
server/src/middleware/auth.ts      # JWT auth middleware
server/src/middleware/errorHandler.ts # Global error handler (Zod .issues)
server/src/routes/auth.ts         # Auth endpoints
server/src/routes/admin/stats.ts  # Admin stats (has inventory metrics)
server/src/routes/admin/orders.ts # Admin order management
server/src/routes/products.ts     # Products API (has inStock filter)
server/src/routes/categories.ts   # Categories API (protected)
server/src/routes/orders.ts       # Orders API (has stock validation + tx)
server/src/validators/product.ts  # Product Zod schemas (has stock)
server/src/utils/                 # Utilities (orderTextGenerator)

Frontend:
web/src/routes/admin/dashboard.tsx     # Admin dashboard (has inventory alerts)
web/src/routes/admin/                  # Admin route pages
web/src/sections/admin/ProductForm.tsx # Product form (has stock input)
web/src/sections/admin/ProductsTable.tsx # Products table (has stock column)
web/src/sections/products/ProductDetail/ProductDetail.tsx # Product detail (dynamic stock)
web/src/sections/products/ProductsPage/ProductsPage.tsx   # Products listing (compact hero)
web/src/sections/checkout/CheckoutPage.tsx # Checkout (handles 409 stock errors)
web/src/contexts/AuthContext.tsx  # Auth state management
web/src/contexts/CartContext.tsx  # Cart state (has stock validation)
web/src/services/api.ts          # API client (ApiError has data field)
web/src/services/products.service.ts # Products service (has stock + inStock)
web/src/types/product.ts         # Product type (has stock field)
web/src/components/ui/            # shadcn/ui components
```

## Project Planning Documents
```
BRIEF.md              # Project brief
ROADMAP.md            # Full 7-phase development roadmap
PHASE-1-PLAN.md       # Detailed Phase 1 implementation plan
PHASE-5-PLAN.md       # Detailed Phase 5 implementation plan (created this session)
PHASE-1-SUMMARY.md    # Phase 1 completion summary
PHASE-2-SUMMARY.md    # Phase 2 completion summary
```

## Environment Setup
```bash
# Backend (port 4000)
cd server
yarn install
docker-compose up -d  # PostgreSQL
yarn dev

# Frontend (port 3000)
cd web
yarn install
yarn dev

# Create admin user
cd server && yarn seed:admin
```

</critical_context>

<current_state>

## Git Status
- **Branch**: main (up to date with origin/main)
- **Working tree**: clean (all changes committed)
- **Latest commits**:
  - `3d9f5d8` improve product display (errorHandler fix + compact hero)
  - `31126a8` feat: stock handler (Phase 5 inventory management)

## Phase Completion Status
| Phase | Status | Description |
|-------|--------|-------------|
| Phase 1 | Complete | Products, categories, search/filter |
| Phase 2 | Complete | Cart with localStorage persistence |
| Phase 3 | Complete | Guest checkout, order creation, confirmation |
| Phase 4 | Complete | Admin panel - fully functional |
| Phase 5 | Complete | Inventory management - stock tracking, validation, admin alerts |
| Phase 6 | Not Started | Reports & analytics |
| Phase 7 | Not Started | Production deployment |

## Working Customer Flow
1. Browse products (compact hero, search/filter sidebar)
2. View product details (real stock data, dynamic badges)
3. Add products to cart (stock-capped quantities, blocked if out of stock)
4. Manage cart (quantities capped at available stock)
5. Fill checkout form with validation
6. Submit order (server validates stock, deducts in transaction)
7. View order confirmation with copyable text
8. If stock insufficient at checkout, see detailed error with per-item availability

## Admin Panel - Fully Functional
- **Dashboard**: `/admin/dashboard` — Stats + inventory alerts (out-of-stock, low-stock products)
- **Products**: `/admin/products` — CRUD with stock input field and color-coded stock column
- **Orders**: `/admin/orders` — List, detail, status updates
- **Categories**: `/admin/categories` — CRUD with inline editing

## Important: Existing Products Have Stock = 0
The migration set `stock = 0` for all existing products. An admin needs to update stock values through the admin UI before the store correctly reflects availability.

## Recommended Next Steps
1. **Set stock values** for existing products via admin UI
2. Start **Phase 6: Reports & Analytics** — charts, sales reports, export
3. Or start **Phase 7: Production Deployment** if the store needs to go live
4. Consider wiring the products page FilterSidebar to actual API params (currently UI-only)
5. Consider migrating remaining `brand-*` color tokens in ProductDetail page

## To Test Current Application
```bash
# Terminal 1: Backend
cd server && yarn dev

# Terminal 2: Frontend
cd web && yarn dev

# Open http://localhost:3000 (store)
# Open http://localhost:3000/admin (admin panel)
```

</current_state>
