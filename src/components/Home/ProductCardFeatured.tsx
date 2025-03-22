import type React from 'react';
import { useState } from 'react';
import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useShop } from '@/contexts/ShopContext';
import LoginPopup from '../utils/LoginPopup';

interface Product {
  id: number;
  title: string;
  description: string;
  // brand: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  stock: number;
}

interface ProductCardFeaturedProps {
  product: Product;
}

export function ProductCardFeatured({ product }: ProductCardFeaturedProps) {
  // const { addToCart } = useShop();
  // const discountedPrice = product.price
  //   ? product.price * (1 - (product.discountPercentage || 0) / 100)
  //   : 0;
  const { addToCart, isLoggedIn } = useShop();
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  // Use the actual sale price if available, otherwise use the regular price
  const discountedPrice = product.salePrice || product.price;
  const regularPrice = product.regularPrice || product.price;
  const discountPercentage =
    product.discountPercentage ||
    (regularPrice > discountedPrice
      ? Math.round(((regularPrice - discountedPrice) / regularPrice) * 100)
      : 0);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation when clicking the button

    if (!isLoggedIn()) {
      setIsLoginPopupOpen(true);
      return;
    }

    setIsAddingToCart(true);
    await addToCart(product.id, 1, product.title);
    setIsAddingToCart(false);
  };

  const handleLoginSuccess = async () => {
    setIsLoginPopupOpen(false);
    setIsAddingToCart(true);
    await addToCart(product.id, 1, product.title);
    setIsAddingToCart(false);
  };

  return (
    <>
      <Link to={`/product/${product.id}`} className='block'>
        <div className='bg-white rounded-lg p-4 border border-gray-200 hover:border-blue-500 transition-colors h-[450px] flex flex-col'>
          {/* Product Image and Badge */}
          <div className='relative h-48 mb-4'>
            <img
              src={product.thumbnail || '/placeholder.svg'}
              alt={product.title}
              // layout='fill'
              // objectFit='contain'
              className='w-full h-full object-contain transition-transform group-hover:scale-105'
            />
            {discountPercentage > 0 && (
              <div className='absolute top-2 right-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded'>
                -{Math.round(discountPercentage)}%
              </div>
            )}
            {/* {product.stock < 10 && (
              <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-medium px-2 py-1 rounded'>
                Hot
              </div>
            )} */}
          </div>

          {/* Product Info */}
          <div className='flex-1 flex flex-col'>
            <div className='mb-auto'>
              {/* <p className='text-sm text-gray-500 mb-1'>{product.brand}</p> */}
              <h3 className='font-medium text-[#1a2030] mb-2 line-clamp-2 min-h-[48px]'>
                {product.title}
              </h3>

              {/* Rating */}
              <div className='flex items-center gap-1 mb-2'>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${
                      i < Math.round(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className='text-xs text-gray-500 ml-1'></span>
              </div>
              {/* Price */}
              <div className='mb-2'>
                <div className='flex items-baseline gap-2'>
                  <span className='text-lg font-bold text-[#1a2030]'>
                    Rs. {discountedPrice.toFixed(2)}
                  </span>
                  {(product.salePrice &&
                    product.regularPrice >= product.salePrice && (
                      <span className='text-sm text-gray-500 line-through'>
                        Rs. {product.regularPrice.toFixed(2)}
                      </span>
                    )) || (
                    <span className='text-sm text-gray-500 line-through'></span>
                  )}
                </div>
                <p className='text-xs text-gray-500'>Inclusive of GST</p>
              </div>
            </div>

            {/* Add to Cart Button */}
            <div className='mt-auto'>
              <Button
                className='w-full bg-white text-blue-500 border-2 border-blue-500 hover:bg-blue-500 hover:text-white transition-colors'
                onClick={handleAddToCart}
                disabled={isAddingToCart}
              >
                {isAddingToCart ? 'Adding...' : 'Add To Cart'}
              </Button>
            </div>
          </div>
        </div>
      </Link>

      <LoginPopup
        isOpen={isLoginPopupOpen}
        onClose={() => setIsLoginPopupOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        productName={product.title}
      />
    </>
  );
}
