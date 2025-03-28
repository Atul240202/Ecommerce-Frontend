import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { ProductCardFeatured } from './ProductCardFeatured';
import {
  fetchFeaturedProducts,
  fetchBestSellerProducts,
} from '../../services/api';

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
  images: Array<{ src: string }>;
  categories: Array<{ name: string }>;
}

interface Product {
  id: number;
  title: string;
  description: string;
  brand: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  stock: number;
}

export function MonthFeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const monthFeatured = await fetchBestSellerProducts(15); // Fetch 16 featured products for the month

        if (!monthFeatured || monthFeatured.length === 0) {
          console.log('No month-featured products returned from API.');
          return;
        }

        const transformedProducts: Product[] = monthFeatured.map(
          (product: ApiProduct) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            brand:
              product.categories?.find((cat) => cat.name === 'Brand')?.name ||
              'Unknown',
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

        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching month-featured products:', error);
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
    <div className='flex-1'>
      <div className='flex items-center justify-between mb-6'>
        <h2 className='text-2xl font-semibold text-[#1a2030]'>
          Trending Products This Month
        </h2>
        <div className='flex gap-2'>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={prevPage}
          >
            <ChevronLeft className='h-4 w-4' />
          </Button>
          <Button
            variant='outline'
            size='icon'
            className='h-8 w-8'
            onClick={nextPage}
          >
            <ChevronRight className='h-4 w-4' />
          </Button>
        </div>
      </div>

      <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {currentProducts.length > 0 ? (
          currentProducts.map((product) => (
            <ProductCardFeatured key={product.id} product={product} />
          ))
        ) : (
          <p className='text-gray-500 text-center'>
            No featured products available this month
          </p>
        )}
      </div>
    </div>
  );
}
