# ElectroMundo - Improvement Roadmap

Analysis comparing current state against Garbarino and modern Argentine e-commerce standards.

---

## Level 0: Critical / Broken (Fix Immediately)

These issues make the store **unusable for customers** right now.

### 0.1 All Products Show $0.00

Every product displays `$ 0,00` because the CSV import sets `price = 0`. No customer can buy anything.

- **Fix:** Admin bulk-price update tool, or CSV re-import with prices.
- **Files:** `server/src/services/admin/importProducts.service.ts`, product data

### 0.2 No Product Images

Products have no images — just empty space or broken placeholders. An e-commerce store without images is non-functional.

- **Fix:** Add image upload to admin (S3/Cloudinary), or at minimum support image URLs per product.
- **Files:** `server/src/entities/products.ts` (has `image` column), admin product forms

### 0.3 Generic/Hardcoded Product Data

- **Descriptions** are all identical: _"Producto de alta calidad con garantía oficial"_
- **Specifications** are all hardcoded: Brand "Genérica", Model "2024", Origin "Argentina"
- **Product names** are ALL CAPS from the CSV import (e.g., `BICICLETA GCA MOUNTAINBIKE RODADO 29 21 VELOCIDADES...`)

- **Fix:** Clean up product names (title case), add real descriptions and specs per product. Consider a `specifications` JSON column.

### 0.4 Fake Reviews & Discounts Displayed

- All products show `(4.2) - 128 reseñas` but **no review system exists**
- All products show `-15%` discount badge and crossed-out price but **no discount logic exists**
- `12 cuotas sin interés de $0,00` displayed but no installment logic exists

- **Fix:** Remove fake data from the UI until the real features are built. Displaying fake reviews and fake discounts hurts credibility.
- **Files:** `web/src/sections/products/ProductDetail/`, `web/src/components/ProductCard.tsx`

### 0.5 Only 1 Category Visible

Home page shows only "Hogar" category. Products aren't properly categorized despite having category infrastructure.

- **Fix:** Create proper categories matching the actual product catalog, assign products to categories.
- **Files:** Categories API, admin category management

---

## Level 1: High Priority (Core E-commerce Gaps)

Missing features that any real e-commerce store must have.

### 1.1 Navigation & Category Structure

**Current:** Only 2 nav links (Inicio, Productos). No way to browse by category from the header.

**Garbarino has:**
- Horizontal category bar with main categories
- Mega menu dropdown with subcategories (3 levels deep)
- Quick links: Ofertas, Cuotas sin interés, Envío gratis, Marcas

**To implement:**
- Category navigation bar below the header
- Category dropdown/mega menu with subcategories
- Subcategories support in the database (`parentCategoryId`)
- Direct category links in the nav

### 1.2 User Accounts & Authentication (Customer-side)

**Current:** Auth exists but only for admin. No customer registration/login.

**Needed:**
- Customer registration and login
- Order history per user
- Saved addresses
- Account settings page
- Password recovery flow

### 1.3 Product Images & Gallery

**Current:** Single `image` column, no upload mechanism, no gallery.

**Needed:**
- Multiple images per product (new `product_images` table)
- Image upload in admin (file upload to S3/Cloudinary)
- Image gallery on product detail (thumbnails, zoom, lightbox)
- Lazy loading and responsive image sizes

### 1.4 Real Search with Suggestions

**Current:** Basic text search that navigates to `/products`. No autocomplete, no suggestions.

**Needed:**
- Search autocomplete/suggestions dropdown as you type
- Search results highlighting
- Recent searches
- Category-scoped search
- "No results" state with suggestions

### 1.5 Shipping & Delivery Options

**Current:** Hardcoded `shippingMethod: 'pickup'`, `shippingCost: 0`. Only "Retiro en Sucursal".

**Needed:**
- Home delivery option with cost calculation (by province/zip code)
- Integration with shipping providers (OCA, Andreani, Correo Argentino)
- Estimated delivery dates
- Order tracking

### 1.6 Email Notifications

**Current:** No email sending capability.

**Needed:**
- Order confirmation email
- Shipping notification email
- Password recovery email
- Welcome email on registration

---

## Level 2: Medium Priority (UX & Conversion)

Features that significantly improve user experience and conversion rates.

### 2.1 Homepage Content Sections

**Current:** Hero carousel + Benefits bar + 1 category + Featured products + Guarantee banner. Very minimal.

**Garbarino has:**
- Multiple promotional banners
- Quick-access category tiles with icons
- "Ofertas del Día" carousel with countdown
- "Super Oportunidades" section
- Category-specific product carousels (e.g., "Colchones y Sommiers")
- "Tendencia" section with tabs
- Brand showcase

**To implement:**
- "Ofertas del Día" section with discount products
- Category-specific product carousels (configurable from admin)
- Brand showcase section
- "Lo más vendido" (best sellers) section

### 2.2 Product Card Improvements

**Current:** Name, price, stock badge, add-to-cart button. No image.

**Needed:**
- Product image (primary)
- Real price with original price (if discounted)
- Free shipping badge (if applicable)
- Quick view modal
- Wishlist/favorite button
- Better truncation of long product names

### 2.3 Wishlist / Favorites

**Current:** Not implemented.

**Needed:**
- Heart icon on product cards
- Favorites page (requires user account)
- "Save for later" in cart
- Guest favorites via localStorage (upgrade to account on login)

### 2.4 Product Filtering Improvements

**Current:** Category, price range, brand (hardcoded brands: Apple, Samsung, Sony, Dell, Logitech, JBL — none match actual products).

**Needed:**
- Dynamic brand filter based on actual product data
- Brand entity in database
- Stock availability filter that works
- Rating filter (when reviews exist)
- Specification-based filters
- Filter counts showing number of matches
- URL-synced filters (shareable filtered views)

