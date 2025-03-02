import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

interface CartProduct {
  id: number;
  quantity: number;
}

interface CartItem {
  id: number;
  title: string;
  price: number;
  quantity: number;
  total: number;
  discountPercentage: number;
  discountedTotal: number;
  thumbnail: string;
}

interface Cart {
  id: number;
  products: CartItem[];
  total: number;
  discountedTotal: number;
  userId: number;
  totalProducts: number;
  totalQuantity: number;
}

interface ShopContextType {
  cart: Cart | null;
  wishlist: number[];
  addToCart: (productId: number, quantity: number) => Promise<void>;
  updateCartItem: (productId: number, quantity: number) => Promise<void>;
  removeFromCart: (cartId: number) => Promise<void>;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  fetchCart: () => Promise<void>;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);

  // Fetch cart on mount and when auth token changes
  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    const authToken = Cookies.get('authToken');

    if (!authToken) {
      setCart(null);
      return;
    }

    try {
      const res = await fetch(`https://dummyjson.com/carts/user/1`);
      const data = await res.json();

      // Check if the response has carts and at least one cart with products
      if (
        data.carts &&
        data.carts.length > 0 &&
        data.carts[0].products.length > 0
      ) {
        setCart(data.carts[0]);
      } else {
        // If no carts or empty cart, set cart to null
        setCart(null);
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      // On error, set cart to null
      setCart(null);
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    const authToken = Cookies.get('authToken');
    if (!authToken) return;

    try {
      const res = await fetch('https://dummyjson.com/carts/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: authToken,
          products: [{ id: productId, quantity }],
        }),
      });
      const data = await res.json();
      if (data) {
        console.log('Data has been added');
        await fetchCart();
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const updateCartItem = async (productId: number, quantity: number) => {
    const authToken = Cookies.get('authToken');
    if (!authToken || !cart) return;

    try {
      const res = await fetch(`https://dummyjson.com/carts/${cart.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          merge: true,
          products: [{ id: productId, quantity }],
        }),
      });
      const data = await res.json();
      await fetchCart(); // Refresh cart after updating
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeFromCart = async (cartId: number) => {
    try {
      const res = await fetch(`https://dummyjson.com/carts/${cartId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.isDeleted) {
        await fetchCart(); // Refresh cart after deletion
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  // Wishlist functions (stored locally)
  const addToWishlist = (productId: number) => {
    setWishlist((prev) => {
      if (!prev.includes(productId)) {
        return [...prev, productId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  const isInWishlist = (productId: number) => {
    return wishlist.includes(productId);
  };

  const value = {
    cart,
    wishlist,
    addToCart,
    updateCartItem,
    removeFromCart,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    fetchCart,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
