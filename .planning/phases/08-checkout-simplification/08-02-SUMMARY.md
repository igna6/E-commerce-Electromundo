# Phase 08 Plan 02: Frontend Checkout Simplification Summary

**Simplified 3-step checkout wizard to single-step contact form with inline submit.**

## Accomplishments
- Rewrote checkout machine: 3 states (contactInfo → submitting → success) instead of 5
- Simplified checkout form to 4 fields: firstName, lastName, email, phone
- Added "Retiro en sucursal" badge to indicate pickup
- Removed shipping/payment method selection entirely
- Simplified order summary (no shipping cost line)
- Updated OrderConfirmationPage to handle nullable address fields

## Files Created/Modified
- `web/src/types/order.ts` - Simplified CreateOrderPayload, nullable fields in Order
- `web/src/machines/checkoutMachine.ts` - Rewritten to 3 states
- `web/src/sections/checkout/CheckoutPage.tsx` - Single-step form
- `web/src/sections/checkout/components/ContactShippingForm.tsx` - Contact fields only
- `web/src/sections/checkout/components/CheckoutOrderSummary.tsx` - Removed shipping/payment
- `web/src/sections/order-confirmation/OrderConfirmationPage.tsx` - Handle nullable address

## Files Deleted
- `web/src/sections/checkout/components/ShippingMethodStep.tsx`
- `web/src/sections/checkout/components/PaymentMethodStep.tsx`
- `web/src/sections/checkout/components/CheckoutSteps.tsx`

## Deviations
- Also updated OrderConfirmationPage.tsx to handle nullable address fields (auto-fix, would have caused runtime error)

## Next Step
Ready for 08-03-PLAN.md (WhatsApp integration)
