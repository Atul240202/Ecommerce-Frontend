import type React from 'react';
import Image from 'next/image';
import { Heart, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useShop } from '@/contexts/ShopContext';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useShop();
  const isWishlisted = isInWishlist(product.id);
  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    await addToCart(product.id, 1);
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigation
    if (isWishlisted) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  return (
    <div className='group relative border rounded-lg p-4 hover:border-primary transition-colors'>
      {/* Wishlist button */}
      <div className='absolute top-2 left-2 z-10'>
        <Button
          variant='ghost'
          size='icon'
          className='h-8 w-8 rounded-full bg-white/80 hover:bg-white'
          onClick={handleWishlistClick}
        >
          <Heart
            className={`h-5 w-5 ${
              isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
            }`}
          />
        </Button>
      </div>

      {/* Make the entire card clickable */}
      <Link to={`/product/${product.id}`} className='block'>
        {product.discountPercentage > 0 && (
          <div className='absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
            -{Math.round(product.discountPercentage)}%
          </div>
        )}

        <div className='relative h-48 mb-4'>
          <img
            src={product.thumbnail || '/placeholder.svg'}
            alt={product.title}
            // layout='fill'
            // objectFit='contain'
            className='group-hover:scale-105 transition-transform'
          />
        </div>

        <div className='space-y-2'>
          <p className='text-sm text-gray-500'>{product.brand}</p>
          <h3 className='font-medium line-clamp-2 min-h-[48px]'>
            {product.title}
          </h3>
          <div className='flex items-center gap-1'>
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
          </div>
          <div>
            <div className='flex items-baseline gap-2'>
              <span className='text-lg font-bold'>
                ${discountedPrice.toFixed(2)}
              </span>
              {product.discountPercentage > 0 && (
                <span className='text-sm text-gray-500 line-through'>
                  ${product.price.toFixed(2)}
                </span>
              )}
            </div>
            <p className='text-xs text-gray-500'>Inclusive of GST</p>
          </div>
          <Button className='w-full' onClick={handleAddToCart}>
            Add to Cart
          </Button>
        </div>
      </Link>
    </div>
  );
}
