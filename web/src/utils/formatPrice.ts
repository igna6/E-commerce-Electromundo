const formatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
})

/**
 * @deprecated Tax is no longer applied on the frontend. This function is a passthrough for backwards compatibility.
 */
export function applyTax(cents: number): number {
  return cents
}

/**
 * Format a price in cents to ARS currency string.
 * @param cents - Price in cents (integer)
 */
export function formatPrice(cents: number): string {
  return formatter.format(cents / 100)
}
