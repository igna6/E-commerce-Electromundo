import type { ActorRefFrom } from 'xstate'
import { useSelector } from '@xstate/react'
import type { checkoutMachine } from '@/machines/checkoutMachine'

const steps = [
  { id: 'contactInfo', name: 'Informaci\u00f3n', icon: '1' },
  { id: 'shipping', name: 'Env\u00edo', icon: '2' },
  { id: 'payment', name: 'Pago', icon: '3' },
] as const

type CheckoutStepsProps = {
  actorRef: ActorRefFrom<typeof checkoutMachine>
}

const stepOrder = ['contactInfo', 'shipping', 'payment', 'submitting', 'success'] as const

function getStepIndex(stateValue: string): number {
  return stepOrder.indexOf(stateValue as (typeof stepOrder)[number])
}

export default function CheckoutSteps({ actorRef }: CheckoutStepsProps) {
  const currentState = useSelector(actorRef, (state) => {
    if (state.matches('contactInfo')) return 'contactInfo'
    if (state.matches('shipping')) return 'shipping'
    if (state.matches('payment') || state.matches('submitting')) return 'payment'
    return 'success'
  })

  const currentIndex = getStepIndex(currentState)

  return (
    <div className="mb-8">
      <div className="flex items-center justify-center">
        {steps.map((s, index) => {
          const stepIndex = getStepIndex(s.id)
          const isComplete = currentIndex > stepIndex
          const isActive = currentIndex >= stepIndex

          return (
            <div key={s.id} className="flex items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold transition-colors ${
                  isActive
                    ? 'bg-primary text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {isComplete ? (
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
                  isActive ? 'text-slate-900' : 'text-gray-400'
                }`}
              >
                {s.name}
              </span>
              {index < steps.length - 1 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-4 rounded ${
                    isComplete ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
