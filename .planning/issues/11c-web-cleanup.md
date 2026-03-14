# Issue: Phase 11c — Web Structural Cleanup

## Problem Statement

The frontend codebase has accumulated duplication and inconsistencies during rapid development: three separate product card implementations, three pagination implementations (none using the existing component), duplicated API auth patterns, scattered type definitions, unmemoized context values, dead files, and inconsistent form handling. These make it harder to build Phase 11+ features (navigation, filtering, product pages) without compounding the mess.

## Solution

Consolidate duplicated patterns, remove dead code, and fix structural inconsistencies. Each commit is small and leaves the app visually identical (or functionally improved where noted).

## Commits

### Shared constants

1. **Extract `ACCESS_TOKEN_KEY` to a shared constant**
   - The string `'electromundo-access-token'` is defined in three places: `AuthContext.tsx`, `api.ts`, and hardcoded in `products.service.ts`. Create a `constants/auth.ts` file exporting `ACCESS_TOKEN_KEY`. Update all three files to import from there.

### API client consistency

2. **Unify admin API calls to use `authApiRequest`**
   - `DashboardPage`, `OrderDetailPage`, and `admin/orders.tsx` manually call `getAccessToken()` from `AuthContext` and pass the `Authorization` header to `apiRequest`. Replace these with `authApiRequest` which already reads the token from `localStorage`. This removes the unnecessary `AuthContext` dependency from those components.

3. **Refactor `importProductsCSV` to extend `apiRequest` instead of duplicating it**
   - The CSV import function bypasses `apiRequest` entirely because it needs to skip the `Content-Type` header for multipart form data. Instead of reimplementing error handling, add an option to `apiRequest` (e.g., `skipContentType: boolean` or accept a `FormData` body and auto-detect) so the import function can use the shared client. Remove the duplicated error handling and token read.

### Type consolidation

4. **Consolidate `Order` type definitions**
   - The `Order` type is defined in `types/order.ts`, then partially redefined locally in `routes/admin/orders.tsx` and `sections/admin/OrderDetailPage.tsx`. Remove the local definitions and import from `types/order.ts`. Extend the shared type if the admin views need additional fields.

5. **Replace `any` types with proper types**
   - Change `err: any` in `LoginForm.tsx` to use `ApiError` from the API service (with an `instanceof` check). Change `public data?: any` in the `ApiError` class in `api.ts` to `unknown`. These are the only two `any` types in the codebase.

### Shared product card

6. **Extract a shared `ProductCard` component**
   - Three components render product cards with duplicated logic (image placeholder, `toTitleCase`, `formatPrice`, hover animation): the home page `ProductCard`, `ProductGridCard`, and the inline card in `RelatedProducts`. Extract a single `components/ProductCard.tsx` that handles the common rendering. Replace all three usages. The grid/list dual-mode in `ProductGridCard` can remain as two separate components (`ProductCard` for grid, `ProductListItem` for list).

7. **Remove duplicated `formatPrice` from `ProductGridCard`**
   - `ProductGridCard` reimplements `formatPrice` using `new Intl.NumberFormat(...)` instead of importing the shared utility from `utils/`. Delete the local implementation and import the shared one. (This may be absorbed into commit 6 if the shared card handles formatting internally.)

### Shared UI patterns

8. **Extract a `PageBreadcrumb` component**
   - The identical breadcrumb structure (wrapper + list + items + separator using the existing Radix breadcrumb primitives) is copy-pasted across `CartPage`, `CheckoutPage`, `ProductDetail`, and `OrderConfirmationPage`. Extract a `components/PageBreadcrumb.tsx` that accepts an `items` array of `{ label, href? }` and renders the breadcrumb. Replace all four usages.

9. **Extract `AdminLoadingState` and `AdminErrorState` components**
   - All admin pages implement their own loading and error states with similar inline markup. Extract two small components in `components/admin/` that standardize this pattern. Replace the inline implementations in `DashboardPage`, `OrderDetailPage`, `orders.tsx`, `CategoriesPage`, `BannersPage`, and `products.index.tsx`.

