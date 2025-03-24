import { useEffect, useState } from 'react';
import { ProductCard } from '../ProductCard';
import { fetchRelatedProducts } from '@/services/api';

interface Product {
  id: number;
  name: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  images: Array<{
    id: number;
    src: string;
  }>;
  average_rating: string;
  categories: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
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
  const [error, setError] = useState<string | null>(null);

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
        setProducts(data);
        setError(null);
      } catch (err) {
        console.error('Error fetching related products:', err);
        setError('Failed to load related products');
      } finally {
        setLoading(false);
      }
    };

    getRelatedProducts();
  }, [category, currentProductId]);

  if (loading) {
    return (
      <div>
        <h2 className='text-2xl font-semibold mb-6'>Related Products</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
          {[...Array(5)].map((_, index) => (
            <div
              key={index}
              className='border rounded-md p-4 h-64 animate-pulse'
            >
              <div className='bg-gray-200 h-32 w-full mb-4'></div>
              <div className='bg-gray-200 h-4 w-3/4 mb-2'></div>
              <div className='bg-gray-200 h-4 w-1/2'></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2 className='text-2xl font-semibold mb-6'>Related Products</h2>
        <p className='text-red-500'>{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div>
        <h2 className='text-2xl font-semibold mb-6'>Related Products</h2>
        <p className='text-gray-500'>No related products found</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-6'>Related Products</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={{
              id: product.id,
              title: product.name,
              brand:
                product.categories.find((cat) => cat.name === 'Brand')?.name ||
                '',
              thumbnail: product.images[0]?.src || '/placeholder.svg',
              price: Number.parseFloat(product.price),
              discountPercentage: product.on_sale
                ? ((Number.parseFloat(product.regular_price) -
                    Number.parseFloat(product.sale_price)) /
                    Number.parseFloat(product.regular_price)) *
                  100
                : 0,
              rating: Number.parseFloat(product.average_rating),
              slug: product.slug,
            }}
            onAddToWishlist={() => {}}
            isInWishlist={false}
          />
        ))}
      </div>
    </div>
  );
}
