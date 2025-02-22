import { useState } from 'react';
import { ProductCard } from '../ProductCard';
import { Button } from '@/components/ui/button.tsx';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
}

interface ProductGridProps {
  featuredProducts: Product[];
  bestSellerProducts: Product[];
}

export function ProductGrid({
  featuredProducts,
  bestSellerProducts,
}: ProductGridProps) {
  const [activeTab, setActiveTab] = useState<'featured' | 'bestseller'>(
    'featured'
  );

  return (
    <div className='pt-12 pb-6 px-12'>
      <div className='flex gap-4 mb-8 px-4'>
        <Button
          variant={activeTab === 'featured' ? 'default' : 'outline'}
          onClick={() => setActiveTab('featured')}
        >
          Featured
        </Button>
        <Button
          variant={activeTab === 'bestseller' ? 'default' : 'outline'}
          onClick={() => setActiveTab('bestseller')}
        >
          Best Seller
        </Button>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 px-4'>
        {(activeTab === 'featured' ? featuredProducts : bestSellerProducts).map(
          (product) => (
            <ProductCard key={product.id} product={product} />
          )
        )}
      </div>
    </div>
  );
}
