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
  address: string
  apartment: string | null
  city: string
  province: string
  zipCode: string
  shippingMethod: string
  paymentMethod: string
  subtotal: number
  shippingCost: number
  tax: number
  total: number
  status: string
  orderText: string
  createdAt: string
  updatedAt: string
  items: OrderItem[]
}

export type CreateOrderPayload = {
  email: string
  phone: string
  firstName: string
  lastName: string
  address: string
  apartment?: string | null
  city: string
  province: string
  zipCode: string
  shippingMethod: 'pickup' | 'standard' | 'express'
  paymentMethod: 'card' | 'mercadopago' | 'transfer'
  items: {
    productId: number
    quantity: number
  }[]
}
