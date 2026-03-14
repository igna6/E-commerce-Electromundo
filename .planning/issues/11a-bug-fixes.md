# Issue: Phase 11a — Bug Fixes

## Problem Statement

Several bugs exist across the server and frontend that affect functionality, security, and visual rendering. These were introduced during the rush to ship v0.8 and need to be fixed before any structural improvements, as they affect real user experience.

## Solution

Fix all identified bugs in small, isolated commits. Each fix is independent and leaves the codebase working.

## Commits

### Server bugs

1. **Add `deletedAt` filter to `updateOrderStatus` query**
   - In the admin orders service, the `updateOrderStatus` function updates orders without checking `isNull(ordersTable.deletedAt)`. Add the filter to the WHERE clause so soft-deleted orders cannot have their status changed. Verify the neighboring `getOrderById` call already filters correctly (it does — this is just the update query).

2. **Add `deletedAt` filter to per-status count queries in stats service**
   - The stats service runs ~14 queries in `Promise.all`. The total orders count correctly filters `isNull(ordersTable.deletedAt)`, but the 5 per-status count queries (pending, confirmed, shipped, delivered, cancelled) do not. Add the `isNull` condition to each per-status query so the numbers are consistent with the total.

3. **Add authentication to `GET /api/orders/:id`**
   - Currently this endpoint has no auth middleware, meaning anyone who guesses an order ID can retrieve full customer details (name, email, phone, address). Decide on the appropriate protection: either require the user to be authenticated, or add a lookup token/hash that's returned at order creation time. For now, the simplest fix is to keep it accessible for guest checkout confirmation (the order confirmation page needs it) but add a non-guessable lookup mechanism — or at minimum, document this as a known trade-off. **Decision needed: discuss with the team whether to add auth or an order access token.**

### Frontend bugs

4. **Add `onClick` handlers to pagination page buttons in `ProductsPage`**
   - The pagination section in `ProductsPage` renders numbered page buttons, but they have no `onClick` handlers — the page is always stuck at 1. Wire the buttons to update the `page` state variable so users can actually navigate through product pages.

5. **Pass search query from Header to products route**
   - The Header search form navigates to `/products` on submit but never passes the search term as a query parameter. Update the navigation to include the search value (e.g., `/products?search=...`) and have `ProductsPage` read from the route search params to initialize its search state.

6. **Define missing Tailwind color classes**
   - `brand-blue`, `brand-dark`, `brand-orange`, and `electric-orange` are used in `CartPage`, `OrderConfirmationPage`, `CartSummary`, `LoginForm`, and `RelatedProducts` but are not defined in `tailwind.config.js`. Either define these color tokens in the config, or replace the usages with existing design tokens (e.g., `primary`, standard Tailwind colors). Audit all usages to pick the right approach.

7. **Remove broken "edit product" links from admin dashboard**
   - `DashboardPage` links low-stock products to `/admin/products/$productId/edit`, but this route does not exist. Either remove the links entirely (simplest), or make them point to an existing route. Do not create the edit route as part of this bug fix — that's a feature.

## Decision Document

- **Order endpoint auth (commit 3):** This needs a decision. The order confirmation page currently fetches the order by ID without auth. Options: (a) add an `accessToken` field to orders returned at creation, required for lookup; (b) require user auth; (c) accept the risk for now and document it. The team should decide which approach fits the WhatsApp-based checkout model.
- **Tailwind colors (commit 6):** The decision is whether to formalize `brand-*` as part of the design system or replace them with existing tokens. Replacing with existing tokens is simpler and avoids design system sprawl.
- **Dashboard links (commit 7):** Remove the links rather than building a new route. The product edit route can be added as a feature later.

## Testing Decisions

- No automated tests exist. Each fix will be verified manually:
  - Server bugs: test via API calls (curl/Postman) confirming the correct behavior
  - Frontend bugs: test in the browser confirming pagination works, search navigates correctly, colors render, and broken links are gone
- Good tests for this area would be: API integration tests for the orders and stats endpoints, and component tests for ProductsPage pagination behavior. These are out of scope for this issue.

## Out of Scope

- Adding automated tests
- Creating the product edit admin route (that's a feature, not a bug fix)
- Redesigning the pagination component (the web cleanup issue covers this)
- Fixing the "Remember me" checkbox in login (cosmetic, covered in web cleanup)

## Further Notes

These fixes are all independent — they can be done in any order and each commit is self-contained.
