import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import type { CartItem } from '@/types/cart'

export type CheckoutData = {
  email: string
  phone: string
  firstName: string
  lastName: string
}

type CheckoutStep = 'informacion' | 'confirmar'

const STEP_ORDER: Array<CheckoutStep> = ['informacion', 'confirmar']

type CheckoutContextValue = {
  data: Partial<CheckoutData>
  updateData: (partial: Partial<CheckoutData>) => void
  completedSteps: Set<CheckoutStep>
  completeStep: (step: CheckoutStep) => void
  canAccessStep: (step: CheckoutStep) => boolean
  items: Array<CartItem>
  subtotal: number
}

const CheckoutContext = createContext<CheckoutContextValue | null>(null)

export function CheckoutProvider({
  children,
  items,
  subtotal,
}: {
  children: React.ReactNode
  items: Array<CartItem>
  subtotal: number
}) {
  const [data, setData] = useState<Partial<CheckoutData>>({})
  const [completedSteps, setCompletedSteps] = useState<Set<CheckoutStep>>(new Set())

  const updateData = useCallback((partial: Partial<CheckoutData>) => {
    setData((prev) => ({ ...prev, ...partial }))
  }, [])

  const completeStep = useCallback((step: CheckoutStep) => {
    setCompletedSteps((prev) => new Set([...prev, step]))
  }, [])

  const canAccessStep = useCallback(
    (step: CheckoutStep) => {
      const stepIndex = STEP_ORDER.indexOf(step)
      if (stepIndex === 0) return true
      return STEP_ORDER.slice(0, stepIndex).every((s) => completedSteps.has(s))
    },
    [completedSteps]
  )

  const value = useMemo(
    () => ({
      data,
      updateData,
      completedSteps,
      completeStep,
      canAccessStep,
      items,
      subtotal,
    }),
    [data, updateData, completedSteps, completeStep, canAccessStep, items, subtotal]
  )

  return <CheckoutContext.Provider value={value}>{children}</CheckoutContext.Provider>
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext)
  if (!ctx) {
    throw new Error('useCheckout must be used within a CheckoutProvider')
  }
  return ctx
}
