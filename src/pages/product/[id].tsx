import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, Loader2, Minus, Plus } from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/Breadcrumb';
import { ProductGallery } from '../../components/ProductPage/ProductGallery';
// import { ProductReviews } from '../../components/ProductPage/ProductReviews';
import { RelatedProducts } from '../../components/ProductPage/RelatedProducts';
import { Button } from '../../components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Star } from 'lucide-react';
import { useShop } from '../../contexts/ShopContext';
import { useCheckout } from '../../contexts/CheckoutContext';
import { fetchProductById, submitProductReview } from '../../services/api';
import { toast } from '../../components/ui/use-toast';
import LoginPopup from '../../components/utils/LoginPopup';
import { isLoggedIn } from '../../services/auth';
import { Features } from '../../components/utils/Features';
import { ReviewForm } from '../../components/ProductPage/ReviewForm';
import { ProductReviews } from '../../components/ProductPage/ProductReviews';

interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

interface ProductCategory {
  id: number;
  name: string;
  slug: string;
}

interface ProductReview {
  rating: number;
  comment: string;
  date: string;
  reviewerName: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  rating_count: number;
  stock_status: string;
  stock_quantity: number;
  sku?: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  shipping_required: boolean;
  shipping_taxable: boolean;
  shipping_class: string;
  reviews_allowed: boolean;
  categories: ProductCategory[];
  tags: Array<{
    id: number;
    name: string;
    slug: string;
  }>;
  images: ProductImage[];
  attributes: Array<{
    id: number;
    name: string;
    options: string[];
  }>;
  related_ids: number[];
  // Additional fields for UI
  reviews: ProductReview[];
  warrantyInformation: string;
  shippingInformation: string;
  availabilityStatus: string;
  returnPolicy: string;
}

