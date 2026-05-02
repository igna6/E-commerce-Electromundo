import { useQuery } from '@tanstack/react-query'
import type { Category } from '@/types/category'
import { getCategories } from '@/services/categories.service'

export type CategoryWithChildren = Category & {
  children: Array<CategoryWithChildren>
}

function buildCategoryTree(
  categories: Array<Category>,
): Array<CategoryWithChildren> {
  const map = new Map<number, CategoryWithChildren>()
  const roots: Array<CategoryWithChildren> = []

  for (const cat of categories) {
    map.set(cat.id, { ...cat, children: [] })
  }

  for (const cat of categories) {
    const node = map.get(cat.id)!
    if (cat.parentCategoryId && map.has(cat.parentCategoryId)) {
      map.get(cat.parentCategoryId)!.children.push(node)
    } else {
      roots.push(node)
    }
  }

  return roots
}

export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await getCategories()
      return response.data
    },
    staleTime: 30 * 60 * 1000, // 30 min — categories rarely change
  })
}

export function useCategoryTree() {
  const query = useCategories()
  return {
    ...query,
    data: query.data ? buildCategoryTree(query.data) : undefined,
  }
}
