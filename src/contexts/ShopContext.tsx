'use client';

import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
}

interface WishlistItem {
  id: number;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  isCartLoading: boolean;
  addToCart: (
    productId: number,
    quantity: number,
    productName?: string
  ) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  isLoggedIn: () => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);

  // Load wishlist from localStorage on component mount
  useEffect(() => {
    const savedWishlist = localStorage.getItem('wishlist');

    if (savedWishlist) {
      try {
        setWishlist(JSON.parse(savedWishlist));
      } catch (error) {
        console.error('Error parsing wishlist from localStorage:', error);
      }
    }

    // Fetch cart if user is logged in
    if (isLoggedIn()) {
      fetchCart();
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const isLoggedIn = () => {
    const authToken = Cookies.get('authToken');
    const loggedIn = Cookies.get('isLoggedIn') === 'true';
    return authToken != null && loggedIn;
  };

  const fetchCart = async () => {
    if (!isLoggedIn()) {
      setCart([]);
      return;
    }

    setIsCartLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch cart');
      }

      const data = await response.json();
      setCart(data.cart.items || []);
    } catch (error) {
      console.error('Error fetching cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToCart = async (
    productId: number,
    quantity: number,
    productName?: string
  ): Promise<boolean> => {
    if (!isLoggedIn()) {
      return false;
    }

    setIsCartLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to cart');
      }

      const data = await response.json();
      setCart(data.cart.items || []);

      toast({
        title: 'Added to Cart',
        description: `${productName || 'Product'} has been added to your cart.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to cart. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsCartLoading(false);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isLoggedIn()) return;

    setIsCartLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      const data = await response.json();
      setCart(data.cart.items || []);

      toast({
        title: 'Removed from Cart',
        description: 'Item has been removed from your cart.',
      });
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  const updateCartQuantity = async (productId: number, quantity: number) => {
    if (!isLoggedIn()) return;

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }

    setIsCartLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/cart/${productId}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${authToken}`,
          },
          body: JSON.stringify({ quantity }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update cart');
      }

      const data = await response.json();
      setCart(data.cart.items || []);
    } catch (error) {
      console.error('Error updating cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to update cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  const clearCart = async () => {
    if (!isLoggedIn()) return;

    setIsCartLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/cart`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      setCart([]);

      toast({
        title: 'Cart Cleared',
        description: 'Your cart has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear your cart. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCartLoading(false);
    }
  };

  const addToWishlist = (productId: number) => {
    if (!isInWishlist(productId)) {
      setWishlist((prevWishlist) => [...prevWishlist, { id: productId }]);
      toast({
        title: 'Added to Wishlist',
        description: 'Product has been added to your wishlist.',
      });
    }
  };

  const removeFromWishlist = (productId: number) => {
    setWishlist((prevWishlist) =>
      prevWishlist.filter((item) => item.id !== productId)
    );
    toast({
      title: 'Removed from Wishlist',
      description: 'Product has been removed from your wishlist.',
    });
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.id === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        isCartLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        fetchCart,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        isLoggedIn,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const context = useContext(ShopContext);
  if (context === undefined) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
}
