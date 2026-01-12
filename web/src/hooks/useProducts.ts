import { useQuery } from '@tanstack/react-query'
import { getProducts } from '../services/products.service'
import type { GetProductsParams } from '../services/products.service'

export function useProducts(params: GetProductsParams = {}) {
  return useQuery({
    queryKey: ['products', params],
    queryFn: () => getProducts(params),
  })
}
