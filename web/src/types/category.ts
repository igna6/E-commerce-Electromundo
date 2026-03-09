export type Category = {
  id: number
  name: string
  description: string | null
  parentCategoryId: number | null
  createdAt: string
  updatedAt: string
}
