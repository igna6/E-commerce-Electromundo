# Phase 7 Implementation Plan: Production Deployment

**Project**: E-commerce Electromundo
**Phase**: 7 of 7
**Focus**: Production Readiness & Deployment
**Status**: NOT STARTED

---

<objective>
Prepare the application for production deployment: harden security, add structured logging, optimize database performance, configure environment-aware settings, add SEO meta tags, and deploy to Heroku (backend) + Netlify (frontend).
</objective>

<execution_context>
Files to load before executing:
- `server/src/app.ts` — Express app setup (middleware chain)
- `server/src/config/config.ts` — Environment config with defaults
- `server/src/db/db.ts` — Database connection (no pooling, no SSL)
- `server/src/middleware/errorHandler.ts` — Error handler (console.error only)
- `server/src/middleware/auth.ts` — JWT auth middleware
- `server/src/routes/products.ts` — Product routes (needs indexes for filters)
- `server/src/routes/orders.ts` — Order routes (needs indexes for queries)
- `server/src/routes/admin/stats.ts` — Admin stats (needs indexes)
- `server/src/entities/products.ts` — Products schema (missing indexes)
- `server/src/entities/orders.ts` — Orders schema (missing indexes)
- `web/src/constants/config.ts` — Hardcoded API_URL `http://localhost:9000`
- `web/src/routes/__root.tsx` — Root route (minimal meta tags)
- `web/vite.config.ts` — Vite config (Netlify plugin present)
- `web/netlify.toml` — Netlify deployment config
- `server/package.json` — Server dependencies
- `web/package.json` — Web dependencies
- `docker-compose.yml` — Local PostgreSQL only
</execution_context>

<context>
- Backend: Express.js 5.2.1 + Drizzle ORM + PostgreSQL, running on port 9000
- Frontend: React 19 + TanStack Start + Vite 7, configured for Netlify deployment
- Security: Only CORS (unrestricted) and JWT auth exist. No helmet, rate limiting, or compression.
- Database: Direct connection, no pooling, SSL disabled. No indexes beyond PKs/FKs/unique.
- Logging: Only `console.log`/`console.error` (30 total across codebase).
- SEO: Only charset, viewport, and title "ElectroMundo". No OG tags, description, or sitemap.
- Deployment: docker-compose.yml for local PostgreSQL + netlify.toml for frontend. No backend deployment config.
- Frontend API URL hardcoded to `http://localhost:9000` in `web/src/constants/config.ts`.
- All user-facing text is in Spanish.
- Prices stored as integers (cents), currency ARS.
</context>

---

## Task Breakdown

<tasks>

### GROUP 1: Backend — Security Hardening

#### Task 1.1: Install and configure Helmet.js
**Type**: auto
**File**: `server/src/app.ts`, `server/package.json`
**Changes**:
- Install `helmet` package
- Add `app.use(helmet())` before route registration
- Configure Content-Security-Policy if needed (allow image URLs from external sources since products use URL-based images)

**Verification**:
- [ ] Security headers present in responses (X-Content-Type-Options, X-Frame-Options, etc.)
- [ ] Product images from external URLs still load correctly

---

#### Task 1.2: Add rate limiting
**Type**: auto
**File**: `server/src/app.ts`, `server/package.json`
**Changes**:
- Install `express-rate-limit`
- Add general rate limiter: 100 requests per 15 minutes per IP
- Add stricter rate limiter for auth routes: 10 attempts per 15 minutes per IP
- Apply general limiter globally, auth limiter to `/api/auth/login` and `/api/auth/refresh`

**Verification**:
- [ ] Normal browsing works without hitting limits
- [ ] Rapid requests to login endpoint get 429 response
- [ ] Rate limit headers present (X-RateLimit-Limit, X-RateLimit-Remaining)

---

#### Task 1.3: Restrict CORS to allowed origins
**Type**: auto
**File**: `server/src/app.ts`, `server/src/config/config.ts`
**Changes**:
- Add `CORS_ORIGIN` to config (env var, default: `http://localhost:3000` for dev)
- Replace `app.use(cors())` with `app.use(cors({ origin: config.corsOrigin, credentials: true }))`
- Support comma-separated origins for multiple allowed domains

