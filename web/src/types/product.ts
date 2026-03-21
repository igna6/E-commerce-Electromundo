export type Product = {
  id: number
  name: string
  price: number
  promotionPrice: number | null
  description: string | null
  image: string | null
  category: number | null
  stock: number
  sku: string | null
  createdAt: string
  updatedAt: string
}
