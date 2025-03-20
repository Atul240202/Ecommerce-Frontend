import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { MainLayout } from '@/layouts/MainLayout';
import { ProductCard } from '@/components/ProductCard';
import { searchProducts } from '@/services/api';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
}

export default function SearchPage() {
  const router = useRouter();
  const { q } = router.query;
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  useEffect(() => {
    if (!q) return;

    const fetchSearchResults = async () => {
      setLoading(true);
      try {
        const data = await searchProducts(q as string, 50);
        setProducts(data.products || []);
        setTotalResults(data.total || 0);
      } catch (error) {
        console.error('Error fetching search results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [q]);

  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: `Search: ${q}`, href: `/search?q=${q}` },
  ];

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb items={breadcrumbItems} />

        <div className='mb-8'>
          <h1 className='text-2xl font-bold'>Search Results for "{q}"</h1>
          <p className='text-gray-600 mt-2'>
            {loading ? 'Searching...' : `${totalResults} products found`}
          </p>
        </div>

        {loading ? (
          <div className='flex justify-center items-center py-20'>
            <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-[#4280ef]'></div>
          </div>
        ) : products.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className='text-center py-20'>
            <h2 className='text-xl font-semibold text-gray-700'>
              No products found
            </h2>
            <p className='text-gray-500 mt-2'>
              Try adjusting your search or browse our categories to find what
              you're looking for.
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
