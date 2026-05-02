import { useState } from 'react'
import { Heart, ImageOff, Share2 } from 'lucide-react'

type ProductImageGalleryProps = {
  images: Array<string>
  productName: string
  selectedImage: number
  onSelectImage: (index: number) => void
  discount?: number
}

export default function ProductImageGallery({
  images,
  productName,
  selectedImage,
  onSelectImage,
  discount,
}: ProductImageGalleryProps) {
  const [wished, setWished] = useState(false)

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="relative bg-gray-50 rounded-xl overflow-hidden aspect-square flex items-center justify-center group">
        {images.length > 0 ? (
          <img
            src={images[selectedImage]}
            alt={productName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400 gap-3">
            <ImageOff className="w-20 h-20 stroke-[1.2]" />
            <span className="text-sm font-medium">Sin imagen</span>
          </div>
        )}

        {/* Discount badge */}
        {discount != null && discount > 0 && (
          <span className="absolute top-3 left-3 bg-red-500 text-white text-sm font-black px-2.5 py-1 rounded-lg">
            -{discount}%
          </span>
        )}

        {/* Wish + Share */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <button
            onClick={() => setWished(!wished)}
            className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow"
          >
            <Heart
              size={18}
              className={wished ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
          <button className="p-2 bg-white rounded-full shadow-md hover:shadow-lg transition-shadow">
            <Share2 size={18} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => onSelectImage(i)}
              className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                i === selectedImage
                  ? 'border-electric-cyan shadow-md'
                  : 'border-transparent hover:border-gray-300'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
