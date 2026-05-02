import { useCart } from '@/contexts/CartContext'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import CheckoutProgress from './components/CheckoutProgress'
import CheckoutOrderSummary from './components/CheckoutOrderSummary'
import { useCheckout } from '@/contexts/CheckoutContext'

type CheckoutStepLayoutProps = {
  currentStep: string
  stepLabel: string
  children: React.ReactNode
}

export default function CheckoutStepLayout({
  currentStep,
  stepLabel,
  children,
}: CheckoutStepLayoutProps) {
  const { items } = useCart()
  const { items: availableItems, subtotal } = useCheckout()
  const unavailableItems = items.filter((item) => item.product.stock <= 0)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <PageBreadcrumb
            items={[
              { label: 'Inicio', href: '/' },
              { label: 'Carrito', href: '/cart' },
              { label: 'Checkout', href: '/checkout/informacion' },
              { label: stepLabel },
            ]}
          />
        </div>
      </div>

      {/* Progress Steps */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <CheckoutProgress currentStep={currentStep} />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">{children}</div>

          {/* Order Summary */}
          <CheckoutOrderSummary
            items={availableItems}
            subtotal={subtotal}
            unavailableItems={unavailableItems}
          />
        </div>
      </div>
    </div>
  )
}
