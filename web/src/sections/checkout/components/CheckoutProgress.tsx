import { Link } from '@tanstack/react-router'
import { useCheckout } from '@/contexts/CheckoutContext'
import { cn } from '@/lib/utils'

type Step = {
  key: 'informacion' | 'confirmar'
  label: string
  path: string
}

const STEPS: Array<Step> = [
  { key: 'informacion', label: 'Contacto', path: '/checkout/informacion' },
  { key: 'confirmar', label: 'Confirmar', path: '/checkout/confirmar' },
]

export default function CheckoutProgress({ currentStep }: { currentStep: string }) {
  const { completedSteps, canAccessStep } = useCheckout()
  const currentIndex = STEPS.findIndex((s) => s.key === currentStep)

  return (
    <div className="flex items-center justify-center gap-0 w-full max-w-2xl mx-auto">
      {STEPS.map((step, index) => {
        const isCompleted = completedSteps.has(step.key)
        const isCurrent = step.key === currentStep
        const isAccessible = canAccessStep(step.key)
        const isLast = index === STEPS.length - 1

        return (
          <div key={step.key} className={cn('flex items-center', !isLast && 'flex-1')}>
            {/* Step circle + label */}
            <div className="flex flex-col items-center">
              {isAccessible && !isCurrent ? (
                <Link to={step.path} className="flex flex-col items-center group">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
                      isCompleted
                        ? 'bg-primary text-white'
                        : 'border-2 border-gray-300 text-gray-400 group-hover:border-primary group-hover:text-primary'
                    )}
                  >
                    {isCompleted ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      index + 1
                    )}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-1.5 font-medium transition-colors',
                      isCompleted ? 'text-primary' : 'text-gray-400 group-hover:text-primary'
                    )}
                  >
                    {step.label}
                  </span>
                </Link>
              ) : (
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold',
                      isCurrent
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'border-2 border-gray-300 text-gray-400'
                    )}
                  >
                    {index + 1}
                  </div>
                  <span
                    className={cn(
                      'text-xs mt-1.5 font-medium',
                      isCurrent ? 'text-primary' : 'text-gray-400'
                    )}
                  >
                    {step.label}
                  </span>
                </div>
              )}
            </div>

            {/* Connector line */}
            {!isLast && (
              <div className="flex-1 mx-2 mt-[-18px]">
                <div
                  className={cn(
                    'h-0.5 w-full',
                    index < currentIndex ? 'bg-primary' : 'bg-gray-300'
                  )}
                />
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
