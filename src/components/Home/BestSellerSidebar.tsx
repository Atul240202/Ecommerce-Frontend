import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { fetchBestSellerProducts } from '../../services/api';
import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';

interface ApiProduct {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  images: Array<{ src: string }>;
}

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  rating: number;
}

export function BestSellerSidebar() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 11;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const bestSellers = await fetchBestSellerProducts(15);

        if (!bestSellers || bestSellers.length === 0) {
          console.log('No bestseller products returned from API.');
          return;
        }

        const transformedProducts: Product[] = bestSellers.map(
          (product: ApiProduct) => ({
            id: product.id,
            title: product.name,
            thumbnail: product.images?.[0]?.src || '/placeholder.svg',
            price: Number.parseFloat(product.price || '0'),
            regularPrice: Number.parseFloat(product.regular_price || '0'),
            salePrice: Number.parseFloat(product.sale_price || '0'),
            rating: Number.parseFloat(product.average_rating || '0'),
          })
        );

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching bestseller products:', error);
      }
    };

    fetchProducts();
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () =>
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <div className='w-[300px] bg-white rounded-lg border border-gray-200'>
      <div className='bg-blue-500 p-4 rounded-t-lg flex items-center justify-between'>
        <h2 className='text-white font-semibold'>Best Seller</h2>
        <div className='flex gap-2'>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-white hover:bg-blue-600'
            onClick={prevPage}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='ghost'
            size='icon'
            className='h-6 w-6 text-white hover:bg-blue-600'
            onClick={nextPage}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>
      <div className='p-4 space-y-4'>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <Link to={`/product/${product.id}`} className='block'>
              <div className='flex gap-3 group cursor-pointer'>
                <div className='relative w-16 h-16 flex-shrink-0'>
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className='rounded-lg'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='text-sm font-medium text-gray-900 truncate group-hover:text-blue-500'>
                    {product.title}
                  </h3>
                  <div className='flex items-center gap-1 mt-1'>
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < Math.round(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className='mt-1'>
                    <span className='font-semibold text-gray-900'>
                      Rs. {product.price.toFixed(2)}
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
                </div>
              </div>
            </Link>
          ))
        ) : (
          <p className='text-gray-500 text-center'>No bestsellers available</p>
        )}
      </div>
    </div>
  );
}