### 2.5 Discount & Coupon System

**Current:** No discount logic. Fake -15% badges displayed.

**Needed:**
- `compareAtPrice` or `originalPrice` field on products
- Percentage and fixed-amount discounts
- Coupon codes at checkout
- Automatic discounts (e.g., "buy 2 get 10% off")
- Admin discount management
- Display real savings on product cards

### 2.6 Product Detail Page Enhancements

**Current:** Basic info, hardcoded specs, fake reviews tab.

**Needed:**
- Real specifications from product data
- "Preguntas y Respuestas" section (like MercadoLibre)
- Share buttons (WhatsApp, social media)
- "Recently viewed" products
- "Customers also bought" recommendations
- Stock alerts ("Quedan pocas unidades")
- Notify when back in stock

### 2.7 Cart Improvements

**Current:** Basic cart with quantity controls.

**Needed:**
- "Productos que te pueden interesar" (cross-sell) in cart
- Coupon code input
- Estimated shipping cost preview
- Save cart for later (requires account)
- Cart abandonment recovery (email)

### 2.8 Checkout Flow

**Current:** Single-step form (name, email, phone). No address fields. Payment is handled externally via WhatsApp (intentional).

**Needed:**
- Multi-step checkout (Contact → Shipping → Confirmation)
- Address form with province/city selection (for delivery orders)
- Shipping method selection with cost
- Order summary sidebar throughout
- Guest checkout + option to create account

---

## Level 3: Low Priority (Polish & Growth)

Nice-to-have features for a mature e-commerce platform.

### 3.1 SEO & Meta Tags

- Dynamic `<title>` and `<meta description>` per page
- Open Graph tags for social sharing
- Structured data (JSON-LD for products)
- Sitemap generation
- Canonical URLs

### 3.2 Performance Optimization

- Image optimization (WebP, responsive sizes)
- Lazy loading for below-fold content
- Prefetching for likely navigation
- Service worker for offline catalog browsing
- Bundle splitting and code splitting

### 3.3 Analytics & Tracking

- Google Analytics 4 integration
- Facebook Pixel
- Conversion tracking
- Product view and cart events
- Heatmaps (Hotjar/Clarity)

### 3.4 Customer Reviews & Ratings

- Review submission after purchase
- Star ratings with averages
- Review moderation (admin)
- Photo reviews
- Review helpfulness voting

### 3.5 Social Media Integration

- Instagram feed on homepage
- Social share buttons on products
- WhatsApp catalog integration
- Social login (Google, Facebook)

### 3.6 Advanced Admin Features

- Sales reports and charts (beyond basic stats)
- Inventory alerts and auto-reorder points
- Customer management (view orders, contact)
- Bulk product editing
- Export orders to CSV/Excel
- Role-based admin access (editor, manager, super admin)

### 3.7 Footer & Legal Pages

**Current:** All footer links point to `#` (broken).

**Needed:**
- Términos y Condiciones page (with real content)
- Política de Privacidad page
- Política de Envíos page
- Cambios y Devoluciones page
- Preguntas Frecuentes (FAQ) page
- Newsletter signup form
- Social media links (Instagram, Facebook)

### 3.8 Accessibility

- Proper ARIA labels on all interactive elements
- Keyboard navigation for all features
- Screen reader testing
- Color contrast compliance (WCAG AA)
- Focus indicators
- Alt text for all images

### 3.9 Internationalization & Localization

- Consistent Spanish locale throughout (some English remains)
- Currency formatting consistency
- Date formatting (es-AR)
- Error messages in Spanish (some are in English)

### 3.10 Security Hardening

- Rate limiting on auth endpoints
- CORS configuration for production
- Helmet.js security headers
- Input sanitization (XSS prevention)
- SQL injection audit (Drizzle handles most)
- CSRF protection
- Admin password not hardcoded in seed script
- Refresh token cleanup job

---

## Architecture Comparison: ElectroMundo vs Garbarino

| Feature | ElectroMundo | Garbarino |
|---------|-------------|-----------|
| Category navigation | 2 links | Mega menu with 3-level hierarchy |
| Product images | None | Multiple per product with zoom |
| Prices | All $0 | Real prices with installments |
| Discounts | Fake badges | Real promotions with timers |
| Reviews | Fake "128 reviews" | Real customer reviews |
| User accounts | Admin only | Full customer accounts |
| Payment | WhatsApp-based (intentional) | MercadoPago, cards, bank transfers |
| Shipping | Pickup only | Multiple carriers, home delivery |
| Search | Basic text | Autocomplete with suggestions |
| Favorites | None | Full wishlist system |
| Brands | Hardcoded in filter | Brand pages and browsing |
| Homepage sections | 4 sections | 8+ dynamic sections |
| Newsletter | None | Footer signup |
| Social media | None | Instagram, Facebook links |
| Legal pages | All broken (#) | Full content pages |

---

## Suggested Execution Order

1. **Week 1-2:** Fix Level 0 (prices, images, fake data removal, categories)
2. **Week 3-4:** Navigation + Product cards + Search improvements (Level 1.1, 2.2, 1.4)
3. **Week 5-6:** User accounts + Checkout flow (Level 1.2, 2.8)
4. **Week 7-8:** Shipping + Email notifications (Level 1.5, 1.6)
5. **Week 9-10:** Discounts + Wishlist + Homepage sections (Level 2.5, 2.3, 2.1)
6. **Ongoing:** Level 3 items based on business priorities

> **Note:** Payment is handled externally via WhatsApp by design. The checkout flow creates the order and generates a WhatsApp message for the customer to coordinate payment directly with the store.
