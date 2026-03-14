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
  address?: string | null | undefined
  apartment?: string | null | undefined
  city?: string | null | undefined
  province?: string | null | undefined
  zipCode?: string | null | undefined
  shippingMethod?: string | null | undefined
  paymentMethod?: string | null | undefined
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  createdAt: Date
  items: Array<OrderItem>
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
  const lines: Array<string> = []
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

  // Shipping address (only if address is provided)
  if (order.address) {
    lines.push('DIRECCIÓN DE ENVÍO')
    lines.push(order.address)
    if (order.apartment) {
      lines.push(order.apartment)
    }
    if (order.city || order.province) {
      lines.push(`${order.city ?? ''}, ${order.province ?? ''}`)
    }
    if (order.zipCode) {
      lines.push(`CP: ${order.zipCode}`)
    }
    lines.push('')
  }

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
  if (order.shippingCost > 0) {
    lines.push(`Envío: ${formatCurrency(order.shippingCost)}`)
  }
  lines.push(`IVA (21%): ${formatCurrency(order.tax)}`)
  lines.push(thinDivider)
  lines.push(`TOTAL: ${formatCurrency(order.total)}`)
  lines.push('')

  // Pickup notice
  lines.push('Retiro en Sucursal')
  lines.push('')

  // Footer
  lines.push('Gracias por tu compra en Electromundo!')
  lines.push(divider)

  return lines.join('\n')
}
