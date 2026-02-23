import { useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/categories.service'
import { Button } from '@/components/ui/button'

type CategoryFilterProps = {
  selectedCategory?: number
  onCategoryChange: (categoryId: number | undefined) => void
}

export default function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  if (isLoading) {
    return <div className="flex gap-2">Loading categories...</div>
  }

  const categories = data?.data || []

  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedCategory === undefined ? 'default' : 'outline'}
        onClick={() => onCategoryChange(undefined)}
        size="sm"
      >
        All
      </Button>
      {categories.map((category) => (
        <Button
          key={category.id}
          variant={selectedCategory === category.id ? 'default' : 'outline'}
          onClick={() => onCategoryChange(category.id)}
          size="sm"
        >
          {category.name}
        </Button>
      ))}
    </div>
  )
}