**Verification**:
- [ ] Local development still works (localhost:3000 → localhost:9000)
- [ ] Requests from unauthorized origins are rejected
- [ ] Production domain will be allowed when configured

---

#### Task 1.4: Add compression middleware
**Type**: auto
**File**: `server/src/app.ts`, `server/package.json`
**Changes**:
- Install `compression`
- Add `app.use(compression())` before routes
- Only compress responses > 1KB (default threshold)

**Verification**:
- [ ] Response headers include `Content-Encoding: gzip` for large responses
- [ ] API responses are smaller in size
- [ ] No issues with JSON parsing on frontend

---

### GROUP 2: Backend — Logging & Error Handling

#### Task 2.1: Add structured request logging with Morgan
**Type**: auto
**File**: `server/src/app.ts`, `server/package.json`
**Changes**:
- Install `morgan` and `@types/morgan`
- Add `app.use(morgan('combined'))` for production, `app.use(morgan('dev'))` for development
- Use `config.nodeEnv` to switch between formats

**Verification**:
- [ ] Requests are logged with method, URL, status, response time
- [ ] Development shows colorized concise output
- [ ] Production shows full Apache combined format

---

#### Task 2.2: Improve error handler for production
**Type**: auto
**File**: `server/src/middleware/errorHandler.ts`
**Changes**:
- In production: don't expose error details in response (only return generic message + error code)
- In development: keep full error details for debugging
- Replace `console.error` with structured log format: `[ERROR] ${timestamp} ${method} ${url} - ${message}`
- Add handling for common error types: 404 (not found), 400 (bad request), 401 (unauthorized), 403 (forbidden), 409 (conflict)

**Verification**:
- [ ] Development mode shows full error details
- [ ] Production mode returns generic error messages
- [ ] Zod validation errors still return detailed field-level messages (safe to expose)
- [ ] Errors are logged with timestamps and request context

---

#### Task 2.3: Add health check endpoint
**Type**: auto
**File**: `server/src/routes/health.ts`, `server/src/app.ts`
**Changes**:
- Create GET `/api/health` endpoint
- Returns `{ status: 'ok', timestamp: Date.now(), uptime: process.uptime() }`
- Optionally check database connectivity (try a simple `SELECT 1`)
- Do not require authentication

**Verification**:
- [ ] GET /api/health returns 200 with status info
- [ ] Endpoint works without authentication
- [ ] Reports database connectivity status

---

### GROUP 3: Backend — Database Production Configuration

