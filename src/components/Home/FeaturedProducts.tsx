import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ProductCardFeatured } from './ProductCardFeatured';
import { fetchBestSellerProducts } from '../../services/api';

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  stock_status: string;
  images: Array<{
    src: string;
  }>;
  categories: Array<{
    name: string;
  }>;
}

interface TransformedProduct {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  stock: number;
}

export function FeaturedProducts() {
  const [products, setProducts] = useState<TransformedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollContainer, setScrollContainer] = useState<HTMLDivElement | null>(
    null
  );
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const getProducts = async () => {
      try {
        setLoading(true);
        const featuredProducts = await fetchBestSellerProducts(8);

        if (!featuredProducts || featuredProducts.length === 0) {
          return;
        }

        // Transform API data to match what ProductCardFeatured expects
        const transformedProducts = featuredProducts.map(
          (product: ApiProduct) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            thumbnail: product.images?.[0]?.src || '/placeholder.svg',
            price: Number.parseFloat(product.price || '0'),
            regularPrice: Number.parseFloat(product.regular_price || '0'),
            salePrice: Number.parseFloat(product.sale_price || '0'),
            discountPercentage: product.on_sale
              ? ((Number.parseFloat(product.regular_price || '0') -
                  Number.parseFloat(product.sale_price || '0')) /
                  Number.parseFloat(product.regular_price || '1')) *
                100
              : 0,
            rating: Number.parseFloat(product.average_rating || '0'),
            stock: product.stock_status === 'instock' ? 100 : 0,
          })
        );

        if (transformedProducts.length === 0) {
        } else {
          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className='bg-[#f8fbff] py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-2'>
          <h2 className='text-2xl font-semibold text-[#1a2030]'>
            Trending This Week
          </h2>
          <p className='text-gray-500 text-sm'>
            Special products in this week.
          </p>
        </div>

        <div className='relative'>
          {loading ? (
            <div className='flex justify-center py-8'>
              <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]'></div>
            </div>
          ) : (
            <div
              ref={setScrollContainer}
              className='flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth py-4'
            >
              {products.length > 0 ? (
                products.map((product) => (
                  <div
                    key={product.id}
                    className={`flex-none  ${
                      isMobile ? 'w-[200px]' : 'w-[280px]'
                    }`}
                  >
                    <ProductCardFeatured product={product} />
                  </div>
                ))
              ) : (
                <div className='w-full text-center py-8'>
                  <p className='text-gray-500'>
                    No featured products available
                  </p>
                </div>
              )}
            </div>
          )}

          {products.length > 0 && (
            <>
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
            </>
          )}
        </div>
      </div>
    </div>
  );
}