export default function ProductPage() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useShop();
  const { addProduct } = useCheckout();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Review form state
  const [reviewName, setReviewName] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [id]); // Re-run when the product ID changes

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!id) return;

    const getProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const productData = await fetchProductById(Number.parseInt(id));
        const productId = id.split('-').pop() || id;

        const productData = await fetchProductById(productId);
        console.log('Specific product', productData);
        // Transform the API data to match our UI needs
        const transformedProduct: Product = {
          ...productData,
        };
        setProduct(transformedProduct);

        // Check if product is in wishlist
        if (isInWishlist) {
          // setIsWishlisted(isInWishlist(Number.parseInt(id)));
          setIsWishlisted(isInWishlist(Number.parseInt(productId)));
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [id, isInWishlist]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= (product?.stock_quantity || 1)) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = async () => {
    if (!product) return;
    if (!isLoggedIn()) {
      setIsLoginPopupOpen(true);
      return;
    }

    setIsAddingToCart(true);
    await addToCart(product.id, quantity, product.name, product.sku);
    if (isWishlisted) {
      setIsWishlisted(false);
    }
    setIsAddingToCart(false);
  };

  const handleWishlistClick = async () => {
    if (!product) return;

    if (!isLoggedIn()) {
      setIsLoginPopupOpen(true);
      return;
    }

    if (isWishlisted) {
      await removeFromWishlist(product.id);
      setIsWishlisted(false);
    } else {
      const success = await addToWishlist(
        product.id,
        product.name,
        product.sku
      );
      if (success) {
        setIsWishlisted(true);
      }
    }
  };

  const handleBuyNow = () => {
    if (!product) return;

    const discountedPrice = product.on_sale
      ? Number.parseFloat(product.sale_price)
      : Number.parseFloat(product.price);

    addProduct({
      id: product.id,
      title: product.name,
      thumbnail: product.images[0]?.src || '/placeholder.svg',
      price: discountedPrice,
      quantity: quantity,
      sku: product.sku || '',
    });

    navigate('/checkout');
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!reviewName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your name',
        variant: 'destructive',
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your review',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmittingReview(true);

    try {
      // In a real app, you would call an API to submit the review
      // For now, we'll just simulate it
      await submitProductReview(product.id, {
        name: reviewName,
        comment: reviewComment,
        rating: reviewRating,
      });

      // Add the new review to the product
      const newReview = {
        rating: reviewRating,
        comment: reviewComment,
        date: new Date().toISOString(),
        reviewerName: reviewName,
      };

      setProduct({
        ...product,
        reviews: [...product.reviews, newReview],
        rating_count: product.rating_count + 1,
        average_rating: (
          (Number.parseFloat(product.average_rating) * product.rating_count +
            reviewRating) /
          (product.rating_count + 1)
        ).toFixed(1),
      });

      // Reset form
      setReviewName('');
      setReviewComment('');
      setReviewRating(5);

      toast({
        title: 'Success',
        description: 'Your review has been submitted',
      });
    } catch (err) {
      console.error('Error submitting review:', err);
      toast({
        title: 'Error',
        description: 'Failed to submit your review. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLoginSuccess = async () => {
    setIsLoginPopupOpen(false);
    setIsAddingToCart(true);
    await addToCart(product?.id ?? 1, quantity, product?.name, product?.sku);
    setIsAddingToCart(false);
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#4280ef] text-white rounded-md hover:bg-[#3270df]"
            >
              Try Again
            </button>
          </div>
        </div>
      </MainLayout>
    );
  }

  if (!product) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <h1>Product not found</h1>
        </div>
      </MainLayout>
    );
  }

  const discountedPrice = product.on_sale
    ? Number.parseFloat(product.sale_price)
    : Number.parseFloat(product.price);

  const regularPrice = Number.parseFloat(
    product.regular_price || product.price
  );
  const discountPercentage = product.on_sale
    ? ((regularPrice - discountedPrice) / regularPrice) * 100
    : 0;

  return (
    <MainLayout>
      <div className={`container mx-auto  py-8 ${isMobile ? 'px-2' : 'px-8'}`}>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Categories', href: '/categories' },
            {
              label: product.categories[0]?.name || 'Products',
              href: `/categories/${product.categories[0]?.slug || 'all'}`,
            },
            { label: product.name, href: '#' },
          ]}
        />

        {/* Product Overview */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12  ${
            isMobile ? 'px-2' : 'px-12'
          }`}
        >
          <ProductGallery
            images={product.images.map((img) => img.src)}
            thumbnail={product.images[0]?.src || '/placeholder.svg'}
          />

          <div className="space-y-6">
            <div>
              <h1
                className={` font-bold mb-2 ${
                  isMobile ? 'text-xl' : 'text-3xl'
                }`}
              >
                {product.name}
              </h1>
              {/* {product.brand && (
                <p className='text-gray-500 mb-4'>Brand: {product.brand}</p>
              )} */}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i <
                        Math.round(Number.parseFloat(product.average_rating))
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating_count} reviews)
                </span>
              </div>

              <div className="mb-4">
                <span
                  className={` font-bold ${isMobile ? 'text-xl' : 'text-3xl'}`}
                >
                  Rs. {discountedPrice.toFixed(2)}
                </span>
                {product.on_sale && (
                  <>
                    <span className="text-lg text-gray-500 line-through ml-2">
                      Rs. {regularPrice.toFixed(2)}
                    </span>
                    <span className="text-green-500 ml-2">
                      Save {discountPercentage.toFixed(0)}%
                    </span>
                  </>
                )}
                <p className="text-sm text-gray-500 mt-1">Inclusive of GST</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center border rounded-lg">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center">{quantity}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= (product.stock_quantity || 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={handleWishlistClick}
              >
                <Heart
                  className={`h-5 w-5 ${
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-500'
                  }`}
                />
              </Button>
            </div>

            <div className="space-y-4">
              <div className={`  gap-2 ${isMobile ? 'flex-col ' : 'flex'}`}>
                <Button
                  className={`flex-grow-[7] ${isMobile ? 'mb-4 w-full' : ''}`}
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={
                    product.stock_status !== 'instock' || isAddingToCart
                  }
                >
                  {product.stock_status === 'instock'
                    ? isAddingToCart
                      ? 'Adding to Cart...'
                      : 'Add to Cart'
                    : 'Out of Stock'}
                </Button>
                <Button
                  variant={isWishlisted ? 'default' : 'outline'}
                  className={`flex-grow-[3] ${
                    isWishlisted ? 'bg-red-500 hover:bg-red-600' : ''
                  } ${isMobile ? 'w-full' : ''}`}
                  size="lg"
                  onClick={handleWishlistClick}
                >
                  <Heart
                    className={`h-5 w-5 ${isWishlisted ? 'fill-white' : ''}`}
                  />
                  <span className="ml-2">
                    {isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}
                  </span>
                </Button>
              </div>
              <Button
                variant="secondary"
                className="w-full"
                size="lg"
                onClick={handleBuyNow}
                disabled={product.stock_status !== 'instock'}
              >
                Buy Now
              </Button>
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Availability:{' '}
                <span className="font-medium">
                  {product.availabilityStatus}
                </span>
              </p>
              {product.sku && (
                <p className="text-sm text-gray-500">
                  SKU: <span className="font-medium">{product.sku}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          category={product.categories[0]?.slug || ''}
          currentProductId={product.id}
        />
        <Features />
        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12 ">
          <TabsList>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.rating_count})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="description" className="prose max-w-none px-4">
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
          </TabsContent>

          <TabsContent value="specifications" className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product Information</h3>
                <dl className="space-y-2">
                  {/* {product.brand && (
                    <div className='flex'>
                      <dt className='w-1/3 text-gray-500'>Brand</dt>
                      <dd className='w-2/3'>{product.brand}</dd>
                    </div>
                  )} */}
                  {product.weight && (
                    <div className="flex">
                      <dt className="w-1/3 text-gray-500">Weight</dt>
                      <dd className="w-2/3">{product.weight} kg</dd>
                    </div>
                  )}
                  {product.dimensions && (
                    <div className="flex">
                      <dt className="w-1/3 text-gray-500">Dimensions</dt>
                      <dd className="w-2/3">
                        {product.dimensions.height} x{' '}
                        {product.dimensions.length} x {product.dimensions.width}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* <div>
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
              </div> */}
            </div>
          </TabsContent>

          <TabsContent value="reviews" className="px-4">
            {/* Review Form */}
            <ReviewForm
              productId={product.id}
              onReviewSubmitted={() => {
                // Refresh product data to update ratings
                const getProduct = async () => {
                  try {
                    const productData = await fetchProductById(product.id);
                    setProduct({
                      ...productData,
                      reviews: productData.reviews || [],
                      warrantyInformation: '1 Year Manufacturer Warranty',
                      shippingInformation: 'Free shipping on orders over $50',
                      availabilityStatus:
                        productData.stock_status === 'instock'
                          ? 'In Stock'
                          : 'Out of Stock',
                      returnPolicy: '30-day return policy',
                    });
                  } catch (err) {
                    console.error('Error refreshing product:', err);
                  }
                };
                getProduct();
              }}
            />

            {/* Reviews List */}
            <ProductReviews
              productId={product.id}
              onReviewsUpdate={() => {
                // Refresh product data to update ratings
                const getProduct = async () => {
                  try {
                    const productData = await fetchProductById(
                      Number.parseInt(id)
                    );
                    setProduct({
                      ...productData,
                      reviews: productData.reviews || [],
                      warrantyInformation: '1 Year Manufacturer Warranty',
                      shippingInformation: 'Free shipping on orders over $50',
                      availabilityStatus:
                        productData.stock_status === 'instock'
                          ? 'In Stock'
                          : 'Out of Stock',
                      returnPolicy: '30-day return policy',
                    });
                  } catch (err) {
                    console.error('Error refreshing product:', err);
                  }
                };
                getProduct();
              }}
            />
          </TabsContent>
        </Tabs>

        <LoginPopup
          isOpen={isLoginPopupOpen}
          onClose={() => setIsLoginPopupOpen(false)}
          onLoginSuccess={handleLoginSuccess}
          productName={product.name}
        />
      </div>
    </MainLayout>
  );
}