#### Task 3.1: Add database connection pooling and SSL support
**Type**: auto
**File**: `server/src/db/db.ts`, `server/src/config/config.ts`
**Changes**:
- Add `DATABASE_SSL` env var to config (default: `false` for dev, should be `true` in production)
- Configure SSL: `ssl: config.databaseSsl ? { rejectUnauthorized: false } : false`
- Note: Drizzle with `connection` config uses pg internally with default pooling. If using `DATABASE_URL` as a connection string, switch to URL-based connection for production hosts (Neon, Supabase, Railway provide connection strings)
- Add `DATABASE_URL` support as a full connection string (takes precedence when set to a full postgres:// URL)

**Verification**:
- [ ] Local development still works with SSL disabled
- [ ] Production can connect via SSL
- [ ] Connection string (DATABASE_URL) mode works for managed PostgreSQL

---

#### Task 3.2: Add database indexes for common queries
**Type**: auto
**File**: `server/src/entities/products.ts`, `server/src/entities/orders.ts`, new migration
**Changes**:
- Add indexes to products table:
  - `idx_products_category` on `category` (foreign key lookups)
  - `idx_products_deleted_at` on `deletedAt` (soft delete filtering, used in every query)
  - `idx_products_stock` on `stock` (stock filtering, inventory alerts)
- Add indexes to orders table:
  - `idx_orders_status` on `status` (filtering by status in admin)
  - `idx_orders_created_at` on `createdAt` (sorting, date filtering)
- Add indexes to order_items table:
  - `idx_order_items_order_id` on `orderId` (join queries)
  - `idx_order_items_product_id` on `productId` (join queries)
- Generate and apply migration via `drizzle-kit generate` + `drizzle-kit push`

**Verification**:
- [ ] Indexes exist in database (check with `\di` in psql)
- [ ] Query performance unchanged or improved
- [ ] No migration errors

---

### GROUP 4: Backend — Environment & Deployment Config

#### Task 4.1: Create .env.example with all variables documented
**Type**: auto
**File**: `server/.env.example`
**Changes**:
- Create `.env.example` with all required and optional environment variables
- Include descriptions as comments
- Include sane defaults for development
- List which variables are required in production

```env
# Server
PORT=9000
NODE_ENV=development  # development | production

# Database
DATABASE_URL=          # Full connection string (overrides individual fields below)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=root
DATABASE_PASSWORD=root
DATABASE_NAME=electromundo
DATABASE_SSL=false     # Set to true for production managed databases

# JWT Authentication
JWT_SECRET=            # REQUIRED: Generate with `openssl rand -hex 32`
JWT_REFRESH_SECRET=    # REQUIRED: Generate with `openssl rand -hex 32`
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000  # Comma-separated for multiple origins
```

**Verification**:
- [ ] All environment variables used in config.ts are documented
- [ ] Comments explain purpose and required values

---

#### Task 4.2: Add production build script and start command
**Type**: auto
**File**: `server/package.json`, `server/tsconfig.json`
**Changes**:
- Verify `"build": "tsc"` outputs to `dist/` folder
- Add `"start": "node dist/app.js"` script for production
- Ensure tsconfig has `"outDir": "./dist"` configured
- Add `"clean": "rm -rf dist"` script

**Verification**:
- [ ] `yarn build` compiles TypeScript to dist/
- [ ] `yarn start` runs the compiled app
- [ ] Production app starts without ts-node dependency

---

#### Task 4.3: Create Procfile and Heroku configuration for backend
**Type**: auto
**File**: `server/Procfile`, `server/package.json`
**Changes**:
- Create `Procfile` in `server/` with: `web: node dist/app.js`
- Ensure `package.json` has `"engines": { "node": "20.x" }` for Heroku's Node.js buildpack
- Add `"heroku-postbuild": "yarn build"` script so Heroku compiles TypeScript on deploy
- Ensure the server reads `PORT` from `process.env.PORT` (Heroku assigns a dynamic port) — already handled in config.ts
- Heroku provides `DATABASE_URL` as a full postgres:// connection string (from Heroku Postgres addon), so Task 3.1's DATABASE_URL support is critical

**Verification**:
- [ ] `Procfile` exists with correct web process
- [ ] `heroku-postbuild` script compiles TypeScript
- [ ] Server binds to `process.env.PORT` (Heroku requirement)
- [ ] App uses `DATABASE_URL` connection string from Heroku Postgres

---

#### Task 4.4: Configure Heroku Postgres addon and migration strategy
**Type**: manual (requires Heroku CLI)
**File**: `DEPLOYMENT.md` (documented), `server/package.json`
**Changes**:
- Document Heroku Postgres addon setup (`heroku addons:create heroku-postgresql:essential-0`)
- Heroku automatically sets `DATABASE_URL` env var when addon is provisioned
- Add `"migrate": "drizzle-kit push"` script to package.json for running migrations
- Document post-deploy steps: run migrations (`heroku run yarn migrate`), seed admin (`heroku run yarn seed:admin`)
- Note: Heroku Postgres requires SSL — Task 3.1's SSL support handles this

**Verification**:
- [ ] DATABASE_URL is auto-set by Heroku Postgres addon
- [ ] Migrations can run via `heroku run yarn migrate`
- [ ] Admin user can be seeded via `heroku run yarn seed:admin`

---

### GROUP 5: Frontend — Environment Configuration

#### Task 5.1: Make API URL environment-aware
**Type**: auto
**File**: `web/src/constants/config.ts`, `web/.env`, `web/.env.example`
**Changes**:
- Replace hardcoded `http://localhost:9000` with `import.meta.env.VITE_API_URL || 'http://localhost:9000'`
- Create `web/.env` with `VITE_API_URL=http://localhost:9000`
- Create `web/.env.example` with documentation
- Ensure `.env` is in `.gitignore`

**Verification**:
- [ ] Local development works with default URL
- [ ] Setting `VITE_API_URL` changes the API target
- [ ] Build uses the env var at build time (Vite inlines it)

---

### GROUP 6: Frontend — SEO & Meta Tags

#### Task 6.1: Add global meta tags and Open Graph defaults
**Type**: auto
**File**: `web/src/routes/__root.tsx`
**Changes**:
- Add meta description: "ElectroMundo - Tu tienda online de electrónica. Los mejores productos tecnológicos con envío a todo el país."
- Add Open Graph tags: og:title, og:description, og:type (website), og:site_name
- Add Twitter Card tags: twitter:card (summary_large_image)
- Add theme-color meta tag
- Add lang="es" to HTML

**Verification**:
- [ ] Meta tags visible in page source
- [ ] Social media link previews show title and description
- [ ] Page language is declared as Spanish

---

#### Task 6.2: Add dynamic page titles
**Type**: auto
**Files**: Key route files
**Changes**:
- Products page: "Productos | ElectroMundo"
- Product detail: "{product.name} | ElectroMundo"
- Cart: "Carrito | ElectroMundo"
- Checkout: "Checkout | ElectroMundo"
- Admin dashboard: "Panel de Administración | ElectroMundo"
- Use TanStack Router's `head` function on each route or `useHead()` in page components

**Verification**:
- [ ] Each page shows a unique, descriptive title in the browser tab
- [ ] Admin pages have admin-specific titles
- [ ] Product detail shows actual product name

---

#### Task 6.3: Add robots.txt and favicon
**Type**: auto
**File**: `web/public/robots.txt`, verify favicon in `web/public/`
**Changes**:
- Create `robots.txt` allowing all crawlers except admin paths:
  ```
  User-agent: *
  Allow: /
  Disallow: /admin
  ```
- Verify favicon.ico exists in public/ (if not, note for user to add one)
- Add favicon link in root head if missing

**Verification**:
- [ ] /robots.txt is accessible
- [ ] Admin routes are disallowed for crawlers
- [ ] Favicon displays in browser tab

---

### GROUP 7: Frontend — Performance Optimization

#### Task 7.1: Remove console.log statements from production code
**Type**: auto
**Files**: All frontend source files with console statements
**Changes**:
- Remove or replace `console.log`/`console.error` in:
  - `web/src/sections/checkout/CheckoutPage.tsx` (1 console.error)
  - `web/src/sections/order-confirmation/OrderConfirmationPage.tsx` (2 console.error)
  - `web/src/contexts/CartContext.tsx` (2 console.error)
- Keep console.error for genuinely unexpected errors but wrap in `if (import.meta.env.DEV)` guard

**Verification**:
- [ ] No console statements run in production build
- [ ] Development still shows useful debug info

---

### GROUP 8: Deployment Documentation

#### Task 8.1: Create deployment documentation
**Type**: auto
**File**: `DEPLOYMENT.md`
**Changes**:
- Document the full deployment process:
  1. **Prerequisites**: Node.js, Heroku CLI, Netlify account
  2. **Backend deployment (Heroku)**:
     - Create Heroku app (`heroku create electromundo-api`)
     - Add Heroku Postgres addon (`heroku addons:create heroku-postgresql:essential-0`)
     - Set environment variables (`heroku config:set NODE_ENV=production JWT_SECRET=... JWT_REFRESH_SECRET=... CORS_ORIGIN=https://your-netlify-domain.netlify.app`)
     - Deploy via Git (`git subtree push --prefix server heroku main`) or Heroku GitHub integration
     - Run migrations (`heroku run yarn migrate`)
     - Seed admin user (`heroku run yarn seed:admin`)
  3. **Frontend deployment (Netlify)**: Already configured via netlify.toml
     - Set `VITE_API_URL` env var in Netlify dashboard to Heroku app URL
  4. **Post-deployment steps**: Set product stock values via admin UI, verify health check
  5. **Monitoring**: Health check endpoint (`/api/health`) for uptime monitoring (UptimeRobot, etc.)

**Verification**:
- [ ] A developer can follow the doc to deploy from scratch
- [ ] All environment variables are listed
- [ ] Database setup is documented

---

</tasks>

<verification>

### Backend Security Verification
- [ ] Helmet.js security headers present in all responses
- [ ] Rate limiting active (429 on excessive requests)
- [ ] CORS restricted to configured origins
- [ ] Compression active for large responses
- [ ] No error details leaked in production mode

### Backend Infrastructure Verification
- [ ] Health check endpoint responds at /api/health
- [ ] Request logging works (Morgan)
- [ ] Database connects with SSL in production config
- [ ] Database indexes exist for common query patterns
- [ ] Backend builds and runs from compiled JavaScript (no ts-node in prod)
- [ ] Procfile correctly starts the web process

### Frontend Verification
- [ ] API URL reads from environment variable
- [ ] Meta tags present (description, Open Graph, Twitter Card)
- [ ] Dynamic page titles on each route
- [ ] No console.log in production build
- [ ] robots.txt accessible at /robots.txt

### Deployment Verification
- [ ] .env.example files exist for both server/ and web/
- [ ] Production build works: `cd server && yarn build && yarn start`
- [ ] Procfile present and correct for Heroku
- [ ] Heroku Postgres addon documented with migration steps
- [ ] Deployment documentation is complete and accurate

</verification>

<success_criteria>
- Application is production-deployable with a single configuration change (environment variables)
- Security headers protect against common web vulnerabilities (XSS, clickjacking, MIME sniffing)
- Rate limiting prevents brute-force attacks on authentication
- Database has proper indexes for all common query patterns
- Structured logging replaces all console.log usage
- SEO meta tags enable proper social sharing and search indexing
- Deployment documentation enables any developer to deploy from scratch
- Heroku Procfile and build scripts enable straightforward deployment via `git push`
- Health check endpoint enables uptime monitoring
</success_criteria>

---

## Implementation Order

**Recommended sequence**: Infrastructure first, then security, then optimization, then deployment

1. **Tasks 1.1-1.4**: Security middleware (helmet, rate limit, CORS, compression)
2. **Tasks 2.1-2.3**: Logging, error handling, health check
3. **Tasks 3.1-3.2**: Database SSL/pooling, indexes
4. **Tasks 4.1-4.4**: Environment config, build scripts, Docker
5. **Task 5.1**: Frontend environment configuration
6. **Tasks 6.1-6.3**: SEO meta tags, robots.txt
7. **Task 7.1**: Remove console.logs
8. **Task 8.1**: Deployment documentation

**Estimated files to modify**: ~15 files
**New files**: ~6 (Procfile, .env.example x2, robots.txt, health route, DEPLOYMENT.md)

## Dependencies

```
GROUP 1 (Security) ──→ no dependencies, start here
GROUP 2 (Logging)  ──→ no dependencies, can parallel with GROUP 1
GROUP 3 (Database) ──→ no dependencies, can parallel with GROUP 1-2
GROUP 4 (Deploy Config) ──→ depends on GROUP 1-3 (needs final app.ts state)
GROUP 5 (Frontend Env) ──→ no dependencies
GROUP 6 (SEO)      ──→ no dependencies, can parallel with GROUP 5
GROUP 7 (Cleanup)  ──→ no dependencies, can do anytime
GROUP 8 (Docs)     ──→ depends on all other groups (documents final state)
```
