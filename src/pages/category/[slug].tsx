import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { ProductFilter } from '@/components/ProductPage/ProductFilter';
import { ProductSort } from '@/components/ProductPage/ProductSort';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { Breadcrumb } from '@/components/Breadcrumb';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  category: string;
}

export default function CategoryPage() {
  const { slug } = useParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const productsPerPage = 30;

  useEffect(() => {
    fetchProducts();
  }, [slug]);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `https://dummyjson.com/products/category/${slug}`
      );
      const data = await res.json();
      setProducts(data.products);
      setFilteredProducts(data.products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setIsLoading(false);
  };

  const handleFilterChange = (filters: any) => {
    setIsLoading(true);
    const filtered = products.filter((product) => {
      const matchesPrice =
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1];
      const matchesBrand =
        filters.brands.length === 0 || filters.brands.includes(product.brand);
      const matchesAvailability =
        filters.availability.length === 0 ||
        filters.availability.includes(product.availabilityStatus);
      return matchesPrice && matchesBrand && matchesAvailability;
    });
    setFilteredProducts(filtered);
    setCurrentPage(1);
    setIsLoading(false);
  };

  const handleSortChange = (value: string) => {
    setIsLoading(true);
    const sorted = [...filteredProducts];
    switch (value) {
      case 'name-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'price-asc':
        sorted.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        sorted.sort((a, b) => b.price - a.price);
        break;
      case 'rating-desc':
        sorted.sort((a, b) => b.rating - a.rating);
        break;
      case 'discount-desc':
        sorted.sort((a, b) => b.discountPercentage - a.discountPercentage);
        break;
    }
    setFilteredProducts(sorted);
    setIsLoading(false);
  };

  const handleAddToWishlist = (productId: number) => {
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <MainLayout>
      <div
        className='container mx-6 px-4 py-8'
        style={{ width: 'calc(100% - 3rem)' }}
      >
        {/* <Breadcrumb category={slug || ''} /> */}

        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            {
              label: slug,
              href: `/categories/slug`,
            },
          ]}
        />

        <div className='flex gap-8'>
          {/* Sidebar */}
          <div className='w-64 flex-shrink-0'>
            <ProductFilter
              products={products}
              onFilterChange={handleFilterChange}
            />
          </div>

          {/* Main Content */}
          <div className='flex-1'>
            <ProductSort onSortChange={handleSortChange} />

            {isLoading ? (
              <div className='flex items-center justify-center h-96'>
                <Loader2 className='h-8 w-8 animate-spin' />
              </div>
            ) : (
              <>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
                  {currentProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToWishlist={handleAddToWishlist}
                      isInWishlist={wishlist.includes(product.id)}
                    />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className='flex justify-center gap-2 mt-8'>
                    {[...Array(totalPages)].map((_, i) => (
                      <Button
                        key={i}
                        variant={currentPage === i + 1 ? 'default' : 'outline'}
                        onClick={() => setCurrentPage(i + 1)}
                      >
                        {i + 1}
                      </Button>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
