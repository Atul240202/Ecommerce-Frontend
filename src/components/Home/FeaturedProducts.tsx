import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ProductCardFeatured } from './ProductCardFeatured';

interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  tags: string[];
  stock: number;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null
  );

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=30')
      .then((res) => res.json())
      .then((data) => {
        // TODO: Uncomment this when API includes "featured" tag
        // const featuredProducts = data.products.filter(product =>
        //   product.tags.includes('featured')
        // ).slice(0, 5);

        // For now, just get random 5 products
        const randomProducts = [...data.products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setProducts(randomProducts);
      });
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className='bg-[#E9F7FF] py-8 px-12'>
      <div className='container mx-auto px-4'>
        <div className='mb-2'>
          <h2 className='text-2xl font-semibold text-[#1a2030]'>
            Trending This Week
          </h2>
          <p className='text-gray-500 text-sm'>
            Special products in this month.
          </p>
        </div>

        <div className='relative'>
          <div
            ref={setScrollContainer}
            className='flex gap-6 overflow-x-auto scrollbar-hide grid-cols-1 md:grid-cols-3 lg:grid-cols-5 scroll-smooth py-4'
          >
            {products.map((product) => (
              <div key={product.id} className='flex-none w-[18vw]'>
                {/* <ProductCardFeature product={product} /> */}
                <ProductCardFeatured product={product} />
              </div>
            ))}
          </div>

          <Button
            variant='ghost'
            size='icon'
            className='absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full'
            onClick={() => scroll('left')}
          >
            <ChevronLeft className='h-6 w-6' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full'
            onClick={() => scroll('right')}
          >
            <ChevronRight className='h-6 w-6' />
          </Button>
        </div>
      </div>
    </div>
  );
}
