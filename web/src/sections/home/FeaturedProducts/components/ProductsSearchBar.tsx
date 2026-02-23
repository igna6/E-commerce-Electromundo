import { Input } from '@/components/ui/input'

interface ProductsSearchBarProps {
  value: string
  onChange: (value: string) => void
}

function ProductsSearchBar({ value, onChange }: ProductsSearchBarProps) {
  return (
    <div className="max-w-md mx-auto mb-32">
      <div className="relative">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-10 pr-4"
        />
        <svg
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>
    </div>
  )
}

export default ProductsSearchBar
