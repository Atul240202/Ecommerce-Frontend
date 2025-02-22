import { useState, useEffect } from 'react';
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

export function MonthFeaturedGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 8;

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=30')
      .then((res) => res.json())
      .then((data) => {
        // TODO: Uncomment when API includes month tag
        // const monthProducts = data.products
        //   .filter(product => product.tags.includes('month'))
        //   .slice(0, 16);

        // For now, get random 16 products
        const randomProducts = [...data.products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 16);
        setProducts(randomProducts);
      });
  }, []);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    currentPage * productsPerPage,
    (currentPage + 1) * productsPerPage
  );

  const nextPage = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages);
  };

  const prevPage = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);
  };

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

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
        {currentProducts.map((product) => (
          <ProductCardFeatured key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
