import { useEffect, useState } from 'react';
import { ProductCardFeatured } from '../Home/ProductCardFeatured';
import { fetchRelatedProducts } from '../../services/api';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: Array<{ id: number; src: string }>;
  average_rating: string;
  categories: Array<{ id: number; name: string; slug: string }>;
  slug: string;
}

interface RelatedProductsProps {
  category: string;
  currentProductId: number;
}

export function RelatedProducts({
  category,
  currentProductId,
}: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
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
    const getRelatedProducts = async () => {
      if (!category) {
        setProducts([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await fetchRelatedProducts(category, currentProductId);
        setProducts(data.products);
      } catch (err) {
        console.error('Error fetching related products:', err);
      } finally {
        setLoading(false);
      }
    };

    getRelatedProducts();
  }, [category, currentProductId]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainer) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollContainer.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className='py-8'>
      <div className='container mx-auto px-4'>
        <div className='mb-2'>
          <h2 className='text-2xl font-semibold text-[#1a2030]'>
            Related Products
          </h2>
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
                    className={`flex-none ${
                      isMobile ? 'w-[200px]' : 'w-[280px]'
                    }`}
                  >
                    <ProductCardFeatured
                      product={{
                        id: product.id,
                        title: product.name,
                        description: '',
                        thumbnail: product.images[0]?.src || '/placeholder.svg',
                        price: Number.parseFloat(product.price),
                        regularPrice: Number.parseFloat(product.regular_price),
                        salePrice: Number.parseFloat(product.sale_price),
                        discountPercentage: product.on_sale
                          ? ((Number.parseFloat(product.regular_price) -
                              Number.parseFloat(product.sale_price)) /
                              Number.parseFloat(product.regular_price)) *
                            100
                          : 0,
                        stock: product.on_sale === true ? 1 : 0,
                        rating: Number.parseFloat(product.average_rating),
                        slug: product.slug,
                      }}
                      // onAddToWishlist={() => {}}
                      // isInWishlist={false}
                    />
                  </div>
                ))
              ) : (
                <div className='w-full text-center py-8'>
                  <p className='text-gray-500'>No related products available</p>
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
