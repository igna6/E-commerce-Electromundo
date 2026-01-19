import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import type { Product } from '@/types/product'
import type { CartItem } from '@/types/cart'

const CART_STORAGE_KEY = 'electromundo-cart'

type CartContextType = {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
  isInCart: (productId: number) => boolean
  getItemQuantity: (productId: number) => number
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed)) {
          setItems(parsed)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
    }
    setIsInitialized(true)
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [items, isInitialized])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((currentItems) => {
      const existingIndex = currentItems.findIndex(
        (item) => item.product.id === product.id
      )

      if (existingIndex >= 0) {
        // Update quantity if already in cart
        const updated = [...currentItems]
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        }
        return updated
      }

      // Add new item
      return [...currentItems, { product, quantity }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((currentItems) =>
      currentItems.filter((item) => item.product.id !== productId)
    )
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) {
      return removeItem(productId)
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }, [removeItem])

  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  const isInCart = useCallback(
    (productId: number) => items.some((item) => item.product.id === productId),
    [items]
  )

  const getItemQuantity = useCallback(
    (productId: number) => {
      const item = items.find((item) => item.product.id === productId)
      return item?.quantity ?? 0
    },
    [items]
  )

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isInCart,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
