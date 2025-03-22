'use client';

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/Breadcrumb';
import { useShop } from '@/contexts/ShopContext';
import { useCheckout } from '@/contexts/CheckoutContext';
import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import {
  storeUnprocessedOrder,
  deleteAllUserUnprocessedOrders,
} from '@/services/unprocessedOrderService';
import { getCurrentUser } from '@/services/auth';
import { toast } from '@/components/ui/use-toast';

export default function CartPage() {
  const {
    cart,
    isCartLoading,
    fetchCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    isLoggedIn,
  } = useShop();
  const { addProducts } = useCheckout();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    if (isLoggedIn()) {
      fetchCart();
      fetchCurrentUser();
    } else {
      navigate('/login');
    }
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const user = await getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const handleQuantityChange = async (
    productId: number,
    change: number,
    currentQuantity: number
  ) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    await updateCartQuantity(productId, newQuantity);
  };

  const handleRemoveItem = async (productId: number) => {
    await removeFromCart(productId);
  };

  const handleClearCart = async () => {
    await clearCart();
  };

  const handleProceedToCheckout = async () => {
    if (!isLoggedIn() || !currentUser) {
      navigate('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Store as unprocessed order first (in case user abandons checkout)
      await deleteAllUserUnprocessedOrders();
      const tempId = uuidv4();

      // Create unprocessed order data
      const unprocessedOrderData = {
        tempId,
        products: cart.map((item) => ({
          id: item.productId,
          title: item.name,
          price: item.price,
          quantity: item.quantity,
          thumbnail: item.image,
        })),
        // We don't have shipping/billing addresses yet, but we'll add them in checkout
        // Just adding placeholder data for now
        shippingAddress: {
          id: 'pending',
          firstName: 'Pending',
          lastName: 'Checkout',
          address1: 'Pending',
          city: 'Pending',
          state: 'Pending',
          postcode: '000000',
          country: 'India',
          phone: '0000000000',
        },
        subtotal: cart.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        ),
        shipping: cart.length > 0 ? 200 : 0,
        total:
          cart.reduce((sum, item) => sum + item.price * item.quantity, 0) +
          (cart.length > 0 ? 200 : 0),
        reason: 'Process was not completed by the user.',
      };

      // Store the unprocessed order
      const result = await storeUnprocessedOrder(unprocessedOrderData);

      // Prepare checkout products
      const checkoutProducts = cart.map((item) => ({
        id: item.productId,
        title: item.name,
        thumbnail: item.image,
        price: item.price,
        quantity: item.quantity,
      }));

      // Add to checkout context
      addProducts(checkoutProducts);
      sessionStorage.setItem('unprocessed_order_tempid', tempId);

      // Navigate to checkout
      navigate('/checkout');
    } catch (error) {
      console.error('Error proceeding to checkout:', error);
      toast({
        title: 'Error',
        description:
          'There was a problem proceeding to checkout. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate cart totals
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = cart.length > 0 ? 200 : 0; // ₹200 flat rate shipping
  const total = subtotal + shipping;

  if (isCartLoading || isProcessing) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16 flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-12 w-12 animate-spin text-blue-500 mb-4' />
            <p className='text-gray-600'>
              {isProcessing ? 'Preparing checkout...' : 'Loading your cart...'}
            </p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isLoggedIn()) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-md mx-auto text-center'>
            <div className='mb-8'>
              <div className='h-48 w-48 mx-auto mb-6 flex items-center justify-center'>
                <ShoppingBag className='h-24 w-24 text-gray-300' />
              </div>
              <h1 className='text-2xl font-semibold mb-2'>
                Please Login to View Your Cart
              </h1>
              <p className='text-gray-500 mb-8'>
                You need to be logged in to view and manage your cart.
              </p>
              <Link to='/login'>
                <Button size='lg'>Login Now</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (cart.length === 0) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16'>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Cart', href: '/cart' },
            ]}
          />
          <div className='max-w-md mx-auto text-center'>
            <div className='mb-8'>
              <div className='h-48 w-48 mx-auto mb-6 flex items-center justify-center'>
                <ShoppingBag className='h-24 w-24 text-gray-300' />
              </div>
              <h1 className='text-2xl font-semibold mb-2'>
                Your Cart is Empty
              </h1>
              <p className='text-gray-500 mb-8'>
                Looks like you haven't added anything to your cart yet.
              </p>
              <Link to='/'>
                <Button size='lg'>Continue Shopping</Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Cart', href: '/cart' },
          ]}
        />

        <h1 className='text-2xl font-bold mb-8'>Your Shopping Cart</h1>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Cart Items */}
          <div className='lg:col-span-2'>
            <div className='bg-white rounded-lg border overflow-hidden'>
              <div className='p-4 border-b bg-gray-50'>
                <div className='grid grid-cols-12 gap-4'>
                  <div className='col-span-6'>
                    <h3 className='font-medium'>Product</h3>
                  </div>
                  <div className='col-span-2 text-center'>
                    <h3 className='font-medium'>Price</h3>
                  </div>
                  <div className='col-span-2 text-center'>
                    <h3 className='font-medium'>Quantity</h3>
                  </div>
                  <div className='col-span-2 text-right'>
                    <h3 className='font-medium'>Total</h3>
                  </div>
                </div>
              </div>

              {cart.map((item) => (
                <div
                  key={item.productId}
                  className='p-4 border-b last:border-b-0'
                >
                  <div className='grid grid-cols-12 gap-4 items-center'>
                    <div className='col-span-6'>
                      <div className='flex items-center gap-4'>
                        <div className='relative w-16 h-16 flex-shrink-0'>
                          <img
                            src={item.image || '/placeholder.svg'}
                            alt={item.name}
                            sizes='64px'
                            style={{ objectFit: 'contain' }}
                            className='rounded-md object-fit-fill'
                          />
                        </div>
                        <div>
                          <h4 className='font-medium line-clamp-2'>
                            {item.name}
                          </h4>
                          <button
                            onClick={() => handleRemoveItem(item.productId)}
                            className='text-sm text-red-500 flex items-center gap-1 mt-1 hover:underline'
                          >
                            <Trash2 className='h-3 w-3' /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className='col-span-2 text-center'>
                      <span className='font-medium'>
                        ₹{item.price.toFixed(2)}
                      </span>
                    </div>
                    <div className='col-span-2'>
                      <div className='flex items-center justify-center'>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              -1,
                              item.quantity
                            )
                          }
                        >
                          <Minus className='h-3 w-3' />
                        </Button>
                        <span className='w-10 text-center'>
                          {item.quantity}
                        </span>
                        <Button
                          variant='outline'
                          size='icon'
                          className='h-8 w-8'
                          onClick={() =>
                            handleQuantityChange(
                              item.productId,
                              1,
                              item.quantity
                            )
                          }
                        >
                          <Plus className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                    <div className='col-span-2 text-right'>
                      <span className='font-bold'>
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className='mt-4 flex justify-between'>
              <Button variant='outline' onClick={() => navigate('/')}>
                Continue Shopping
              </Button>
              <Button
                variant='outline'
                className='text-red-500'
                onClick={handleClearCart}
              >
                Clear Cart
              </Button>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='bg-white rounded-lg border p-6'>
              <h2 className='text-lg font-bold mb-4'>Order Summary</h2>

              <div className='space-y-3 mb-6'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium'>₹{shipping.toFixed(2)}</span>
                </div>
                <div className='border-t pt-3 mt-3'>
                  <div className='flex justify-between'>
                    <span className='font-bold'>Total</span>
                    <span className='font-bold'>₹{total.toFixed(2)}</span>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>Including GST</p>
                </div>
              </div>

              <Button className='w-full' onClick={handleProceedToCheckout}>
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
