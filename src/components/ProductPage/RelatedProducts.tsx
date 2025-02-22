import { useEffect, useState } from 'react';
import { ProductCard } from '../ProductCard';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
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

  useEffect(() => {
    fetch(`https://dummyjson.com/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.products
          .filter((p: Product) => p.id !== currentProductId)
          .slice(0, 5);
        setProducts(filtered);
      });
  }, [category, currentProductId]);

  return (
    <div>
      <h2 className='text-2xl font-semibold mb-6'>Related Products</h2>
      <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6'>
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToWishlist={() => {}}
            isInWishlist={false}
          />
        ))}
      </div>
    </div>
  );
}
