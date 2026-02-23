import { setup, assign } from 'xstate'
import { createOrder } from '@/services/orders.service'
import type { CreateOrderPayload } from '@/types/order'
import type { CartItem } from '@/types/cart'

export type StockError = {
  productName: string
  requested: number
  available: number
}

export type CheckoutContext = {
  shippingMethod: 'pickup' | 'standard' | 'express'
  paymentMethod: 'card' | 'mercadopago' | 'transfer'
  submitError: string | null
  stockErrors: StockError[]
}

export type CheckoutEvent =
  | { type: 'NEXT' }
  | { type: 'BACK' }
  | { type: 'SUBMIT'; formData: CreateOrderPayload }
  | { type: 'SET_SHIPPING_METHOD'; method: 'pickup' | 'standard' | 'express' }
  | { type: 'SET_PAYMENT_METHOD'; method: 'card' | 'mercadopago' | 'transfer' }

export const checkoutMachine = setup({
  types: {
    context: {} as CheckoutContext,
    events: {} as CheckoutEvent,
    input: {} as { items: CartItem[] },
  },
  actors: {
    submitOrder: {
      src: async (_, { formData }: { formData: CreateOrderPayload }) => {
        const response = await createOrder(formData)
        return response.data
      },
    },
  },
}).createMachine({
  id: 'checkout',
  initial: 'contactInfo',
  context: {
    shippingMethod: 'standard',
    paymentMethod: 'card',
    submitError: null,
    stockErrors: [],
  },
  states: {
    contactInfo: {
      on: {
        NEXT: 'shipping',
        SET_SHIPPING_METHOD: {
          actions: assign({
            shippingMethod: ({ event }) => event.method,
          }),
        },
        SET_PAYMENT_METHOD: {
          actions: assign({
            paymentMethod: ({ event }) => event.method,
          }),
        },
      },
    },
    shipping: {
      on: {
        NEXT: 'payment',
        BACK: 'contactInfo',
        SET_SHIPPING_METHOD: {
          actions: assign({
            shippingMethod: ({ event }) => event.method,
          }),
        },
      },
    },
    payment: {
      on: {
        BACK: 'shipping',
        SET_PAYMENT_METHOD: {
          actions: assign({
            paymentMethod: ({ event }) => event.method,
          }),
        },
        SUBMIT: {
          target: 'submitting',
          actions: assign({
            submitError: () => null,
            stockErrors: () => [],
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
          target: 'payment',
          actions: assign({
            submitError: ({ event }) => {
              const error = event.error as any
              if (error?.status === 409 && error?.data?.details) {
                return 'Algunos productos no tienen suficiente stock.'
              }
              return 'Error al procesar el pedido. Por favor intenta nuevamente.'
            },
            stockErrors: ({ event }) => {
              const error = event.error as any
              if (error?.status === 409 && error?.data?.details) {
                return error.data.details as StockError[]
              }
              return []
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
