export type OrderItem = {
  id: number
  orderId: number
  productId: number
  productName: string
  productPrice: number
  quantity: number
  lineTotal: number
  createdAt: string
}

export type Order = {
  id: number
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string | null
  apartment: string | null
  city: string | null
  province: string | null
  zipCode: string | null
  shippingMethod: string | null
  paymentMethod: string | null
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  orderText: string
  createdAt: string
  updatedAt: string
  items: Array<OrderItem>
}

export type CreateOrderPayload = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address?: string | null
  apartment?: string | null
  city?: string | null
  province?: string | null
  zipCode?: string | null
  shippingMethod?: string | null
  paymentMethod?: string | null
  items: Array<{
    productId: number
    quantity: number
  }>
}
