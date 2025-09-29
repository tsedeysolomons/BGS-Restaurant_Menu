"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"
import type { CartItem, MenuItem, CartExtra } from "@/lib/types"

interface CartState {
  items: CartItem[]
  total: number
}

type CartAction =
  | { type: "ADD_ITEM"; payload: { menuItem: MenuItem; quantity: number; selectedExtras: CartExtra[] } }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }

const CartContext = createContext<{
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addItem: (menuItem: MenuItem, quantity: number, selectedExtras: CartExtra[]) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemCount: () => number
} | null>(null)

function calculateItemTotal(menuItem: MenuItem, quantity: number, selectedExtras: CartExtra[]): number {
  const itemTotal = menuItem.price * quantity
  const extrasTotal = selectedExtras.reduce((sum, extra) => sum + extra.extra.price * extra.quantity, 0)
  return itemTotal + extrasTotal
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const { menuItem, quantity, selectedExtras } = action.payload
      const id = `${menuItem.id}-${Date.now()}`
      const totalPrice = calculateItemTotal(menuItem, quantity, selectedExtras)

      const newItem: CartItem = {
        id,
        menuItem,
        quantity,
        selectedExtras,
        totalPrice,
      }

      const newItems = [...state.items, newItem]
      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        total: newTotal,
      }
    }

    case "REMOVE_ITEM": {
      const newItems = state.items.filter((item) => item.id !== action.payload)
      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        total: newTotal,
      }
    }

    case "UPDATE_QUANTITY": {
      const { id, quantity } = action.payload
      const newItems = state.items.map((item) => {
        if (item.id === id) {
          const totalPrice = calculateItemTotal(item.menuItem, quantity, item.selectedExtras)
          return { ...item, quantity, totalPrice }
        }
        return item
      })
      const newTotal = newItems.reduce((sum, item) => sum + item.totalPrice, 0)

      return {
        items: newItems,
        total: newTotal,
      }
    }

    case "CLEAR_CART":
      return {
        items: [],
        total: 0,
      }

    case "LOAD_CART":
      return action.payload

    default:
      return state
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    total: 0,
  })

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("bgs-restaurant-cart")
    if (savedCart) {
      try {
        const cartData = JSON.parse(savedCart)
        dispatch({ type: "LOAD_CART", payload: cartData })
      } catch (error) {
        console.error("Error loading cart from localStorage:", error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("bgs-restaurant-cart", JSON.stringify(state))
  }, [state])

  const addItem = (menuItem: MenuItem, quantity: number, selectedExtras: CartExtra[]) => {
    dispatch({ type: "ADD_ITEM", payload: { menuItem, quantity, selectedExtras } })
  }

  const removeItem = (id: string) => {
    dispatch({ type: "REMOVE_ITEM", payload: id })
  }

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } })
    }
  }

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" })
  }

  const getItemCount = () => {
    return state.items.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <CartContext.Provider
      value={{
        state,
        dispatch,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
