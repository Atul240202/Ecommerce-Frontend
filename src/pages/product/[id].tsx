import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Heart, Loader2, Minus, Plus } from 'lucide-react';
import { MainLayout } from '@/layouts/MainLayout';
import { Breadcrumb } from '@/components/Breadcrumb';
import { ProductGallery } from '@/components/ProductPage/ProductGallery';
import { ProductReviews } from '@/components/ProductPage/ProductReviews';
import { RelatedProducts } from '@/components/ProductPage/RelatedProducts';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Star } from 'lucide-react';

interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  thumbnail: string;
  images: string[];
  tags: string[];
  sku: string;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  reviews: Array<{
    rating: number;
    comment: string;
    date: string;
    reviewerName: string;
  }>;
  returnPolicy: string;
  minimumOrderQuantity: number;
}

export default function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await fetch(`https://dummyjson.com/products/${id}`);
      const data = await res.json();
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
    setIsLoading(false);
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock || 1)) {
      setQuantity(newQuantity);
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className='flex items-center justify-center h-screen'>
          <Loader2 className='h-8 w-8 animate-spin' />
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-8'>
          <h1>Product not found</h1>
        </div>
      </MainLayout>
    );
  }

  const discountedPrice =
    product.price * (1 - product.discountPercentage / 100);

  return (
    <MainLayout>
      <div
        className='container mx-6 px-4 py-8'
        style={{ width: 'calc(100% - 3rem)' }}
      >
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            {
              label: product.category,
              href: `/categories/${product.category}`,
            },
            { label: product.title, href: '#' },
          ]}
        />

        {/* Product Overview */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12'>
          <ProductGallery
            images={product.images}
            thumbnail={product.thumbnail}
          />

          <div className='space-y-6'>
            <div>
              <h1 className='text-3xl font-bold mb-2'>{product.title}</h1>
              <p className='text-gray-500 mb-4'>Brand: {product.brand}</p>

              <div className='flex items-center gap-4 mb-4'>
                <div className='flex gap-1'>
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.round(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className='text-sm text-gray-500'>
                  ({product.reviews.length} reviews)
                </span>
              </div>

              <div className='mb-4'>
                <span className='text-3xl font-bold'>
                  ${discountedPrice.toFixed(2)}
                </span>
                {product.discountPercentage > 0 && (
                  <>
                    <span className='text-lg text-gray-500 line-through ml-2'>
                      ${product.price.toFixed(2)}
                    </span>
                    <span className='text-green-500 ml-2'>
                      Save {product.discountPercentage}%
                    </span>
                  </>
                )}
                <p className='text-sm text-gray-500 mt-1'>Inclusive of GST</p>
              </div>
            </div>

            <div className='flex items-center gap-4'>
              <div className='flex items-center border rounded-lg'>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className='h-4 w-4' />
                </Button>
                <span className='w-12 text-center'>{quantity}</span>
                <Button
                  variant='ghost'
                  size='icon'
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.stock}
                >
                  <Plus className='h-4 w-4' />
                </Button>
              </div>
              <Button
                variant='outline'
                size='icon'
                onClick={() => setIsWishlisted(!isWishlisted)}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
                  }`}
                />
              </Button>
            </div>

            <div className='space-y-4'>
              <Button className='w-full' size='lg'>
                Add to Cart
              </Button>
              <Button variant='secondary' className='w-full' size='lg'>
                Buy Now
              </Button>
            </div>

            <div className='border-t pt-4'>
              <p className='text-sm text-gray-500'>
                Availability:{' '}
                <span className='font-medium'>
                  {product.availabilityStatus}
                </span>
              </p>
              <p className='text-sm text-gray-500'>
                SKU: <span className='font-medium'>{product.sku}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <Tabs defaultValue='description' className='mb-12'>
          <TabsList>
            <TabsTrigger value='description'>Description</TabsTrigger>
            <TabsTrigger value='specifications'>Specifications</TabsTrigger>
            <TabsTrigger value='reviews'>
              Reviews ({product.reviews.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value='description' className='prose max-w-none'>
            <p>{product.description}</p>
          </TabsContent>

          <TabsContent value='specifications'>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-8'>
              <div>
                <h3 className='font-semibold mb-4'>Product Information</h3>
                <dl className='space-y-2'>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Brand</dt>
                    <dd className='w-2/3'>{product.brand}</dd>
                  </div>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Weight</dt>
                    <dd className='w-2/3'>{product.weight} kg</dd>
                  </div>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Dimensions</dt>
                    <dd className='w-2/3'>
                      {product.dimensions.width} x {product.dimensions.height} x{' '}
                      {product.dimensions.depth} cm
                    </dd>
                  </div>
                </dl>
              </div>

              <div>
                <h3 className='font-semibold mb-4'>Additional Information</h3>
                <dl className='space-y-2'>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Warranty</dt>
                    <dd className='w-2/3'>{product.warrantyInformation}</dd>
                  </div>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Shipping</dt>
                    <dd className='w-2/3'>{product.shippingInformation}</dd>
                  </div>
                  <div className='flex'>
                    <dt className='w-1/3 text-gray-500'>Return Policy</dt>
                    <dd className='w-2/3'>{product.returnPolicy}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </TabsContent>

          <TabsContent value='reviews'>
            <ProductReviews reviews={product.reviews} />
          </TabsContent>
        </Tabs>

        {/* Related Products */}
        <RelatedProducts
          category={product.category}
          currentProductId={product.id}
        />
      </div>
    </MainLayout>
  );
}
