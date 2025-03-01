import type React from 'react';

import { createContext, useContext, useState } from 'react';

interface CheckoutProduct {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  quantity: number;
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
  total: number;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

export function CheckoutProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<CheckoutProduct[]>([]);
  const shippingRate = 200; // ₹200 flat rate shipping

  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );
  const shipping = products.length > 0 ? shippingRate : 0;
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

  return (
    <CheckoutContext.Provider
      value={{
        products,
        addProduct,
        addProducts,
        removeProduct,
        updateQuantity,
        clearCheckout,
        subtotal,
        shipping,
        total,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (context === undefined) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}
