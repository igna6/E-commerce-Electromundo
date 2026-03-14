import { ChevronRight, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Slider } from '@/components/ui/slider'
import { useCategoryTree } from '@/hooks/useCategories'
import type { CategoryWithChildren } from '@/hooks/useCategories'

type FilterSidebarProps = {
  priceRange: Array<number>
  onPriceRangeChange: (range: Array<number>) => void
  onClearFilters: () => void
  inStock: boolean
  onInStockChange: (checked: boolean) => void
  selectedCategoryId: number | undefined
  onCategoryChange: (categoryId: number | undefined) => void
}

function CategoryItem({
  category,
  selectedCategoryId,
  onCategoryChange,
  depth = 0,
}: {
  category: CategoryWithChildren
  selectedCategoryId: number | undefined
  onCategoryChange: (categoryId: number | undefined) => void
  depth?: number
}) {
  const isActive = selectedCategoryId === category.id

  return (
    <>
      <button
        onClick={() => onCategoryChange(isActive ? undefined : category.id)}
        className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
          isActive
            ? 'bg-primary/10 text-primary font-medium'
            : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
        }`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
      >
        {category.children.length > 0 && (
          <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        )}
        <span className="truncate">{category.name}</span>
      </button>
      {category.children.map((child) => (
        <CategoryItem
          key={child.id}
          category={child}
          selectedCategoryId={selectedCategoryId}
          onCategoryChange={onCategoryChange}
          depth={depth + 1}
        />
      ))}
    </>
  )
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  inStock,
  onInStockChange,
  selectedCategoryId,
  onCategoryChange,
}: FilterSidebarProps) {
  const { data: categoryTree } = useCategoryTree()

  const hasActiveFilters =
    priceRange[0] > 0 ||
    priceRange[1] < 500000 ||
    inStock ||
    selectedCategoryId !== undefined

  return (
    <div className="space-y-8">
      {/* Categories */}
      {categoryTree && categoryTree.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
            Categorias
          </h3>
          <div className="space-y-0.5">
            {categoryTree.map((cat) => (
              <CategoryItem
                key={cat.id}
                category={cat}
                selectedCategoryId={selectedCategoryId}
                onCategoryChange={onCategoryChange}
              />
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Rango de Precio
        </h3>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={onPriceRangeChange}
            min={0}
            max={500000}
            step={1000}
            className="mb-4"
          />
          <div className="flex items-center justify-between text-sm">
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-mono">
              ${priceRange[0].toLocaleString()}
            </span>
            <span className="text-slate-400">&mdash;</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-mono">
              ${priceRange[1].toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Stock Filter */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Disponibilidad
        </h3>
        <label className="flex items-center gap-3 cursor-pointer group">
          <Checkbox
            checked={inStock}
            onCheckedChange={(checked) => onInStockChange(checked === true)}
          />
          <span className="text-sm text-slate-600 group-hover:text-slate-900 transition-colors">
            Solo productos en stock
          </span>
        </label>
      </div>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={onClearFilters}
          className="w-full border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:bg-slate-100"
        >
          <X className="w-4 h-4 mr-2" />
          Limpiar Filtros
        </Button>
      )}
    </div>
  )
}
