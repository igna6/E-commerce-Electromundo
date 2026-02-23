const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

/**
 * Format a price in cents to ARS currency string.
 * @param cents - Price in cents (integer)
 */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100)
}
