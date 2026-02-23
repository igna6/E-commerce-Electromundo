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
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
        {/* Zoom Icon */}
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
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 0 && (
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
