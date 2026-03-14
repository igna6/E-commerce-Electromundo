import { ImageOff } from 'lucide-react'

type ProductImageGalleryProps = {
  images: Array<string>
  productName: string
  selectedImage: number
  onSelectImage: (index: number) => void
}

export default function ProductImageGallery({
  images,
  productName,
  selectedImage,
  onSelectImage,
}: ProductImageGalleryProps) {
  return (
    <div className="p-6 lg:p-8 bg-gray-50">
      {/* Main Image */}
      <div className="aspect-square bg-white rounded-xl overflow-hidden mb-4 relative group">
        {images.length > 0 ? (
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <ImageOff className="w-20 h-20 stroke-[1.2]" />
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}
      </div>

      {/* Thumbnail Gallery — only show when there are multiple images */}
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => onSelectImage(index)}
              className={`w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-brand-blue ring-2 ring-brand-blue/20'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <img
                src={img}
                alt={`${productName} ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
