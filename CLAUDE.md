# Electromundo E-commerce

Monorepo with `server/` (API) and `web/` (frontend).

## Quick Commands

```bash
# Server
cd server && npm run dev          # Start API on :9000
cd server && npx tsc --noEmit     # Type check
cd server && npx drizzle-kit generate  # Generate migration
cd server && npx drizzle-kit push      # Push schema to DB
cd server && npm run seed:admin        # Seed admin user

# Web
cd web && npm run dev             # Start frontend on :3000
cd web && npm run build           # Production build
cd web && npm run test            # Run vitest
cd web && npm run check           # Prettier + ESLint fix
```

## Server Architecture

```
server/src/
├── routes/          → Route definitions only (path + middleware + controller wiring)
├── controllers/     → HTTP layer: parse request, validate with Zod, call service, send response
├── services/        → Business logic + database queries (Drizzle ORM)
├── entities/        → Drizzle table definitions
├── validators/      → Zod schemas for input validation
├── middleware/       → auth (JWT), errorHandler (ZodError + AppError)
├── config/          → Environment config
├── db/              → Database connection + schema re-exports
└── utils/           → Helpers (errors.ts, orderTextGenerator.ts)
```

**Flow:** Route → Controller → Service → DB

- **Routes** only wire HTTP methods to controllers with middleware. No logic.
- **Controllers** parse/validate input, call services, format HTTP responses. No direct DB access.
- **Services** contain all business logic and Drizzle queries. Throw `AppError` subclasses for error cases.
- **Error handling:** Services throw `NotFoundError`, `BadRequestError`, `ConflictError`, `UnauthorizedError`. The `errorHandler` middleware catches these and `ZodError` to return proper status codes.

### Admin routes

Admin routes live under `/api/admin` and are protected by `authenticateToken + requireAdmin` middleware at the router level in `app.ts`. Controllers and services for admin are in `controllers/admin/` and `services/admin/`.

## Web Architecture

```
web/src/
├── routes/          → TanStack Router file-based routes
├── sections/        → Page-level components
├── components/      → Reusable UI (+ /ui for Shadcn/Radix primitives)
├── services/        → API client (apiRequest, authApiRequest)
├── contexts/        → AuthContext, CartContext
├── hooks/           → Custom React hooks
├── types/           → TypeScript types
├── constants/       → Config values
└── utils/           → Helpers
```

- **Routing:** TanStack Router with file-based routing. Route files are in `web/src/routes/`.
- **State:** TanStack Query for server state, React Context for auth + cart (cart persisted in localStorage).
- **UI:** Radix UI + Tailwind CSS. Shadcn-style components in `components/ui/`.
- **Path alias:** `@/*` maps to `./src/*`.

## Tech Stack

| Layer            | Tech                          |
| ---------------- | ----------------------------- |
| Server framework | Express 5                     |
| Language         | TypeScript (strict)           |
| Database         | PostgreSQL                    |
| ORM              | Drizzle ORM                   |
| Validation       | Zod                           |
| Auth             | JWT + bcrypt + refresh tokens |
| Frontend         | React 19 + TanStack Start     |
| Styling          | Tailwind CSS 3                |
| Build            | Vite 7                        |

## Key Conventions

- **TypeScript strict mode** with `exactOptionalPropertyTypes: true` and `noUncheckedIndexedAccess: true` on server. When defining optional properties that will receive values from `req.query` or Zod output, use `prop?: Type | undefined`.
- **Soft deletes** everywhere: `deletedAt` column. All queries must filter `isNull(table.deletedAt)`.
- **Prices in cents** (integer). Format with `/ 100` for display.
- **Tax rate** 21% (Argentina IVA). Applied in `orders.service.ts`.
- **Consistent response format:** `{ data: ... }` for success, `{ error: string, details?: any }` for errors.
- **File naming:** `*.service.ts`, `*.controller.ts`, `*.routes.ts` for server layers. PascalCase for React components.
- **Spanish UI text** in error messages for customer-facing content. English for internal/admin.

## Database

- Schema defined in `server/src/entities/` (individual table files) and re-exported from `server/src/db/schema.ts`.
- Migrations: `server/drizzle/` (managed by drizzle-kit).
- Tables: `users`, `refresh_tokens`, `product_categories`, `products`, `orders`, `order_items`.

## Environment Variables

Server expects `.env` in `server/`:

```
DATABASE_HOST, DATABASE_PORT, DATABASE_USER, DATABASE_PASSWORD, DATABASE_NAME
JWT_SECRET, JWT_REFRESH_SECRET, JWT_EXPIRES_IN, JWT_REFRESH_EXPIRES_IN
PORT (default 9000)
```

Web expects `API_URL` (default `http://localhost:9000`).
