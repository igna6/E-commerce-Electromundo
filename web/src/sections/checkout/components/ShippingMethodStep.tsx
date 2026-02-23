import type { ActorRefFrom } from 'xstate'
import { useSelector } from '@xstate/react'
import { Button } from '@/components/ui/button'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { formatPrice } from '@/utils/formatPrice'
import type { checkoutMachine } from '@/machines/checkoutMachine'

type ShippingMethodStepProps = {
  actorRef: ActorRefFrom<typeof checkoutMachine>
}

export default function ShippingMethodStep({ actorRef }: ShippingMethodStepProps) {
  const shippingMethod = useSelector(actorRef, (state) => state.context.shippingMethod)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 md:p-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">Método de Envío</h2>

      <RadioGroup
        value={shippingMethod}
        onValueChange={(value) =>
          actorRef.send({ type: 'SET_SHIPPING_METHOD', method: value as 'pickup' | 'standard' | 'express' })
        }
      >
        <div className="space-y-4">
          {/* Pickup */}
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

          {/* Standard */}
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

          {/* Express */}
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
        <Button type="button" variant="outline" onClick={() => actorRef.send({ type: 'BACK' })} size="lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver
        </Button>
        <Button
          type="button"
          onClick={() => actorRef.send({ type: 'NEXT' })}
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
  )
}
