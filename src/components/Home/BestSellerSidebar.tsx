import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  rating: number;
  tags: string[];
}

export function BestSellerSidebar() {
  const [products, setProducts] = useState<Product[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const productsPerPage = 11;

  useEffect(() => {
    fetch('https://dummyjson.com/products?limit=30')
      .then((res) => res.json())
      .then((data) => {
        // TODO: Uncomment when API includes bestseller tag
        // const bestsellerProducts = data.products
        //   .filter(product => product.tags.includes('bestseller'))
        //   .slice(0, 15);

        // For now, get random 15 products
        const randomProducts = [...data.products]
          .sort(() => 0.5 - Math.random())
          .slice(0, 15);
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
    <div className='w-[300px] bg-white rounded-lg border border-gray-200'>
      <div className='bg-blue-500 p-4 rounded-t-lg flex items-center justify-between'>
        <h2 className='text-white font-semibold'>Best seller</h2>
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
        {currentProducts.map((product) => (
          <div key={product.id} className='flex gap-3 group cursor-pointer'>
            <div className='relative w-16 h-16 flex-shrink-0'>
              <img
                src={product.thumbnail || '/placeholder.svg'}
                alt={product.title}
                // layout='fill'
                // objectFit='cover'
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
                  ${product.price.toFixed(2)}
                </span>
                <span className='ml-2 text-sm text-gray-500 line-through'>
                  ${(product.price * 1.2).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
