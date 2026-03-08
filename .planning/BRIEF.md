# ElectroMundo

**One-liner**: Argentine e-commerce store for electronics and home products, with WhatsApp-based checkout, going from prototype to production-ready storefront.

## Current State (Updated: 2026-03-08)

**Shipped:** v0.8 (checkout simplification completed)
**Status:** Development — not yet live
**Codebase:**
- Express 5 + React 19 / TanStack Start monorepo
- PostgreSQL + Drizzle ORM, Zod validation, JWT auth
- Tailwind CSS + Radix UI components
- ~160 products imported via CSV, 1 category, admin panel functional

**Known Issues:**
- All products show $0.00 (prices never set after CSV import)
- No product images anywhere
- Fake reviews (128 reseñas), fake discounts (-15%), fake installments displayed
- Product names ALL CAPS, descriptions/specs identical and generic
- Only 1 category visible, brand filters hardcoded to non-matching brands
- Navigation has only 2 links (Inicio, Productos)
- All footer links broken (point to #)

## v1.0 Goals

**Vision:** Transform the prototype into a credible, professional storefront that real customers can browse, trust, and buy from via WhatsApp.

**Motivation:**
- Store is unusable with $0 prices and no images
- Fake data (reviews, discounts) destroys trust
- Navigation and UX far below market standard (Garbarino, Fravega)
- UI needs significant polish to look professional

**Scope (v1.0):**
- Fix all critical data issues (prices, images, product cleanup)
- Remove all fake/hardcoded data from UI
- Build proper category navigation and structure
- Improve product cards, detail pages, and search
- Polish UI/UX to professional Argentine e-commerce standard
- Fix footer with real pages (legal, FAQ, policies)
- Improve homepage sections (category tiles, featured products, offers)

**Success Criteria:**
- [ ] All products have real prices displayed
- [ ] Products have images (at minimum URL-based)
- [ ] No fake reviews, discounts, or installment text visible
- [ ] Category navigation works with multiple categories
- [ ] Homepage looks professional with multiple content sections
- [ ] Product filtering uses real data (dynamic brands, working categories)
- [ ] Footer links lead to real pages
- [ ] Full checkout → WhatsApp flow works end-to-end
- [ ] Visually competitive with Argentine e-commerce sites

**Out of Scope:**
- Payment gateway integration (WhatsApp flow is intentional)
- User accounts / customer registration
- Email notifications
- Shipping provider integration
- Review/rating system
- Analytics/tracking
