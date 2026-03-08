---
phase: 08-checkout-simplification
plan: 01
status: complete
---

## What was accomplished

Simplified the order backend to remove payment method and shipping method requirements, make address fields optional, default to pickup, and simplify the order text generator.

### Task 1: Update order DB schema

The entity file (`server/src/entities/orders.ts`) already had the nullable changes applied from a prior session. The migration (`server/drizzle/0004_sparkling_risque.sql`) was already generated and pushed to the database. Verified with `drizzle-kit push` which reported "No changes detected".

### Task 2: Simplify order validation schema

Updated `server/src/validators/order.ts`:
- Kept required: `email`, `phone`, `firstName`, `lastName`, `items`
- Made optional (`.optional().nullable()`): `address`, `apartment`, `city`, `province`, `zipCode`
- Removed `shippingMethod` and `paymentMethod` entirely from the schema

### Task 3: Simplify order service

Updated `server/src/services/orders.service.ts`:
- Removed `SHIPPING_COSTS` map
- Made address fields optional in `CreateOrderInput` type, removed `shippingMethod`/`paymentMethod`
- `shippingCost = 0` always (pickup only)
- `total = subtotal + tax` (no shipping cost in total)
- Hardcoded `shippingMethod: 'pickup'` and `paymentMethod: null` when inserting
- `getOrderById` left unchanged

### Task 4: Simplify order text generator

Rewrote `server/src/utils/orderTextGenerator.ts`:
- Made address/shipping/payment fields optional in `OrderData` type
- Address section only shown when `order.address` is truthy
- Removed `PAYMENT_LABELS` and payment method line
- Removed `SHIPPING_LABELS` (no longer needed)
- Shipping cost line only shown if `> 0`
- Added "Retiro en Sucursal" line before footer

Created `web/src/utils/orderTextGenerator.ts` as a frontend copy with identical logic.

## Files modified

- `server/src/validators/order.ts` -- simplified schema
- `server/src/services/orders.service.ts` -- simplified service
- `server/src/utils/orderTextGenerator.ts` -- simplified text generator

## Files created

- `web/src/utils/orderTextGenerator.ts` -- frontend copy of text generator

## Files unchanged (already correct)

- `server/src/entities/orders.ts` -- schema already had nullable columns
- `server/src/controllers/orders.controller.ts` -- no changes needed
- `server/drizzle/0004_sparkling_risque.sql` -- migration already existed

## Verification

- `cd server && npx tsc --noEmit` -- passes with no errors
- `cd web && npx tsc --noEmit` -- has pre-existing errors in checkout machine/components (expected, will be resolved in 08-02-PLAN.md)
- DB migration already applied

## Deviations

- Task 1 (DB schema) was already completed from a prior session. No re-generation or push was needed.
- The frontend `web/src/utils/orderTextGenerator.ts` did not previously exist; it was created new rather than modified.

## Next step

Ready for 08-02-PLAN.md (frontend checkout simplification).
