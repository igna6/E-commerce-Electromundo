export type Banner = {
  id: number
  title: string
  subtitle: string | null
  buttonText: string | null
  buttonLink: string | null
  image: string | null
  displayOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}
