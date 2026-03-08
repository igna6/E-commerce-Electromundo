import { setup, assign } from 'xstate'
import { createOrder } from '@/services/orders.service'
import type { CreateOrderPayload } from '@/types/order'

export type StockError = {
  productName: string
  requested: number
  available: number
}

export type CheckoutContext = {
  submitError: string | null
  stockErrors: StockError[]
}

export type CheckoutEvent = { type: 'SUBMIT'; formData: CreateOrderPayload }

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
    input: {} as { items: { product: { id: number }; quantity: number }[] },
  },
  actors: {
    submitOrder: {
      src: async (_: unknown, { formData }: { formData: CreateOrderPayload }) => {
        const response = await createOrder(formData)
        return response.data
      },
    },
  },
}).createMachine({
  id: 'checkout',
  initial: 'contactInfo',
  context: {
    submitError: null,
    stockErrors: [],
  },
  states: {
    contactInfo: {
      on: {
        SUBMIT: {
          target: 'submitting',
          actions: assign({
            submitError: () => null,
            stockErrors: () => [] as StockError[],
          }),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitOrder',
        input: ({ event }) => {
          if (event.type !== 'SUBMIT') throw new Error('Unexpected event')
          return { formData: event.formData }
        },
        onDone: 'success',
        onError: {
          target: 'contactInfo',
          actions: assign({
            submitError: ({ event }) => {
              const error = event.error as Record<string, unknown>
              const data = error?.['data'] as Record<string, unknown> | undefined
              if (error?.['status'] === 409 && data?.['details']) {
                return 'Algunos productos no tienen suficiente stock.'
              }
              return 'Error al procesar el pedido. Por favor intenta nuevamente.'
            },
            stockErrors: ({ event }) => {
              const error = event.error as Record<string, unknown>
              const data = error?.['data'] as Record<string, unknown> | undefined
              if (error?.['status'] === 409 && data?.['details']) {
                return data['details'] as StockError[]
              }
              return [] as StockError[]
            },
          }),
        },
      },
    },
    success: {
      type: 'final',
    },
  },
})
