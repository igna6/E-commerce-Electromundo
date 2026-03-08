const SPANISH_CONNECTORS = new Set([
  'de',
  'del',
  'la',
  'las',
  'los',
  'el',
  'con',
  'para',
  'en',
  'y',
  'o',
  'a',
])

/**
 * Converts a string to title case, keeping common Spanish connectors
 * lowercase unless they are the first word.
 *
 * Example: "BICICLETA GCA MOUNTAINBIKE RODADO 29" → "Bicicleta Gca Mountainbike Rodado 29"
 */
export function toTitleCase(str: string): string {
  if (!str) return str

  return str
    .toLowerCase()
    .split(/\s+/)
    .map((word, index) => {
      if (!word) return word
      if (index > 0 && SPANISH_CONNECTORS.has(word)) return word
      return word.charAt(0).toUpperCase() + word.slice(1)
    })
    .join(' ')
}
