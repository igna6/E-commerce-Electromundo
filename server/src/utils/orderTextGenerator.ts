type OrderItem = {
  productName: string
  productPrice: number
  quantity: number
  lineTotal: number
}

type OrderData = {
  id: number
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment?: string | null
  city: string
  province: string
  zipCode: string
  shippingMethod: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: Date
  items: OrderItem[]
}

const SHIPPING_LABELS: Record<string, string> = {
  pickup: 'Retiro en Sucursal',
  standard: 'Estándar',
  express: 'Express',
}

const PAYMENT_LABELS: Record<string, string> = {
  card: 'Tarjeta de Crédito/Débito',
  mercadopago: 'MercadoPago',
  transfer: 'Transferencia Bancaria',
}

function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
  }).format(cents / 100)
}

function formatOrderNumber(id: number): string {
  return String(id).padStart(6, '0')
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
}

export function generateOrderText(order: OrderData): string {
  const lines: string[] = []
  const divider = '========================================'
  const thinDivider = '----------------------------------------'

  // Header
  lines.push(divider)
  lines.push(`        PEDIDO #${formatOrderNumber(order.id)}`)
  lines.push(divider)
  lines.push(`FECHA: ${formatDate(order.createdAt)}`)
  lines.push('')

  // Contact info
  lines.push('DATOS DE CONTACTO')
  lines.push(`Nombre: ${order.firstName} ${order.lastName}`)
  lines.push(`Email: ${order.email}`)
  lines.push(`Teléfono: ${order.phone}`)
  lines.push('')

  // Shipping address
  lines.push('DIRECCIÓN DE ENVÍO')
  lines.push(order.address)
  if (order.apartment) {
    lines.push(order.apartment)
  }
  lines.push(`${order.city}, ${order.province}`)
  lines.push(`CP: ${order.zipCode}`)
  lines.push('')

  // Products
  lines.push('PRODUCTOS')
  for (const item of order.items) {
    lines.push(`- ${item.productName}`)
    lines.push(`  Cantidad: ${item.quantity} x ${formatCurrency(item.productPrice)}`)
    lines.push(`  Subtotal: ${formatCurrency(item.lineTotal)}`)
  }
  lines.push('')

  // Summary
  lines.push('RESUMEN')
  lines.push(`Subtotal: ${formatCurrency(order.subtotal)}`)
  const shippingLabel = SHIPPING_LABELS[order.shippingMethod] || order.shippingMethod
  if (order.shippingCost === 0) {
    lines.push(`Envío (${shippingLabel}): Gratis`)
  } else {
    lines.push(`Envío (${shippingLabel}): ${formatCurrency(order.shippingCost)}`)
  }
  lines.push(`IVA (21%): ${formatCurrency(order.tax)}`)
  lines.push(thinDivider)
  lines.push(`TOTAL: ${formatCurrency(order.total)}`)
  lines.push('')

  // Payment method
  const paymentLabel = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod
  lines.push(`MÉTODO DE PAGO: ${paymentLabel}`)
  lines.push('')

  // Footer
  lines.push('Gracias por tu compra en Electromundo!')
  lines.push(divider)

  return lines.join('\n')
}
