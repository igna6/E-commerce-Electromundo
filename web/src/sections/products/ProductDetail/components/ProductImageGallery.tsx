import { ImageOff } from 'lucide-react'

type ProductImageGalleryProps = {
  images: string[]
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
        {/* Zoom Icon — only show when there's an image */}
        {images.length > 0 && (
          <button className="absolute bottom-4 right-4 p-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
              />
            </svg>
          </button>
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
