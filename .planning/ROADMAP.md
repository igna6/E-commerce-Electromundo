# Roadmap: ElectroMundo v1.0

## Overview

Transform ElectroMundo from a broken prototype (v0.8) into a credible, professional storefront where real customers can browse products with real prices and images, navigate by category, and buy via WhatsApp. Phases progress from fixing critical data issues through UI polish, ending with a store visually competitive with Argentine e-commerce standards.

## Milestones

- ✅ **v0.8 Prototype** - Phases 1-8 (shipped)
- ✅ **v1.0 Production Storefront** - Phases 9-15 (complete)

## Phases

<details>
<summary>✅ v0.8 Prototype (Phases 1-8) - SHIPPED</summary>

### Phase 8: Checkout Simplification
**Goal**: Simplify checkout flow for WhatsApp-based ordering
**Plans**: 3 plans

Plans:
- [x] 08-01: Checkout form simplification
- [x] 08-02: WhatsApp message generation
- [ ] 08-03: Checkout UI polish

</details>

### ✅ v1.0 Production Storefront

**Milestone Goal:** A credible, professional Argentine e-commerce storefront with real data, working navigation, and polished UI.

#### Phase 9: Data Cleanup
**Goal**: Fix all critical data issues — prices, product names, remove fake UI elements
**Depends on**: Phase 8
**Plans**: 2 plans

Plans:
- [x] 09-01: Frontend toTitleCase utility for product names + extend CSV import to handle price column
- [x] 09-02: Remove fake reviews, fake discounts, fake installments, hardcoded brands from all UI components

#### Phase 10: Images & Categories
**Goal**: Add product image support and build proper category structure with assignments
**Depends on**: Phase 9
**Plans**: 3 plans

Plans:
- [x] 10-01: Extend CSV import for image URLs + fix product detail gallery hack
- [x] 10-02: Add parentCategoryId for category hierarchy + update API and admin UI
- [x] 10-03: Seed real category tree + assign products to categories by keyword matching

#### Phase 11: Codebase Refactor
**Goal**: Fix bugs, clean up structural issues, and reduce duplication before building new features
**Depends on**: Phase 10
**Issues**: [11a-bug-fixes](.planning/issues/11a-bug-fixes.md), [11b-server-cleanup](.planning/issues/11b-server-cleanup.md), [11c-web-cleanup](.planning/issues/11c-web-cleanup.md)

Plans:
- [x] 11a: Bug fixes (7 commits) — broken pagination, search, auth gaps, Tailwind classes, soft-delete gaps
- [x] 11b: Server structural cleanup (13 commits) — shared validators, response envelope, pagination helper, transactions, dead code
- [x] 11c: Web structural cleanup (13 commits) — shared components, API client, types, memoization, dead code

#### Phase 12: Navigation & Filtering
**Goal**: Category navigation bar, dynamic filters from real data, search improvements
**Depends on**: Phase 11
**Plans**: 3 plans

Plans:
- [x] 12-01: Category navigation bar with dropdowns
- [x] 12-02: Dynamic product filters (working category/price/stock filters, sort wired to API)
- [x] 12-03: Search improvements (result count, active filter tags, category-scoped search)

#### Phase 13: Product Pages
**Goal**: Professional product cards and detail pages with real data
**Depends on**: Phase 11 (needs shared ProductCard), Phase 10 (needs images), Phase 9 (needs clean data)
**Plans**: 2 plans

Plans:
- [x] 13-01: Product card polish (category name display, cleanup non-functional UI)
- [x] 13-02: Product detail page overhaul (category breadcrumb, smart related products, remove duplication and dead UI)

#### Phase 14: Homepage Sections
**Goal**: Rich homepage with category tiles, product carousels, and promotional sections
**Depends on**: Phase 13 (needs good product cards), Phase 10 (needs categories)
**Plans**: 2 plans

Plans:
- [x] 14-01: Best prices section, improved promo section, trust bar
- [x] 14-02: Category names on featured products cards

#### Phase 15: Footer & Polish
**Goal**: Working footer with real legal pages, localization consistency, final UI polish
**Depends on**: Phase 14
**Plans**: 2 plans

Plans:
- [x] 15-01: Legal/info pages (terms, privacy, FAQ, shipping, returns)
- [x] 15-02: Footer links wired to actual pages, WhatsApp number fixed

## Progress

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 8. Checkout Simplification | v0.8 | 2/3 | In progress | - |
| 9. Data Cleanup | v1.0 | 2/2 | Complete | - |
| 10. Images & Categories | v1.0 | 3/3 | Complete | - |
| 11. Codebase Refactor | v1.0 | 3/3 | Complete | - |
| 12. Navigation & Filtering | v1.0 | 3/3 | Complete | - |
| 13. Product Pages | v1.0 | 2/2 | Complete | - |
| 14. Homepage Sections | v1.0 | 2/2 | Complete | - |
| 15. Footer & Polish | v1.0 | 2/2 | Complete | - |
