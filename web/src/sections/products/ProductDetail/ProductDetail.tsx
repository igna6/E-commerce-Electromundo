import { useMemo, useState } from 'react'
import { useParams } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import ProductImageGallery from './components/ProductImageGallery'
import ProductInfo from './components/ProductInfo'
import AddToCartControls from './components/AddToCartControls'
import RelatedProducts from './components/RelatedProducts'
import { useCart } from '@/contexts/CartContext'
import { useCategories } from '@/hooks/useCategories'
import { getProduct } from '@/services/products.service'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { toTitleCase } from '@/utils/toTitleCase'

function ProductDetail() {
  const { productId } = useParams({ from: '/products/$productId' })
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const { data: productData } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => getProduct(Number(productId)),
  })
  const product = productData?.data

  const { data: categories } = useCategories()
  const categoryMap = useMemo(() => {
    const map = new Map<number, string>()
    if (categories) {
      for (const cat of categories) {
        map.set(cat.id, cat.name)
      }
    }
    return map
  }, [categories])

  const categoryName = product?.category ? categoryMap.get(product.category) : undefined

  const images = product?.image ? [product.image] : []

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity)
      setIsAdding(true)
      setTimeout(() => {
        setIsAdding(false)
        setQuantity(1)
      }, 600)
    }
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Cargando producto...</p>
        </div>
      </div>
    )
  }

  const breadcrumbItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Productos', href: '/products' },
    ...(product.category && categoryName
      ? [{ label: toTitleCase(categoryName), href: `/products?category=${product.category}` }]
      : []),
    { label: toTitleCase(product.name) },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <PageBreadcrumb items={breadcrumbItems} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery
              images={images}
              productName={toTitleCase(product.name)}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />

            <div className="p-6 lg:p-8 flex flex-col">
              <ProductInfo product={product} categoryName={categoryName} />
              <AddToCartControls
                product={product}
                quantity={quantity}
                onQuantityChange={setQuantity}
                onAddToCart={handleAddToCart}
                isAdding={isAdding}
              />
            </div>
          </div>
        </div>

        <RelatedProducts
          product={product}
          categoryName={categoryName}
        />
      </div>
    </div>
  )
}

export default ProductDetail
