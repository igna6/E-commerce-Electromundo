import { assign, fromPromise, setup } from 'xstate'
import type { CreateOrderPayload } from '@/types/order'
import { createOrder } from '@/services/orders.service'

export type StockError = {
  productName: string
  requested: number
  available: number
}

export type OrderResult = {
  id: number
  accessToken: string
}

export type CheckoutContext = {
  submitError: string | null
  stockErrors: Array<StockError>
  orderResult: OrderResult | null
}

export type CheckoutEvent = { type: 'SUBMIT'; formData: CreateOrderPayload }

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
    input: {} as { items: Array<{ product: { id: number }; quantity: number }> },
  },
  actors: {
    submitOrder: fromPromise(async ({ input }: { input: { formData: CreateOrderPayload } }) => {
      const response = await createOrder(input.formData)
      return response.data
    }),
  },
}).createMachine({
  id: 'checkout',
  initial: 'idle',
  context: {
    submitError: null,
    stockErrors: [],
    orderResult: null,
  },
  states: {
    idle: {
      on: {
        SUBMIT: {
          target: 'submitting',
          actions: assign({
            submitError: () => null,
            stockErrors: () => [] as Array<StockError>,
          }),
        },
      },
    },
    submitting: {
      invoke: {
        src: 'submitOrder',
        input: ({ event }) => {
          return { formData: event.formData }
        },
        onDone: {
          target: 'success',
          actions: assign({
            orderResult: ({ event }) => event.output as OrderResult,
          }),
        },
        onError: {
          target: 'idle',
          actions: assign({
            submitError: ({ event }) => {
              const error = event.error as Record<string, unknown>
              const data = error['data'] as Record<string, unknown> | undefined
              if (error['status'] === 409 && data?.['details']) {
                return 'Algunos productos no tienen suficiente stock.'
              }
              return 'Error al procesar el pedido. Por favor intenta nuevamente.'
            },
            stockErrors: ({ event }) => {
              const error = event.error as Record<string, unknown>
              const data = error['data'] as Record<string, unknown> | undefined
              if (error['status'] === 409 && data?.['details']) {
                return data['details'] as Array<StockError>
              }
              return [] as Array<StockError>
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
