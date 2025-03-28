import type React from 'react';

import { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { toast } from '../components/ui/use-toast';

interface CartItem {
  productId: number;
  quantity: number;
  name: string;
  price: number;
  image: string;
  sku: string;
}

interface WishlistItem {
  productId: number;
  name: string;
  price: number;
  image: string;
  stock_status: string;
  addedAt: string;
  sku: string;
}

interface ShopContextType {
  cart: CartItem[];
  wishlist: WishlistItem[];
  isCartLoading: boolean;
  isWishlistLoading: boolean;
  addToCart: (
    productId: number,
    quantity: number,
    productName?: string,
    sku?: string
  ) => Promise<boolean>;
  removeFromCart: (productId: number) => Promise<void>;
  updateCartQuantity: (productId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  fetchCart: () => Promise<void>;
  addToWishlist: (
    productId: number,
    productName?: string,
    sku?: string
  ) => Promise<boolean>;
  removeFromWishlist: (productId: number, showToast?: boolean) => Promise<void>;
  clearWishlist: () => Promise<void>;
  fetchWishlist: () => Promise<void>;
  isInWishlist: (productId: number) => boolean;
  isLoggedIn: () => boolean;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export function ShopProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const [isCartLoading, setIsCartLoading] = useState(false);
  const [isWishlistLoading, setIsWishlistLoading] = useState(false);

  // Load wishlist and cart on component mount
  useEffect(() => {
    // Fetch cart and wishlist if user is logged in
    if (isLoggedIn()) {
      fetchCart();
      fetchWishlist();
    }
  }, []);

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

  const fetchWishlist = async () => {
    if (!isLoggedIn()) {
      setWishlist([]);
      return;
    }

    setIsWishlistLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist');
      }

      const data = await response.json();
      setWishlist(data.wishlist.items || []);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsWishlistLoading(false);
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

      // Check if the product is in the wishlist
      const productInWishlist = wishlist.some(
        (item) => item.productId === productId
      );

      // If it's in the wishlist, remove it
      if (productInWishlist) {
        await removeFromWishlist(productId, false); // Pass false to not show the removal toast

        // Show a "moved to cart" toast instead
        toast({
          title: 'Moved to Cart',
          description: (
            <div>
              {productName || 'Product'} has been moved from wishlist to cart.{' '}
              <a href='/cart' className='text-blue-500 hover:underline'>
                View Cart
              </a>
            </div>
          ),
        });
      } else {
        toast({
          title: 'Added to Cart',
          description: (
            <div>
              {productName || 'Product'} has been added to your cart.{' '}
              <a href='/cart' className='text-blue-500 hover:underline'>
                View Cart
              </a>
            </div>
          ),
        });
      }
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

  const addToWishlist = async (
    productId: number,
    productName?: string
  ): Promise<boolean> => {
    if (!isLoggedIn()) {
      return false;
    }

    setIsWishlistLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ productId }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item to wishlist');
      }

      const data = await response.json();
      setWishlist(data.wishlist.items || []);

      toast({
        title: 'Added to Wishlist',
        description: `${
          productName || 'Product'
        } has been added to your wishlist.`,
      });

      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to add item to wishlist. Please try again.',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const removeFromWishlist = async (productId: number, showToast = true) => {
    if (!isLoggedIn()) return;

    setIsWishlistLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/wishlist/${productId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error('Failed to remove item from wishlist');
      }

      const data = await response.json();
      setWishlist(data.wishlist.items || []);
      if (showToast) {
        toast({
          title: 'Removed from Wishlist',
          description: 'Item has been removed from your wishlist.',
        });
      }
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const clearWishlist = async () => {
    if (!isLoggedIn()) return;

    setIsWishlistLoading(true);
    try {
      const authToken = Cookies.get('authToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/wishlist`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to clear wishlist');
      }

      setWishlist([]);

      toast({
        title: 'Wishlist Cleared',
        description: 'Your wishlist has been cleared.',
      });
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to clear your wishlist. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsWishlistLoading(false);
    }
  };

  const isInWishlist = (productId: number) => {
    return wishlist.some((item) => item.productId === productId);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        wishlist,
        isCartLoading,
        isWishlistLoading,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        fetchCart,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        fetchWishlist,
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
