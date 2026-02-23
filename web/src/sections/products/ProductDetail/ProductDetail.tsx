import { useState } from 'react'
import { Link, useParams } from '@tanstack/react-router'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useProducts } from '@/hooks/useProducts'
import { useCart } from '@/contexts/CartContext'
import ProductImageGallery from './components/ProductImageGallery'
import ProductInfo from './components/ProductInfo'
import AddToCartControls from './components/AddToCartControls'
import ProductDetailTabs from './components/ProductDetailTabs'
import RelatedProducts from './components/RelatedProducts'

function ProductDetail() {
  const { productId } = useParams({ from: '/products/$productId' })
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const { data } = useProducts({ page: 1, limit: 20 })
  const product = data?.data.find((p) => p.id === Number(productId))

  const images = product?.image
    ? [product.image, product.image, product.image, product.image]
    : []

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Inicio</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/products">Productos</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{product.name}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
            <ProductImageGallery
              images={images}
              productName={product.name}
              selectedImage={selectedImage}
              onSelectImage={setSelectedImage}
            />

            <div className="p-6 lg:p-8 flex flex-col">
              <ProductInfo product={product} />
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

        <ProductDetailTabs product={product} />
        <RelatedProducts products={data?.data ?? []} currentProductId={product.id} />
      </div>
    </div>
  )
}

export default ProductDetail
