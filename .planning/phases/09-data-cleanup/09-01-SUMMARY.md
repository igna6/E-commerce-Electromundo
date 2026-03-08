# Phase 9 Plan 1: Fix Product Data Layer Summary

**Added frontend toTitleCase utility for ALL CAPS product names and extended CSV import to accept optional price column with Argentine decimal format support.**

## Accomplishments
- Created `toTitleCase` utility that lowercases then capitalizes each word, keeping Spanish connectors (de, del, la, los, etc.) lowercase when not first word
- Applied `toTitleCase` to all 10 user-facing components that render product names (product cards, detail page, breadcrumbs, cart sidebar, cart page, checkout summary, order confirmation, related products, home featured products, stock error messages)
- Extended `importProducts.service.ts` to detect optional price column from CSV headers (precio, price, valor, costo, pvp, importe)
- Price parsing handles Argentine decimal format (comma replaced with dot), converts to cents via `Math.round(parsed * 100)`
- New products get CSV price or fallback to 0; existing products only get price updated when CSV provides a valid positive price (never overwrites with 0)
- Added `priceUpdated` counter to import return value and updated admin import dialog to show it
- Updated `ImportResult` type on frontend to include `priceUpdated`

## Files Created/Modified
- `web/src/utils/toTitleCase.ts` - New utility: title case conversion with Spanish connector awareness
- `web/src/sections/products/ProductsPage/components/ProductGridCard.tsx` - Applied toTitleCase to product name text and alt attributes
- `web/src/sections/products/ProductDetail/components/ProductInfo.tsx` - Applied toTitleCase to product name heading
- `web/src/sections/products/ProductDetail/ProductDetail.tsx` - Applied toTitleCase to breadcrumb and image gallery productName prop
- `web/src/sections/products/ProductDetail/components/RelatedProducts.tsx` - Applied toTitleCase to related product names
- `web/src/components/CartSidebar.tsx` - Applied toTitleCase to cart item names
- `web/src/sections/cart/components/CartItemRow.tsx` - Applied toTitleCase to cart row product names
- `web/src/sections/checkout/components/CheckoutOrderSummary.tsx` - Applied toTitleCase to checkout item names
- `web/src/sections/checkout/components/ContactShippingForm.tsx` - Applied toTitleCase to stock error product names
- `web/src/sections/order-confirmation/OrderConfirmationPage.tsx` - Applied toTitleCase to order item names
- `web/src/sections/home/FeaturedProducts/components/ProductCard.tsx` - Applied toTitleCase to featured product names
- `server/src/services/admin/importProducts.service.ts` - Extended with optional price column detection, parsing, and upsert logic
- `web/src/services/products.service.ts` - Added `priceUpdated` to ImportResult type
- `web/src/sections/admin/ImportProductsDialog.tsx` - Added price updated counter to results grid (4-column layout)
- `web/src/sections/checkout/CheckoutPage.tsx` - Fixed pre-existing unused `subtotal` variable (TS error blocker)

## Decisions Made
- Display-only transformation: toTitleCase is applied at render time, not stored in DB, preserving original data
- Admin views intentionally left with raw names so admins see the actual stored data when editing
- Price column is fully optional: existing CSVs without a price column continue to work identically (backwards compatible)
- Invalid/negative prices logged to errors array but don't skip the row (name and stock still imported)
- Zero prices from CSV are ignored (treated same as missing) to avoid accidentally clearing real prices

## Issues Encountered
- Pre-existing TypeScript error in `CheckoutPage.tsx`: unused `subtotal` variable destructured from `useCart()` (was shadowed by `availableSubtotal`). Fixed by removing the unused destructured variable.

## Next Step
Ready for 09-02-PLAN.md (Remove fake UI elements)
