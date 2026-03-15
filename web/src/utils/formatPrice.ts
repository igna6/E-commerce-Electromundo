const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

const TAX_RATE = 0.21

/**
 * Apply 21% IVA tax to a price in cents.
 */
export function applyTax(cents: number): number {
  return Math.round(cents * (1 + TAX_RATE))
}

/**
 * Format a price in cents to ARS currency string.
 * @param cents - Price in cents (integer)
 */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100)
}
