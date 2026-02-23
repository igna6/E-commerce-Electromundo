import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { Checkbox } from '@/components/ui/checkbox'

const categories = [
  { id: 'all', label: 'Todos', icon: '\u{1F31F}' },
  { id: 'electronics', label: 'Electr\u00f3nica', icon: '\u{1F4F1}' },
  { id: 'computers', label: 'Computadoras', icon: '\u{1F4BB}' },
  { id: 'phones', label: 'Celulares', icon: '\u{1F4DE}' },
  { id: 'audio', label: 'Audio', icon: '\u{1F3A7}' },
  { id: 'gaming', label: 'Gaming', icon: '\u{1F3AE}' },
  { id: 'accessories', label: 'Accesorios', icon: '\u{2328}\u{FE0F}' },
]

const brands = ['Apple', 'Samsung', 'Sony', 'LG', 'HP', 'Dell', 'Logitech', 'JBL']

type FilterSidebarProps = {
  selectedCategory: string
  onSelectCategory: (category: string) => void
  priceRange: number[]
  onPriceRangeChange: (range: number[]) => void
  selectedBrands: string[]
  onToggleBrand: (brand: string) => void
  onClearFilters: () => void
}

export default function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceRangeChange,
  selectedBrands,
  onToggleBrand,
  onClearFilters,
}: FilterSidebarProps) {
  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedBrands.length > 0 ||
    priceRange[0]! > 0 ||
    priceRange[1]! < 500000

  return (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Categorías
        </h3>
        <div className="space-y-1">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onSelectCategory(category.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 ${
                selectedCategory === category.id
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-transparent'
              }`}
            >
              <span className="text-base">{category.icon}</span>
              <span className="font-medium">{category.label}</span>
              {selectedCategory === category.id && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </button>
          ))}
        </div>
      </div>

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
              ${priceRange[0]!.toLocaleString()}
            </span>
            <span className="text-slate-400">&mdash;</span>
            <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-primary font-mono">
              ${priceRange[1]!.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Brands */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
          Marcas
        </h3>
        <div className="space-y-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors group"
            >
              <Checkbox
                checked={selectedBrands.includes(brand)}
                onCheckedChange={() => onToggleBrand(brand)}
                className="border-slate-300 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <span className="text-slate-600 group-hover:text-slate-900 transition-colors">
                {brand}
              </span>
            </label>
          ))}
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

export { categories }
