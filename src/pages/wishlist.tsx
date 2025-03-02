import { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useNavigate } from 'react-router-dom';
import Image from 'next/image';
import Link from 'next/link';

interface WishlistItem {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  description: string;
}

export default function WishlistPage() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedItems, setRecommendedItems] = useState<WishlistItem[]>([]);
  const { addToCart, removeFromWishlist } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        // For demo purposes, we'll fetch 5 random products
        const productIds = [1, 2, 3, 4, 5];
        const items = await Promise.all(
          productIds.map(async (id) => {
            const response = await fetch(
              `https://dummyjson.com/products/${id}`
            );
            return response.json();
          })
        );
        setWishlistItems(items);

        // Fetch recommended items (products 6-10)
        const recommendedIds = [6, 7, 8, 9, 10];
        const recommendedProducts = await Promise.all(
          recommendedIds.map(async (id) => {
            const response = await fetch(
              `https://dummyjson.com/products/${id}`
            );
            return response.json();
          })
        );
        setRecommendedItems(recommendedProducts);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleAddToCart = async (id: number) => {
    await addToCart(id, 1);
  };

  const handleRemoveFromWishlist = (id: number) => {
    removeFromWishlist(id);
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Function to format price with Indian Rupee symbol
  const formatPrice = (price: number) => {
    return `₹${price.toFixed(2)}`;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    originalPrice: number,
    discountPercentage: number
  ) => {
    return originalPrice * (1 - discountPercentage / 100);
  };

  if (loading) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]'>
          <Loader2 className='h-12 w-12 animate-spin text-[#4280ef]' />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        {/* Breadcrumb */}
        <div className='flex items-center gap-2 text-sm text-gray-500 mb-8'>
          <Link href='/' className='hover:text-[#4280ef]'>
            Home
          </Link>
          <span>/</span>
          <Link href='/shop' className='hover:text-[#4280ef]'>
            Shop
          </Link>
          <span>/</span>
          <span className='text-gray-900'>Wishlist</span>
        </div>

        <h1 className='text-3xl font-bold text-center mb-12 text-[#0e224d]'>
          My Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className='text-center py-16'>
            <h2 className='text-xl font-semibold mb-4'>
              Your wishlist is empty
            </h2>
            <p className='text-gray-600 mb-8'>
              Add items to your wishlist to save them for later.
            </p>
            <Button
              onClick={() => navigate('/')}
              className='bg-[#4280ef] hover:bg-[#3a72d4]'
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-16'>
            {wishlistItems.map((item) => {
              const discountedPrice = calculateDiscountedPrice(
                item.price,
                item.discountPercentage
              );
              const discountLabel = Math.round(item.discountPercentage) + '%';

              return (
                <div key={item.id} className='border rounded-lg relative group'>
                  {/* Discount badge */}
                  {item.discountPercentage > 0 && (
                    <div className='absolute top-2 left-2 bg-[#ff9f43] text-white text-xs font-bold px-2 py-1 rounded-md z-10'>
                      -{discountLabel}
                    </div>
                  )}

                  {/* Wishlist button */}
                  <button
                    className='absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm'
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Heart className='h-4 w-4 fill-red-500 text-red-500' />
                  </button>

                  {/* Product image */}
                  <div className='p-4 border-b'>
                    <div className='relative h-48 w-full'>
                      <img
                        src={item.thumbnail || '/placeholder.svg'}
                        alt={item.title}
                        // layout='fill'
                        // objectFit='contain'
                        className='h-full w-full object-contain transition-transform group-hover:scale-105'
                      />
                    </div>
                  </div>

                  {/* Product details */}
                  <div className='p-4'>
                    <div className='text-sm text-gray-500 mb-1'>
                      {item.brand}
                    </div>
                    <h3 className='font-medium text-sm mb-2 line-clamp-2 h-10'>
                      {item.title}
                    </h3>

                    {/* Ratings */}
                    <div className='flex items-center mb-2'>
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-4 h-4 ${
                            i < Math.round(item.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                          xmlns='http://www.w3.org/2000/svg'
                          viewBox='0 0 20 20'
                        >
                          <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                        </svg>
                      ))}
                      <span className='text-xs text-gray-500 ml-1'>
                        ({Math.floor(item.rating * 10)})
                      </span>
                    </div>

                    {/* Price */}
                    <div className='mb-4'>
                      <div className='font-bold text-lg text-[#0e224d]'>
                        {formatPrice(discountedPrice)}
                      </div>
                      {item.discountPercentage > 0 && (
                        <div className='text-sm text-gray-500 line-through'>
                          {formatPrice(item.price)}
                        </div>
                      )}
                    </div>

                    {/* Add to cart button */}
                    <Button
                      className='w-full bg-[#4280ef] hover:bg-[#3a72d4]'
                      onClick={() => handleAddToCart(item.id)}
                    >
                      Add To Cart
                    </Button>

                    {/* Product specs */}
                    <div className='mt-4 text-xs text-gray-500 space-y-1'>
                      <div>• {item.category} display</div>
                      <div>• 3.5GHz 6-core 9th-generation Intel Core i5</div>
                      <div>• AMD Radeon Pro 5300 graphics</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* You may also like section */}
        {wishlistItems.length > 0 && recommendedItems.length > 0 && (
          <div className='mb-16'>
            <h2 className='text-xl font-semibold mb-6'>You may also like...</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6'>
              {recommendedItems.slice(0, 5).map((item) => {
                const discountedPrice = calculateDiscountedPrice(
                  item.price,
                  item.discountPercentage
                );
                const discountLabel = Math.round(item.discountPercentage) + '%';

                return (
                  <div
                    key={item.id}
                    className='border rounded-lg relative group'
                  >
                    {/* Discount badge */}
                    {item.discountPercentage > 0 && (
                      <div className='absolute top-2 left-2 bg-[#ff9f43] text-white text-xs font-bold px-2 py-1 rounded-md z-10'>
                        -{discountLabel}
                      </div>
                    )}

                    {/* Wishlist button */}
                    <button
                      className='absolute top-2 right-2 z-10 bg-white rounded-full p-1.5 shadow-sm'
                      onClick={() => handleRemoveFromWishlist(item.id)}
                    >
                      <Heart className='h-4 w-4 text-gray-400 hover:fill-red-500 hover:text-red-500' />
                    </button>

                    {/* Product image */}
                    <div className='p-4 border-b'>
                      <div className='relative h-48 w-full'>
                        <img
                          src={item.thumbnail || '/placeholder.svg'}
                          alt={item.title}
                          layout='fill'
                          objectFit='contain'
                          className='transition-transform group-hover:scale-105'
                        />
                      </div>
                    </div>

                    {/* Product details */}
                    <div className='p-4'>
                      <div className='text-sm text-gray-500 mb-1'>
                        {item.brand}
                      </div>
                      <h3 className='font-medium text-sm mb-2 line-clamp-2 h-10'>
                        {item.title}
                      </h3>

                      {/* Ratings */}
                      <div className='flex items-center mb-2'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(item.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                        <span className='text-xs text-gray-500 ml-1'>
                          ({Math.floor(item.rating * 10)})
                        </span>
                      </div>

                      {/* Price */}
                      <div className='mb-4'>
                        <div className='font-bold text-lg text-[#0e224d]'>
                          {formatPrice(discountedPrice)}
                        </div>
                        {item.discountPercentage > 0 && (
                          <div className='text-sm text-gray-500 line-through'>
                            {formatPrice(item.price)}
                          </div>
                        )}
                      </div>

                      {/* Add to cart button */}
                      <Button
                        className='w-full bg-[#4280ef] hover:bg-[#3a72d4]'
                        onClick={() => handleAddToCart(item.id)}
                      >
                        Add To Cart
                      </Button>

                      {/* Product specs */}
                      <div className='mt-4 text-xs text-gray-500 space-y-1'>
                        <div>• {item.category} display</div>
                        <div>• 3.5GHz 6-core 9th-generation Intel Core i5</div>
                        <div>• AMD Radeon Pro 5300 graphics</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Trust badges */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-16'>
          <div className='border rounded-lg p-6 flex items-center justify-center flex-col text-center'>
            <div className='mb-2 text-[#4280ef]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M2 20h.01M7 20v-4m0 0v-4m0 4h.01M20 20h.01M20 16v-4m0 0V8m0 4h.01M12 20v-4m0 0V8m0 8h.01M7 12V8m0 0V4m0 4h.01M12 8V4m0 0V2m0 2h.01M17 8V4m0 0V2m0 2h.01'></path>
              </svg>
            </div>
            <h3 className='font-semibold text-sm'>Quality Assured</h3>
            <p className='text-gray-500 text-xs'>Always</p>
          </div>
          <div className='border rounded-lg p-6 flex items-center justify-center flex-col text-center'>
            <div className='mb-2 text-[#4280ef]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect width='20' height='14' x='2' y='7' rx='2' ry='2'></rect>
                <path d='M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16'></path>
              </svg>
            </div>
            <h3 className='font-semibold text-sm'>100% Original</h3>
            <p className='text-gray-500 text-xs'>Products</p>
          </div>
          <div className='border rounded-lg p-6 flex items-center justify-center flex-col text-center'>
            <div className='mb-2 text-[#4280ef]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <rect width='18' height='11' x='3' y='11' rx='2' ry='2'></rect>
                <path d='M7 11V7a5 5 0 0 1 10 0v4'></path>
              </svg>
            </div>
            <h3 className='font-semibold text-sm'>Secure</h3>
            <p className='text-gray-500 text-xs'>Payments</p>
          </div>
          <div className='border rounded-lg p-6 flex items-center justify-center flex-col text-center'>
            <div className='mb-2 text-[#4280ef]'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                width='24'
                height='24'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'
              >
                <path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10'></path>
                <path d='m9 12 2 2 4-4'></path>
              </svg>
            </div>
            <h3 className='font-semibold text-sm'>100% buyer</h3>
            <p className='text-gray-500 text-xs'>Protection</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
