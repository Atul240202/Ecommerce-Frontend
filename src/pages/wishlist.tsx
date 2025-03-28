import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Button } from '../components/ui/button';
import { Breadcrumb } from '../components/Breadcrumb';
import { useShop } from '../contexts/ShopContext';
import {
  Trash2,
  Loader2,
  ShoppingCart,
  Heart,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export default function WishlistPage() {
  const {
    wishlist,
    isWishlistLoading,
    fetchWishlist,
    removeFromWishlist,
    clearWishlist,
    addToCart,
    isLoggedIn,
  } = useShop();
  const navigate = useNavigate();
  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>(
    {}
  );

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Track expanded items in mobile view
  const [expandedItems, setExpandedItems] = useState<Record<number, boolean>>(
    {}
  );

  const toggleItemExpansion = (productId: number) => {
    setExpandedItems((prev) => ({
      ...prev,
      [productId]: !prev[productId],
    }));
  };

  useEffect(() => {
    if (isLoggedIn()) {
      fetchWishlist();
    } else {
      navigate('/login');
    }
  }, []);

  const handleRemoveItem = async (productId: number) => {
    await removeFromWishlist(productId);
  };

  const handleClearWishlist = async () => {
    await clearWishlist();
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    setIsAddingToCart((prev) => ({ ...prev, [productId]: true }));

    try {
      await addToCart(productId, 1, productName);
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  if (isWishlistLoading) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16 flex justify-center items-center'>
          <div className='flex flex-col items-center'>
            <Loader2 className='h-12 w-12 animate-spin text-blue-500 mb-4' />
            <p className='text-gray-600'>Loading your wishlist...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!isLoggedIn()) {
    return (
      <MainLayout>
        <div
          className={`container mx-auto px-4 ${isMobile ? 'py-8' : 'py-16'} `}
        >
          <div className='max-w-md mx-auto text-center'>
            <div className='mb-8'>
              <div className='h-48 w-48 mx-auto mb-6 flex items-center justify-center'>
                <Heart className='h-24 w-24 text-gray-300' />
              </div>
              <h1 className='text-2xl font-semibold mb-2'>
                Please Login to View Your Wishlist
              </h1>
              <p className='text-gray-500 mb-8'>
                You need to be logged in to view and manage your wishlist.
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

  if (wishlist.length === 0) {
    return (
      <MainLayout>
        <div
          className={`container mx-auto px-4 ${isMobile ? 'py-8' : 'py-16'} `}
        >
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist', href: '/wishlist' },
            ]}
          />
          <div className='max-w-md mx-auto text-center'>
            <div className='mb-8'>
              <div className='h-48 w-48 mx-auto mb-6 flex items-center justify-center'>
                <Heart className='h-24 w-24 text-gray-300' />
              </div>
              <h1 className='text-2xl font-semibold mb-2'>
                Your Wishlist is Empty
              </h1>
              <p className='text-gray-500 mb-8'>
                Looks like you haven't added anything to your wishlist yet.
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

  // Mobile view
  if (isMobile) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-6'>
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Wishlist', href: '/wishlist' },
            ]}
          />

          <div className='flex justify-between items-center mb-4'>
            <h1 className='text-xl font-bold'>
              My Wishlist ({wishlist.length})
            </h1>
            <Button
              variant='outline'
              size='sm'
              className='text-red-500 text-xs'
              onClick={handleClearWishlist}
            >
              Clear All
            </Button>
          </div>

          <div className='space-y-4 mb-6'>
            {wishlist.map((item) => (
              <div
                key={item.productId}
                className='bg-white rounded-lg border overflow-hidden'
              >
                <div
                  className='p-3 flex items-center justify-between cursor-pointer'
                  onClick={() => toggleItemExpansion(item.productId)}
                >
                  <div className='flex items-center gap-3'>
                    <div className='relative w-14 h-14 flex-shrink-0'>
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className='w-full h-full object-contain rounded-md'
                      />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h4 className='font-medium text-sm line-clamp-1'>
                        {item.name}
                      </h4>
                      <div className='flex items-center gap-2 mt-1'>
                        <span className='font-medium text-sm'>
                          ₹{item.price.toFixed(2)}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-xs ${
                            item.stock_status === 'instock'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {item.stock_status === 'instock'
                            ? 'In Stock'
                            : 'Out of Stock'}
                        </span>
                      </div>
                    </div>
                  </div>
                  {expandedItems[item.productId] ? (
                    <ChevronUp className='h-4 w-4 text-gray-500' />
                  ) : (
                    <ChevronDown className='h-4 w-4 text-gray-500' />
                  )}
                </div>

                {expandedItems[item.productId] && (
                  <div className='p-3 pt-0 border-t'>
                    <div className='flex flex-col gap-2'>
                      <Link
                        to={`/product/${item.productId}`}
                        className='text-blue-500 text-sm'
                      >
                        View Product Details
                      </Link>
                      <div className='flex gap-2 mt-2'>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-blue-500 border-blue-500 flex-1 text-xs py-1 h-8'
                          onClick={() =>
                            handleAddToCart(item.productId, item.name)
                          }
                          disabled={
                            item.stock_status !== 'instock' ||
                            isAddingToCart[item.productId]
                          }
                        >
                          {isAddingToCart[item.productId] ? (
                            <Loader2 className='h-3 w-3 animate-spin mr-1' />
                          ) : (
                            <ShoppingCart className='h-3 w-3 mr-1' />
                          )}
                          Add to Cart
                        </Button>
                        <Button
                          variant='outline'
                          size='sm'
                          className='text-red-500 border-red-500 h-8'
                          onClick={() => handleRemoveItem(item.productId)}
                        >
                          <Trash2 className='h-3 w-3' />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <Button
            variant='outline'
            className='w-full mb-4'
            onClick={() => navigate('/')}
          >
            Continue Shopping
          </Button>
        </div>
      </MainLayout>
    );
  }

  // Desktop view (original layout)
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Wishlist', href: '/wishlist' },
          ]}
        />

        <h1 className='text-2xl font-bold mb-8'>My Wishlist</h1>

        <div className='bg-white rounded-lg border overflow-hidden mb-6'>
          <div className='p-4 border-b bg-gray-50'>
            <div className='grid grid-cols-12 gap-4'>
              <div className='col-span-6'>
                <h3 className='font-medium'>Product</h3>
              </div>
              <div className='col-span-2 text-center'>
                <h3 className='font-medium'>Price</h3>
              </div>
              <div className='col-span-2 text-center'>
                <h3 className='font-medium'>Status</h3>
              </div>
              <div className='col-span-2 text-right'>
                <h3 className='font-medium'>Actions</h3>
              </div>
            </div>
          </div>

          {wishlist.map((item) => (
            <div key={item.productId} className='p-4 border-b last:border-b-0'>
              <div className='grid grid-cols-12 gap-4 items-center'>
                <div className='col-span-6'>
                  <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 flex-shrink-0'>
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className='w-full h-full object-contain rounded-md'
                      />
                    </div>
                    <div>
                      <Link to={`/product/${item.productId}`}>
                        <h4 className='font-medium line-clamp-2 hover:text-blue-500'>
                          {item.name}
                        </h4>
                      </Link>
                      {item.stock_status !== 'instock' && (
                        <p className='text-red-500 text-sm mt-1'>
                          Out of stock
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className='col-span-2 text-center'>
                  <span className='font-medium'>₹{item.price.toFixed(2)}</span>
                </div>
                <div className='col-span-2 text-center'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.stock_status === 'instock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.stock_status === 'instock'
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </span>
                </div>
                <div className='col-span-2 flex justify-end gap-2'>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-blue-500 border-blue-500'
                    onClick={() => handleAddToCart(item.productId, item.name)}
                    disabled={
                      item.stock_status !== 'instock' ||
                      isAddingToCart[item.productId]
                    }
                  >
                    {isAddingToCart[item.productId] ? (
                      <Loader2 className='h-4 w-4 animate-spin mr-2' />
                    ) : (
                      <ShoppingCart className='h-4 w-4 mr-2' />
                    )}
                    Add to Cart
                  </Button>
                  <Button
                    variant='outline'
                    size='sm'
                    className='text-red-500 border-red-500'
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <Trash2 className='h-4 w-4' />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className='flex justify-between'>
          <Button variant='outline' onClick={() => navigate('/')}>
            Continue Shopping
          </Button>
          <Button
            variant='outline'
            className='text-red-500'
            onClick={handleClearWishlist}
          >
            Clear Wishlist
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
