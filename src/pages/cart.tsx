import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Loader2, Minus, Plus, Trash2 } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useShop } from '@/contexts/ShopContext';
import { useCheckout } from '@/contexts/CheckoutContext';
import Image from 'next/image';

export default function CartPage() {
  const { cart, updateCartItem, removeFromCart } = useShop();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const { addProducts } = useCheckout();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    const checkoutProducts = cart.products.map((product) => ({
      id: product.id,
      title: product.title,
      thumbnail: product.thumbnail,
      price: product.price,
      quantity: product.quantity,
    }));
    addProducts(checkoutProducts);
    navigate('/checkout');
  };

  const handleQuantityChange = async (
    productId: number,
    currentQuantity: number,
    change: number
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity >= 1) {
      await updateCartItem(productId, newQuantity);
    }
  };

  const handleRemoveItem = async (cartId: number) => {
    await removeFromCart(cartId);
  };

  const handleSelectItem = (productId: number) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleApplyCoupon = () => {
    setIsApplyingCoupon(true);
    // Simulate coupon application
    setTimeout(() => {
      setIsApplyingCoupon(false);
      setCouponCode('');
    }, 1000);
  };

  if (!cart || cart.length === 0) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-md mx-auto text-center'>
            <div className='mb-8'>
              {/* <div className='h-48 w-48 mx-auto mb-6'>
                <img
                  src='/placeholder.svg'
                  alt='Empty Cart'
                  width={192}
                  height={192}
                  className='w-full h-full'
                />
              </div> */}
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
        <div className='flex flex-col lg:flex-row gap-8'>
          {/* Cart Items */}
          <div className='flex-1'>
            <div className='bg-white rounded-lg shadow'>
              <div className='p-6'>
                <h1 className='text-2xl font-semibold mb-6'>Shopping Cart</h1>
                <div className='space-y-6'>
                  {cart.products.map((product) => (
                    <div key={product.id} className='flex gap-4 pb-6 border-b'>
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={() => handleSelectItem(product.id)}
                        className='mt-16'
                      />
                      <div className='w-24 h-24 relative flex-shrink-0'>
                        <img
                          src={product.thumbnail || '/placeholder.svg'}
                          alt={product.title}
                          // layout='fill'
                          // objectFit='cover'
                          className='rounded-lg'
                        />
                      </div>
                      <div className='flex-1 min-w-0'>
                        <Link
                          to={`/product/${product.id}`}
                          className='hover:text-primary'
                        >
                          <h3 className='font-medium'>{product.title}</h3>
                        </Link>
                        <div className='mt-4 flex flex-wrap gap-4 items-center'>
                          <div className='flex items-center border rounded-lg'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity,
                                  -1
                                )
                              }
                              disabled={product.quantity <= 1}
                            >
                              <Minus className='h-4 w-4' />
                            </Button>
                            <span className='w-12 text-center'>
                              {product.quantity}
                            </span>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() =>
                                handleQuantityChange(
                                  product.id,
                                  product.quantity,
                                  1
                                )
                              }
                            >
                              <Plus className='h-4 w-4' />
                            </Button>
                          </div>
                          <div className='flex items-center gap-2'>
                            <span className='font-medium'>
                              ${product.discountedTotal.toFixed(2)}
                            </span>
                            {product.discountPercentage > 0 && (
                              <span className='text-sm text-gray-500 line-through'>
                                ${product.total.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <Button
                            variant='ghost'
                            size='icon'
                            className='text-red-500 hover:text-red-600'
                            onClick={() => handleRemoveItem(cart.id)}
                          >
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='w-full lg:w-80'>
            <div className='bg-white rounded-lg shadow p-6 space-y-6'>
              <h2 className='text-lg font-semibold'>Order Summary</h2>

              <div className='space-y-2'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium'>${cart.total.toFixed(2)}</span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Discount</span>
                  <span className='text-green-500'>
                    -${(cart.total - cart.discountedTotal).toFixed(2)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='text-green-500'>Free</span>
                </div>
                <div className='pt-4 border-t'>
                  <div className='flex justify-between'>
                    <span className='font-semibold'>Total</span>
                    <span className='font-semibold'>
                      ${cart.discountedTotal.toFixed(2)}
                    </span>
                  </div>
                  <p className='text-xs text-gray-500 mt-1'>Inclusive of GST</p>
                </div>
              </div>

              <div className='space-y-4'>
                <div className='flex gap-2'>
                  <Input
                    placeholder='Enter coupon code'
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                  />
                  <Button
                    variant='outline'
                    disabled={!couponCode || isApplyingCoupon}
                    onClick={handleApplyCoupon}
                  >
                    {isApplyingCoupon ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      'Apply'
                    )}
                  </Button>
                </div>
                <Button
                  className='w-full'
                  size='lg'
                  onClick={handleProceedToCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button variant='outline' className='w-full' asChild>
                  <Link to='/'>Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
