import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { useProducts } from '@/hooks/useProducts'

function CheckoutPage() {
  const { data } = useProducts({ page: 1, limit: 10 })
  const [step, setStep] = useState(1)
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [paymentMethod, setPaymentMethod] = useState('card')

  // Demo cart items
  const demoCartItems = data?.data.slice(0, 3).map((product, index) => ({
    product,
    quantity: index + 1,
  })) || []

  const subtotal = demoCartItems.reduce(
    (sum, item) => sum + (item.product.price / 100) * item.quantity,
    0
  )
  const shipping = shippingMethod === 'express' ? 8000 : shippingMethod === 'standard' ? 3000 : 0
  const tax = subtotal * 0.21
  const total = subtotal + shipping + tax

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(price)

  const steps = [
    { id: 1, name: 'Información', icon: '1' },
    { id: 2, name: 'Envío', icon: '2' },
    { id: 3, name: 'Pago', icon: '3' },
  ]

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
                  <Link to="/cart">Carrito</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Checkout</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center">
            {steps.map((s, index) => (
              <div key={s.id} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                    step >= s.id
                      ? 'bg-brand-blue text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {step > s.id ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  ) : (
                    s.icon
                  )}
                </div>
                <span
                  className={`ml-2 font-medium hidden sm:block ${
                    step >= s.id ? 'text-brand-dark' : 'text-gray-400'
                  }`}
                >
                  {s.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-4 rounded ${
                      step > s.id ? 'bg-brand-blue' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Contact & Shipping Information */}
            {step === 1 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">
                  Información de Contacto y Envío
                </h2>

                {/* Contact Info */}
                <div className="mb-8">
                  <h3 className="font-semibold text-brand-dark mb-4">Información de Contacto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" placeholder="tu@email.com" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input id="phone" type="tel" placeholder="+54 11 1234-5678" className="mt-1" />
                    </div>
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Shipping Address */}
                <div>
                  <h3 className="font-semibold text-brand-dark mb-4">Dirección de Envío</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">Nombre</Label>
                      <Input id="firstName" placeholder="Juan" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Apellido</Label>
                      <Input id="lastName" placeholder="Pérez" className="mt-1" />
                    </div>
                    <div className="md:col-span-2">
                      <Label htmlFor="address">Dirección</Label>
                      <Input id="address" placeholder="Av. Corrientes 1234" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="apartment">Depto / Piso (opcional)</Label>
                      <Input id="apartment" placeholder="Piso 5, Depto A" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="city">Ciudad</Label>
                      <Input id="city" placeholder="Buenos Aires" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="province">Provincia</Label>
                      <Input id="province" placeholder="CABA" className="mt-1" />
                    </div>
                    <div>
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input id="zipCode" placeholder="C1043" className="mt-1" />
                    </div>
                  </div>

                  <label className="flex items-center gap-3 mt-6 cursor-pointer">
                    <Checkbox />
                    <span className="text-sm text-gray-600">
                      Guardar esta dirección para futuras compras
                    </span>
                  </label>
                </div>

                <div className="flex justify-end mt-8">
                  <Button
                    onClick={() => setStep(2)}
                    size="lg"
                    className="bg-brand-blue hover:bg-blue-700"
                  >
                    Continuar al Envío
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Método de Envío</h2>

                <RadioGroup value={shippingMethod} onValueChange={setShippingMethod}>
                  <div className="space-y-4">
                    {/* Free Shipping */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingMethod === 'pickup'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="pickup" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">Retiro en Sucursal</span>
                          <span className="font-bold text-green-600">Gratis</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Retira tu pedido en cualquiera de nuestras sucursales en 24-48hs
                        </p>
                      </div>
                    </label>

                    {/* Standard Shipping */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingMethod === 'standard'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="standard" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">Envío Estándar</span>
                          <span className="font-bold text-brand-dark">{formatPrice(3000)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Entrega en 3-5 días hábiles a tu domicilio
                        </p>
                      </div>
                    </label>

                    {/* Express Shipping */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        shippingMethod === 'express'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="express" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-brand-dark">Envío Express</span>
                            <span className="px-2 py-0.5 bg-brand-orange text-white text-xs rounded-full font-medium">
                              Rápido
                            </span>
                          </div>
                          <span className="font-bold text-brand-dark">{formatPrice(8000)}</span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Entrega en 24-48 horas hábiles a tu domicilio
                        </p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(1)} size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                  </Button>
                  <Button
                    onClick={() => setStep(3)}
                    size="lg"
                    className="bg-brand-blue hover:bg-blue-700"
                  >
                    Continuar al Pago
                    <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                <h2 className="text-2xl font-bold text-brand-dark mb-6">Método de Pago</h2>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    {/* Credit Card */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'card'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="card" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">Tarjeta de Crédito/Débito</span>
                          <div className="flex gap-2">
                            <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center text-white text-xs font-bold">
                              VISA
                            </div>
                            <div className="w-10 h-6 bg-red-500 rounded flex items-center justify-center text-white text-xs font-bold">
                              MC
                            </div>
                            <div className="w-10 h-6 bg-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                              AMEX
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Hasta 12 cuotas sin interés
                        </p>
                      </div>
                    </label>

                    {/* MercadoPago */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'mercadopago'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="mercadopago" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">MercadoPago</span>
                          <div className="w-24 h-6 bg-[#00B1EA] rounded flex items-center justify-center text-white text-xs font-bold">
                            MercadoPago
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Paga con tu cuenta de MercadoPago o QR
                        </p>
                      </div>
                    </label>

                    {/* Bank Transfer */}
                    <label
                      className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                        paymentMethod === 'transfer'
                          ? 'border-brand-blue bg-brand-light/30'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <RadioGroupItem value="transfer" className="mt-1" />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-brand-dark">Transferencia Bancaria</span>
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full font-medium">
                            10% OFF
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          Transferencia o depósito bancario con 10% de descuento
                        </p>
                      </div>
                    </label>
                  </div>
                </RadioGroup>

                {/* Card Form */}
                {paymentMethod === 'card' && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <Label htmlFor="cardNumber">Número de Tarjeta</Label>
                        <Input
                          id="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          className="mt-1"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="cardName">Nombre en la Tarjeta</Label>
                        <Input id="cardName" placeholder="JUAN PEREZ" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="expiry">Fecha de Vencimiento</Label>
                        <Input id="expiry" placeholder="MM/AA" className="mt-1" />
                      </div>
                      <div>
                        <Label htmlFor="cvv">CVV</Label>
                        <Input id="cvv" placeholder="123" className="mt-1" />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label htmlFor="installments">Cuotas</Label>
                      <select
                        id="installments"
                        className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-blue"
                      >
                        <option value="1">1 cuota de {formatPrice(total)} (sin interés)</option>
                        <option value="3">3 cuotas de {formatPrice(total / 3)} (sin interés)</option>
                        <option value="6">6 cuotas de {formatPrice(total / 6)} (sin interés)</option>
                        <option value="12">12 cuotas de {formatPrice(total / 12)} (sin interés)</option>
                      </select>
                    </div>
                  </div>
                )}

                <Separator className="my-6" />

                {/* Billing Address */}
                <Accordion type="single" collapsible>
                  <AccordionItem value="billing" className="border-none">
                    <AccordionTrigger className="hover:no-underline">
                      <span className="font-semibold text-brand-dark">
                        Dirección de Facturación
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <label className="flex items-center gap-3 mb-4 cursor-pointer">
                        <Checkbox defaultChecked />
                        <span className="text-sm text-gray-600">
                          Usar la misma dirección de envío
                        </span>
                      </label>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="flex justify-between mt-8">
                  <Button variant="outline" onClick={() => setStep(2)} size="lg">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver
                  </Button>
                  <Button size="lg" className="bg-brand-orange hover:bg-orange-600">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                    Confirmar Pedido
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
              <h2 className="text-xl font-bold text-brand-dark mb-4">Resumen del Pedido</h2>

              {/* Cart Items */}
              <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                {demoCartItems.map((item) => (
                  <div key={item.product.id} className="flex gap-3">
                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 relative">
                      {item.product.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                      )}
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-blue text-white text-xs rounded-full flex items-center justify-center font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-brand-dark text-sm truncate">
                        {item.product.name}
                      </p>
                      <p className="text-brand-orange font-semibold text-sm">
                        {formatPrice((item.product.price / 100) * item.quantity)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Button asChild variant="link" className="p-0 h-auto text-brand-blue mb-4">
                <Link to="/cart">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                  Editar Carrito
                </Link>
              </Button>

              <Separator className="my-4" />

              {/* Price Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span>{shipping === 0 ? 'Gratis' : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>IVA (21%)</span>
                  <span>{formatPrice(tax)}</span>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Total */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold text-brand-dark">Total</span>
                <span className="text-2xl font-bold text-brand-orange">{formatPrice(total)}</span>
              </div>

              {/* Trust Badges */}
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg text-sm text-green-700">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span>Tu información está segura y protegida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage
