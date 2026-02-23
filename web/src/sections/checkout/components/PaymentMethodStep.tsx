import { Link } from '@tanstack/react-router'
import type { ActorRefFrom } from 'xstate'
import { useSelector } from '@xstate/react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import type { checkoutMachine } from '@/machines/checkoutMachine'
import type { CreateOrderPayload } from '@/types/order'

type PaymentMethodStepProps = {
  actorRef: ActorRefFrom<typeof checkoutMachine>
  onSubmit: () => CreateOrderPayload | null
}

export default function PaymentMethodStep({ actorRef, onSubmit }: PaymentMethodStepProps) {
  const paymentMethod = useSelector(actorRef, (state) => state.context.paymentMethod)
  const submitError = useSelector(actorRef, (state) => state.context.submitError)
  const stockErrors = useSelector(actorRef, (state) => state.context.stockErrors)
  const isSubmitting = useSelector(actorRef, (state) => state.matches('submitting'))

  const handleSubmit = () => {
    const formData = onSubmit()
    if (formData) {
      actorRef.send({ type: 'SUBMIT', formData })
    }
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de Pago</h2>

      <RadioGroup
        value={paymentMethod}
        onValueChange={(value) =>
          actorRef.send({ type: 'SET_PAYMENT_METHOD', method: value as 'card' | 'mercadopago' | 'transfer' })
        }
      >
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

      {/* Card Form notice */}
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
          <p className="font-medium">{submitError}</p>
          {stockErrors.length > 0 && (
            <ul className="mt-2 space-y-1">
              {stockErrors.map((item, i) => (
                <li key={i}>
                  <strong>{item.productName}</strong>: pediste {item.requested}, disponible{' '}
                  {item.available === 0 ? 'agotado' : item.available}
                </li>
              ))}
            </ul>
          )}
          <Link to="/cart" className="inline-block mt-2 text-primary hover:underline font-medium">
            Volver al carrito para ajustar
          </Link>
        </div>
      )}

      <div className="flex justify-between mt-8">
        <Button type="button" variant="outline" onClick={() => actorRef.send({ type: 'BACK' })} size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
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
  )
}
