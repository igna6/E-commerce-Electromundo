import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ProductControlsProps = {
  search: string
  onSearchChange: (search: string) => void
  minPrice?: number
  maxPrice?: number
  onPriceChange: (min?: number, max?: number) => void
  sortBy: string
  onSortChange: (sort: string) => void
}

export default function ProductControls({
  search,
  onSearchChange,
  minPrice,
  maxPrice,
  onPriceChange,
  sortBy,
  onSortChange,
}: ProductControlsProps) {
  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        {/* Price Range */}
        <div className="flex flex-1 gap-2">
          <Input
            type="number"
            placeholder="Min price"
            value={minPrice ?? ''}
            onChange={(e) =>
              onPriceChange(
                e.target.value ? parseInt(e.target.value) : undefined,
                maxPrice
              )
            }
          />
          <Input
            type="number"
            placeholder="Max price"
            value={maxPrice ?? ''}
            onChange={(e) =>
              onPriceChange(
                minPrice,
                e.target.value ? parseInt(e.target.value) : undefined
              )
            }
          />
          {(minPrice !== undefined || maxPrice !== undefined) && (
            <Button
              variant="outline"
              onClick={() => onPriceChange(undefined, undefined)}
              size="sm"
            >
              Clear
            </Button>
          )}
        </div>

        {/* Sort */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="name">Name A-Z</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