10. **Use the existing `Pagination` component in admin pages**
    - Admin products (`products.index.tsx`) and admin orders (`orders.tsx`) implement pagination from scratch with inline JSX. Refactor them to use the existing `components/ui/pagination.tsx` Radix component. Adapt the component's props if needed to accept `currentPage`, `totalPages`, and an `onPageChange` callback.

### Context memoization

11. **Memoize `CartContext` value object**
    - The `CartContext.Provider` value is constructed inline without `useMemo`, causing all cart consumers to re-render on every provider render. Wrap the value in `useMemo` with the correct dependency array (items, totalItems, subtotal, and the callback functions). Follow the same pattern already used in `AuthContext`.

### Routing fixes

12. **Replace admin index redirect with `beforeLoad` redirect**
    - `routes/admin/index.tsx` uses `useEffect` + `navigate` to redirect to `/admin/dashboard`, which causes a flash of empty content. Replace with TanStack Router's `redirect` in the route's `beforeLoad` function for an instant redirect.

### Dead code removal

13. **Delete `app.tsx`**
    - The file at `web/src/app.tsx` is never imported anywhere. The actual app root is `routes/__root.tsx`. Delete the dead file.

14. **Remove non-functional "Remember me" checkbox from `LoginForm`**
    - The checkbox renders but its value is never read or used. Remove it entirely rather than leaving a non-functional UI element. If "Remember me" is needed in the future, it should be implemented properly (e.g., controlling token persistence strategy).

15. **Remove `useProducts` hook or adopt it consistently**
    - `hooks/useProducts.ts` is the only custom query hook. Other pages write their queries inline. Either delete the hook and inline its query (consistent with the rest of the codebase), or adopt the hook pattern for all product queries. The simpler choice is to keep the hook since it's already used, but document the convention. No new hooks need to be created in this issue.

## Decision Document

- **Product card unification (commit 6):** The shared `ProductCard` will handle: image (with placeholder fallback), title (with `toTitleCase`), price (with `formatPrice`), and optional hover animation. It will accept a `product` prop matching the existing `Product` type. The grid/list split for the products page will use two components: `ProductCard` (grid) and `ProductListItem` (list). The home page and related products section will use `ProductCard`.
- **API client extension (commit 3):** The `apiRequest` function will detect `FormData` body and automatically skip setting `Content-Type`, letting the browser set the multipart boundary. No new parameter needed — just a `body instanceof FormData` check.
- **Pagination component (commit 10):** The existing `components/ui/pagination.tsx` may need to be extended with an `onPageChange` callback prop. The current Radix-based component is presentational — it may need a thin wrapper that adds the state management. Evaluate during implementation.
- **`useProducts` hook (commit 15):** Keep the hook. It's a good pattern. Don't force-create hooks for other entities in this issue — that can happen organically as features are built.
- **Form handling inconsistency:** Noted but intentionally out of scope. Migrating all forms to `react-hook-form` is a larger effort that should be its own issue if pursued.

## Testing Decisions

- No automated tests. Each change will be verified by:
  - Running `npm run build` to confirm no build errors
  - Visually checking affected pages in the browser (home, products, cart, checkout, order confirmation, all admin pages)
  - Confirming no console errors
- Good tests for this area would be: component tests for `ProductCard`, `PageBreadcrumb`, and `Pagination` rendering with various props. Prior art: none exists. Out of scope for this issue.

## Out of Scope

- Migrating all forms to `react-hook-form` (significant scope, separate issue)
- Creating a product edit admin route (feature work)
- Redesigning the storefront pagination for `ProductsPage` (that's in the bug fix issue for functionality, and Phase 12 for design)
- Centralizing TanStack Query keys into a `queryKeys` factory (good practice but not a structural problem yet)
- Fixing the `checkoutMachine.ts` error typing (works correctly, just uses a type assertion)
- Defining the undefined `brand-*` Tailwind colors (covered in bug fix issue)

## Further Notes

Commits 1-5 are low-risk internal refactors with no visual changes. Commits 6-10 change component structure but should produce identical rendered output. Commits 11-12 are behavioral improvements. Commits 13-15 are pure deletions. The safest order is to work through them in the listed order, but they are mostly independent.
