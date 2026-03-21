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
  items: OrderItem[]
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

  // Greeting
  lines.push(
    `Hola! Soy ${order.firstName} ${order.lastName} y quiero realizar el siguiente pedido:`,
  )
  lines.push('')

  // Header
  lines.push(`*Pedido #${formatOrderNumber(order.id)}*`)
  lines.push(`${formatDate(order.createdAt)}`)
  lines.push('')

  // Shipping address (only if address is provided)
  if (order.address) {
    lines.push(`*Dirección de envío*`)
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
  lines.push(`*Productos*`)
  for (const item of order.items) {
    lines.push(
      `• ${item.productName} (x${item.quantity}) — ${formatCurrency(item.lineTotal)}`,
    )
  }
  lines.push('')

  // Summary
  lines.push(`*Resumen*`)
  if (order.shippingCost > 0) {
    lines.push(`Envío: ${formatCurrency(order.shippingCost)}`)
  }
  lines.push(`*Total: ${formatCurrency(order.total)}*`)
  lines.push('')

  // Footer
  lines.push(`¡Gracias por tu compra en *Electromundo*!`)

  return lines.join('\n')
}
