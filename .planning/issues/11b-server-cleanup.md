# Issue: Phase 11b — Server Structural Cleanup

## Problem Statement

The server codebase was built quickly and has accumulated inconsistencies across its layers: duplicated validators, inconsistent response envelopes, repeated pagination logic, non-atomic token rotation, untyped order statuses, and dead code. These issues make the codebase harder to extend and increase the risk of bugs when adding new features (like Phase 11's navigation and filtering).

## Solution

Systematically clean up the server architecture in small, safe commits. Each commit addresses one concern and leaves the API behavior unchanged (same responses, same status codes) unless explicitly noted.

## Commits

### Shared validators

1. **Extract `idParamSchema` to a shared validators file**
   - Create a `validators/common.ts` file with the `idParamSchema` definition. Update `validators/product.ts`, `validators/category.ts`, and `validators/banner.ts` to import from `common.ts` instead of defining their own. No behavior change.

2. **Use `idParamSchema` in orders controllers**
   - Replace the manual `parseInt` + `isNaN` ID parsing in `orders.controller.ts` and `admin/orders.controller.ts` with `idParamSchema.parse(req.params)` from the shared validators. This makes all controllers use the same pattern. The error message changes from a manual `BadRequestError` to a Zod validation error caught by the error handler — same 400 status code, slightly different error shape.

3. **Add Zod schemas for query parameter validation**
   - Create query param schemas (page, limit, search, sort, etc.) in `validators/common.ts`. Apply them in `products.controller.ts` and `admin/orders.controller.ts` to replace the manual `parseInt` / type-cast parsing of `req.query`. Invalid query params will now return 400 instead of silently falling back to defaults.

### Response envelope consistency

4. **Wrap auth responses in `{ data: ... }` envelope**
   - Update `auth.controller.ts` so login and refresh responses follow the `{ data: { accessToken, refreshToken, user } }` convention. This is a breaking change for API consumers — the frontend auth service will need to be updated to unwrap the response.

5. **Wrap paginated list responses in `{ data: ... }` envelope**
   - Update `products.controller.ts` list and `admin/orders.controller.ts` list to return `{ data: { items, pagination, filters } }` instead of the flat structure. Update the frontend services that consume these endpoints.

6. **Wrap import response in `{ data: ... }` envelope**
   - Update `admin/importProducts.controller.ts` to wrap its response. Update the frontend import handler.

### Deduplication

7. **Extract a shared pagination helper**
   - Create a `utils/pagination.ts` helper that accepts a Drizzle query builder, conditions array, and pagination params, and returns `{ items, pagination }`. Refactor `products.service.ts` and `admin/orders.service.ts` to use it. The pagination shape (totalPages, hasNext, hasPrev, etc.) becomes consistent by construction.

8. **Consolidate `getOrderById` into a single shared function**
   - The function exists nearly identically in `orders.service.ts` and `admin/orders.service.ts`. Extract it to a shared location (e.g., `services/orders.service.ts` exports it, admin service imports it) or to a new `services/shared/orders.ts`. Remove the duplicate.

9. **Derive `updateProductSchema` from `createProductSchema`**
   - In `validators/product.ts`, replace the manually-maintained `updateProductSchema` with `createProductSchema.partial()`. This ensures any field added to create is automatically available as optional in update.

### Transaction safety

10. **Wrap refresh token rotation in a database transaction**
    - In `auth.service.ts`, the `refreshToken` function deletes the old token and inserts the new one as two separate queries. Wrap these in `db.transaction()` so that if the insert fails, the delete is rolled back and the user's session is preserved.

### Type safety improvements

11. **Define order status as a Zod enum and TypeScript union**
    - Replace the `VALID_STATUSES` array in `admin/orders.service.ts` with a Zod enum in `validators/order.ts`. Export the inferred TypeScript type. Use it in the service's `updateOrderStatus` function parameter type instead of `string`. The database column remains `varchar` (no migration needed), but the application layer is now type-safe.

12. **Import `CreateOrderInput` type from validators in orders service**
    - The orders service defines its own `CreateOrderInput` interface locally. Replace it with `z.infer<typeof CreateOrderSchema>` imported from `validators/order.ts`. Delete the local type definition.

### Dead code removal

13. **Remove `jwtRefreshSecret` from config**
    - The `jwtRefreshSecret` field is defined in `config.ts` but never used anywhere (refresh tokens are opaque random strings, not JWTs). Remove the config key and the corresponding env var documentation.

14. **Remove unused dependencies from server `package.json`**
    - `@tanstack/react-query`, `whatsapp-web.js`, and `qrcode-terminal` are listed as dependencies but never imported in server source code. Remove them and run `npm install` to update the lockfile.

### Database integrity

15. **Add foreign key reference for `parentCategoryId`**
    - In the `productCategories` entity, add `.references(() => productCategoriesTable.id)` to the `parentCategoryId` column definition. Generate and push the migration. The application-level `validateParentCategory` function already prevents invalid parents, but this adds a database-level guarantee against circular references to deleted parents.

## Decision Document

- **Response envelope changes (commits 4-6):** These are breaking API changes. The frontend must be updated in the same commit or immediately after. Since both server and web are in the same monorepo and deployed together, this is safe. No external API consumers exist.
- **Query param validation (commit 3):** Changes behavior from "silently default" to "return 400 on invalid input". This is intentionally stricter. The frontend always sends valid params, so this only affects direct API callers sending garbage.
- **Pagination helper (commit 7):** The helper will use Drizzle's query builder API. It will accept a table, conditions array, orderBy clause, and pagination params. It returns a standardized shape. Services pass their specific conditions and the helper handles count + offset/limit.
- **`parentCategoryId` FK (commit 15):** This requires a migration. Existing data must be valid (no orphaned references) before the FK can be applied. Run a check query first.
- **`updatedAt` manual setting:** Considered adding a Drizzle `$onUpdate` hook or a shared helper, but decided to leave this out of scope. It works correctly today and `$onUpdate` support in Drizzle is still evolving. Can revisit later.

## Testing Decisions

- No automated tests. Each change will be verified by:
  - Running `npx tsc --noEmit` to confirm type safety
  - Testing affected API endpoints manually
  - Running the frontend against the updated API to verify integration
- Good tests for this area would be: integration tests for each endpoint (send request, assert response shape and status code). Prior art: none exists yet. Out of scope for this issue.

## Out of Scope

- Adding automated server tests
- Changing `updatedAt` to auto-update (works correctly with manual approach)
- Migrating order `status` from `varchar` to a database-level enum (application-level enum is sufficient)
- Restructuring admin routes (moving product admin routes under `/api/admin/products`)
- Optimizing the stats service queries (combining per-status counts into one `GROUP BY`)
- CSV parsing extraction from import service (works fine as-is)

## Further Notes

Commits 4-6 (response envelope) must be coordinated with frontend updates. The simplest approach is to update the server response and the frontend service call in the same commit. All other commits are purely server-side and independent of each other.
