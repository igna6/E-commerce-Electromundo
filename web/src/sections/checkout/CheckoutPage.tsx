import { useState, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
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
import { useCart } from '@/contexts/CartContext'
import { createOrder } from '@/services/orders.service'

const checkoutSchema = z.object({
  email: z.string().email('Email inválido'),
  phone: z.string().min(1, 'Teléfono requerido'),
  firstName: z.string().min(1, 'Nombre requerido'),
  lastName: z.string().min(1, 'Apellido requerido'),
  address: z.string().min(1, 'Dirección requerida'),
  apartment: z.string().optional(),
  city: z.string().min(1, 'Ciudad requerida'),
  province: z.string().min(1, 'Provincia requerida'),
  zipCode: z.string().min(1, 'Código postal requerido'),
})

type CheckoutFormData = z.infer<typeof checkoutSchema>

function CheckoutPage() {
  const navigate = useNavigate()
  const { items, subtotal, clearCart } = useCart()
  const [step, setStep] = useState(1)
  const [shippingMethod, setShippingMethod] = useState<'pickup' | 'standard' | 'express'>('standard')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'mercadopago' | 'transfer'>('card')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) {
      navigate({ to: '/cart' })
    }
  }, [items.length, navigate])

  // Shipping costs in cents
  const shippingCost = shippingMethod === 'express' ? 800000 : shippingMethod === 'standard' ? 300000 : 0
  const tax = Math.round(subtotal * 0.21)
  const total = subtotal + shippingCost + tax

  const formatPrice = (cents: number) =>
    new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
    }).format(cents / 100)

  const steps = [
    { id: 1, name: 'Información', icon: '1' },
    { id: 2, name: 'Envío', icon: '2' },
    { id: 3, name: 'Pago', icon: '3' },
  ]

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['email', 'phone', 'firstName', 'lastName', 'address', 'city', 'province', 'zipCode'])
      if (isValid) {
        setStep(2)
      }
    } else if (step === 2) {
      setStep(3)
    }
  }

  const onSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const orderPayload = {
        ...data,
        apartment: data.apartment || null,
        shippingMethod,
        paymentMethod,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      }

      const response = await createOrder(orderPayload)
      clearCart()
      navigate({ to: '/order-confirmation', search: { orderId: response.data.id } })
    } catch (error) {
      console.error('Error creating order:', error)
      setSubmitError('Error al procesar el pedido. Por favor intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (items.length === 0) {
    return null
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
                      ? 'bg-primary text-white'
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
                    step >= s.id ? 'text-slate-900' : 'text-gray-400'
                  }`}
                >
                  {s.name}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-16 sm:w-24 h-1 mx-4 rounded ${
                      step > s.id ? 'bg-primary' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Step 1: Contact & Shipping Information */}
              {step === 1 && (
                <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Información de Contacto y Envío
                  </h2>

                  {/* Contact Info */}
                  <div className="mb-8">
                    <h3 className="font-semibold text-slate-900 mb-4">Información de Contacto</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="tu@email.com"
                          className={`mt-1 ${errors.email ? 'border-red-500' : ''}`}
                          {...register('email')}
                        />
                        {errors.email && (
                          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="phone">Teléfono</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+54 11 1234-5678"
                          className={`mt-1 ${errors.phone ? 'border-red-500' : ''}`}
                          {...register('phone')}
                        />
                        {errors.phone && (
                          <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  {/* Shipping Address */}
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-4">Dirección de Envío</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">Nombre</Label>
                        <Input
                          id="firstName"
                          placeholder="Juan"
                          className={`mt-1 ${errors.firstName ? 'border-red-500' : ''}`}
                          {...register('firstName')}
                        />
                        {errors.firstName && (
                          <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="lastName">Apellido</Label>
                        <Input
                          id="lastName"
                          placeholder="Pérez"
                          className={`mt-1 ${errors.lastName ? 'border-red-500' : ''}`}
                          {...register('lastName')}
                        />
                        {errors.lastName && (
                          <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>
                        )}
                      </div>
                      <div className="md:col-span-2">
                        <Label htmlFor="address">Dirección</Label>
                        <Input
                          id="address"
                          placeholder="Av. Corrientes 1234"
                          className={`mt-1 ${errors.address ? 'border-red-500' : ''}`}
                          {...register('address')}
                        />
                        {errors.address && (
                          <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="apartment">Depto / Piso (opcional)</Label>
                        <Input
                          id="apartment"
                          placeholder="Piso 5, Depto A"
                          className="mt-1"
                          {...register('apartment')}
                        />
                      </div>
                      <div>
                        <Label htmlFor="city">Ciudad</Label>
                        <Input
                          id="city"
                          placeholder="Buenos Aires"
                          className={`mt-1 ${errors.city ? 'border-red-500' : ''}`}
                          {...register('city')}
                        />
                        {errors.city && (
                          <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="province">Provincia</Label>
                        <Input
                          id="province"
                          placeholder="CABA"
                          className={`mt-1 ${errors.province ? 'border-red-500' : ''}`}
                          {...register('province')}
                        />
                        {errors.province && (
                          <p className="text-red-500 text-sm mt-1">{errors.province.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="zipCode">Código Postal</Label>
                        <Input
                          id="zipCode"
                          placeholder="C1043"
                          className={`mt-1 ${errors.zipCode ? 'border-red-500' : ''}`}
                          {...register('zipCode')}
                        />
                        {errors.zipCode && (
                          <p className="text-red-500 text-sm mt-1">{errors.zipCode.message}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end mt-8">
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de Envío</h2>

                  <RadioGroup value={shippingMethod} onValueChange={(value) => setShippingMethod(value as 'pickup' | 'standard' | 'express')}>
                    <div className="space-y-4">
                      {/* Free Shipping */}
                      <label
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          shippingMethod === 'pickup'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="pickup" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Retiro en Sucursal</span>
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
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="standard" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Envío Estándar</span>
                            <span className="font-bold text-slate-900">{formatPrice(300000)}</span>
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
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="express" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="font-semibold text-slate-900">Envío Express</span>
                              <span className="px-2 py-0.5 bg-primary text-white text-xs rounded-full font-medium">
                                Rápido
                              </span>
                            </div>
                            <span className="font-bold text-slate-900">{formatPrice(800000)}</span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            Entrega en 24-48 horas hábiles a tu domicilio
                          </p>
                        </div>
                      </label>
                    </div>
                  </RadioGroup>

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={() => setStep(1)} size="lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Volver
                    </Button>
                    <Button
                      type="button"
                      onClick={handleNextStep}
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de Pago</h2>

                  <RadioGroup value={paymentMethod} onValueChange={(value) => setPaymentMethod(value as 'card' | 'mercadopago' | 'transfer')}>
                    <div className="space-y-4">
                      {/* Credit Card */}
                      <label
                        className={`flex items-start gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all ${
                          paymentMethod === 'card'
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="card" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Tarjeta de Crédito/Débito</span>
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
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="mercadopago" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">MercadoPago</span>
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
                            ? 'border-primary bg-primary/5'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <RadioGroupItem value="transfer" className="mt-1" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-slate-900">Transferencia Bancaria</span>
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

                  {/* Card Form - Only shown when card is selected */}
                  {paymentMethod === 'card' && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600 mb-4">
                        Los datos de la tarjeta se solicitarán en el siguiente paso del proceso de pago seguro.
                      </p>
                    </div>
                  )}

                  <Separator className="my-6" />

                  {/* Billing Address */}
                  <Accordion type="single" collapsible>
                    <AccordionItem value="billing" className="border-none">
                      <AccordionTrigger className="hover:no-underline">
                        <span className="font-semibold text-slate-900">
                          Dirección de Facturación
                        </span>
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="text-sm text-gray-600">
                          Se utilizará la misma dirección de envío para la facturación.
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {submitError && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                      {submitError}
                    </div>
                  )}

                  <div className="flex justify-between mt-8">
                    <Button type="button" variant="outline" onClick={() => setStep(2)} size="lg">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                      </svg>
                      Volver
                    </Button>
                    <Button
                      type="submit"
                      size="lg"
                      className="bg-primary hover:bg-primary/90"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          Procesando...
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                          </svg>
                          Confirmar Pedido
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-bold text-slate-900 mb-4">Resumen del Pedido</h2>

                {/* Cart Items */}
                <div className="space-y-4 max-h-64 overflow-y-auto mb-4">
                  {items.map((item) => (
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
                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center font-medium">
                          {item.quantity}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 text-sm truncate">
                          {item.product.name}
                        </p>
                        <p className="text-primary font-semibold text-sm">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild variant="link" className="p-0 h-auto text-primary mb-4">
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
                    <span>{shippingCost === 0 ? 'Gratis' : formatPrice(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (21%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Total */}
                <div className="flex justify-between items-center mb-4">
                  <span className="text-lg font-semibold text-slate-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{formatPrice(total)}</span>
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
        </form>
      </div>
    </div>
  )
}

export default CheckoutPage
