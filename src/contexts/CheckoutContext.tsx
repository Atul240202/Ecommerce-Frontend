"use client";

import type React from "react";

import { createContext, useContext, useState } from "react";

interface CheckoutProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
  sku: string;
  shipping_amount?: number;
  weight?: string;
}

interface CheckoutContextType {
  products: CheckoutProduct[];
  addProduct: (product: CheckoutProduct) => void;
  addProducts: (products: CheckoutProduct[]) => void;
  removeProduct: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCheckout: () => void;
  subtotal: number;
  shipping: number;
  updateShipping: (amount: number) => void; // Add this line
  total: number;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

// Add updateShipping to the context provider
export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const [shipping, setShipping] = useState<number>(0);

  // Add updateShipping function
  const updateShipping = (amount: number) => {
    setShipping(amount);
  };

  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  // const shipping =
  //   products.length > 0
  //     ? (() => {
  //         const shippingValues = products
  //           .map((p) => (p as any).shipping_amount)
  //           .filter((v) => typeof v === "number");
  //         return shippingValues.length > 0 ? Math.max(...shippingValues) : 200;
  //       })()
  //     : 0;

  const total = subtotal + shipping;

  const addProduct = (product: CheckoutProduct) => {
    setProducts([product]);
  };

  const addProducts = (newProducts: CheckoutProduct[]) => {
    setProducts(newProducts);
  };

  const removeProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    setProducts(
      products.map((p) => (p.id === productId ? { ...p, quantity } : p))
    );
  };

  const clearCheckout = () => {
    setProducts([]);
  };

  // Include updateShipping in the context value
  const value = {
    products,
    addProduct,
    addProducts,
    removeProduct,
    updateQuantity,
    clearCheckout,
    subtotal,
    shipping,
    updateShipping, // Add this line
    total,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
}
