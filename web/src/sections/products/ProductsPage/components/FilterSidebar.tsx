import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'

type FilterSidebarProps = {
  priceRange: Array<number>
  onPriceRangeChange: (range: Array<number>) => void
  onClearFilters: () => void
}

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 500000

  return (
    <div className="space-y-8">
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
