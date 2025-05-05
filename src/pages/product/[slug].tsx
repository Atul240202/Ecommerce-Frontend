"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Heart, Loader2, Minus, Plus } from "lucide-react";
import { MainLayout } from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ProductGallery } from "../../components/ProductPage/ProductGallery";
// import { ProductReviews } from '../../components/ProductPage/ProductReviews';
import { RelatedProducts } from "../../components/ProductPage/RelatedProducts";
import { Button } from "../../components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Star } from "lucide-react";
import { useShop } from "../../contexts/ShopContext";
import { useCheckout } from "../../contexts/CheckoutContext";
import {
  fetchProductById,
  submitProductReview,
  fetchProductBySlug,
  checkDeliveryAvailability,
} from "../../services/api";
import { toast } from "../../components/ui/use-toast";
import LoginPopup from "../../components/utils/LoginPopup";
import { isLoggedIn } from "../../services/auth";
import { Features } from "../../components/utils/Features";
import { ReviewForm } from "../../components/ProductPage/ReviewForm";
import { ProductReviews } from "../../components/ProductPage/ProductReviews";

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
  brand: string;
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
  tax_class: string;
  tax_status: string;
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
  youtube_vid?: string;
  youtubeId?: string;
  shipping_amount?: number;
  short_description?: string;
}

export default function ProductPage() {
  const { addToCart, addToWishlist, removeFromWishlist, isInWishlist } =
    useShop();
  const { addProduct } = useCheckout();
  const navigate = useNavigate();
  // const { id } = useParams<{ id: string }>();
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoginPopupOpen, setIsLoginPopupOpen] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  // Review form state
  const [reviewName, setReviewName] = useState("");
  const [reviewComment, setReviewComment] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [isMobile, setIsMobile] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<{
    available: boolean;
    estimatedDays?: number;
    courierName?: string;
    city?: string;
    pincode?: string;
    shippingCharges?: number;
  } | null>(null);
  const [checkingDelivery, setCheckingDelivery] = useState(false);
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [slug]); // Re-run when the product ID changes

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    //if (!id) return;
    if (!slug) return;

    const getProduct = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // const productData = await fetchProductById(Number.parseInt(id));
        // const productId = id.split("-").pop() || id;

        // const productData = await fetchProductById(id);
        const productData = await fetchProductBySlug(slug);
        // Transform the API data to match our UI needs
        const transformedProduct: Product = {
          ...productData,
        };
        setProduct(transformedProduct);

        // Check if product is in wishlist
        if (isInWishlist) {
          // setIsWishlisted(isInWishlist(Number.parseInt(id)));
          setIsWishlisted(isInWishlist(productData.id));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    getProduct();
  }, [slug, isInWishlist]);

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;

    const isStockLimited =
      product?.stock_quantity !== null && product?.stock_quantity !== undefined;

    if (
      newQuantity >= 1 &&
      (!isStockLimited || newQuantity <= product.stock_quantity)
    ) {
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

  const handleCheckDelivery = async () => {
    if (!pincode.trim() || !product) return;
    try {
      setCheckingDelivery(true);

      // Extract dimensions and weight from product
      const weight = product.weight ? Number.parseFloat(product.weight) : 0.5; // Default to 0.5kg if not specified

      // Extract dimensions, defaulting to 10cm if not specified
      const length = product.dimensions?.length
        ? Number.parseFloat(product.dimensions.length)
        : 10;
      const breadth = product.dimensions?.width
        ? Number.parseFloat(product.dimensions.width)
        : 10;
      const height = product.dimensions?.height
        ? Number.parseFloat(product.dimensions.height)
        : 10;

      // Calculate declared value based on product pricing
      let declared_value = 0;
      if (product.on_sale && product.sale_price) {
        declared_value = Number.parseFloat(product.sale_price);
      } else if (product.regular_price && product.regular_price !== "0") {
        declared_value = Number.parseFloat(product.regular_price);
      } else if (product.price) {
        declared_value = Number.parseFloat(product.price);
      } else {
        declared_value = 500; // Default value if no price is specified
      }

      // Call the API with all parameters
      const response = await checkDeliveryAvailability(
        pincode,
        weight,
        length,
        breadth,
        height,
        declared_value
      );

      if (response.success) {
        setDeliveryInfo({
          available: response.available,
          estimatedDays: response.estimated_delivery_days,
          courierName: response.courier_name,
          city: response.city,
          pincode: response.pincode,
          shippingCharges: response.shipping_charges,
        });
      } else {
        setDeliveryInfo({ available: false });
      }
    } catch (error) {
      console.error("Error checking delivery:", error);
      setDeliveryInfo(null);
    } finally {
      setCheckingDelivery(false);
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
      thumbnail: product.images[0]?.src,
      price: discountedPrice,
      quantity: quantity,
      sku: product.sku || "",
      shipping_amount: product.shipping_amount ?? 200,
      weight: product.weight ?? "0.5",
      dimensions: {
        length: product.dimensions?.length ?? "0",
        width: product.dimensions?.width ?? "0",
        height: product.dimensions?.height ?? "0",
      },
    });

    navigate("/checkout");
  };

  const handleContactForNull = () => {
    const url = window.location.href;
    navigate(
      `/contact?product=${encodeURIComponent(url)}&quantity=${quantity}`
    );
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!product) return;

    if (!reviewName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your name",
        variant: "destructive",
      });
      return;
    }

    if (!reviewComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter your review",
        variant: "destructive",
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
      setReviewName("");
      setReviewComment("");
      setReviewRating(5);

      toast({
        title: "Success",
        description: "Your review has been submitted",
      });
    } catch (err) {
      console.error("Error submitting review:", err);
      toast({
        title: "Error",
        description: "Failed to submit your review. Please try again.",
        variant: "destructive",
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

  let exclusiveOfGST: number | null = null;

  if (product.tax_status === "taxable" && product.tax_class?.trim() !== "") {
    const taxPercentage = Number(product.tax_class);
    if (!isNaN(taxPercentage) && taxPercentage > 0) {
      const taxAmount =
        (discountedPrice * taxPercentage) / (100 + taxPercentage);
      exclusiveOfGST = discountedPrice - taxAmount;
    }
  }

  const regularPrice = Number.parseFloat(
    product.regular_price || product.price
  );
  const discountPercentage = product.on_sale
    ? ((regularPrice - discountedPrice) / regularPrice) * 100
    : 0;

  return (
    <MainLayout>
      <div
        className={`container mx-auto  py-8 ${
          isMobile ? "px-2 max-w-[100vw]" : "px-8"
        }`}
      >
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            {
              label: product.categories[0]?.name || "Products",
              href: `/categories/${product.categories[0]?.slug || "all"}`,
            },
            { label: product.name, href: "#" },
          ]}
        />

        {/* Product Overview */}
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12  ${
            isMobile ? "px-2" : "px-12"
          }`}
        >
          <ProductGallery
            images={product.images.map((img) => img.src)}
            thumbnail={product.images[0]?.src || "/placeholder.svg"}
            youtubeVid={product.youtube_vid}
            youtubeId={product.youtubeId}
          />

          <div className="space-y-6">
            <div>
              <h1
                className={` font-bold mb-2 ${
                  isMobile ? "text-xl" : "text-3xl"
                }`}
              >
                {product.name}
              </h1>
              {product.brand && (
                <p className="text-gray-500 mb-4">Brand: {product.brand}</p>
              )}

              <div className="flex items-center gap-4 mb-4">
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i <
                        Math.round(Number.parseFloat(product.average_rating))
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-500">
                  ({product.rating_count} reviews)
                </span>
              </div>
              {product.price === "0" || product.price === "" ? (
                <div className="mb-4">
                  <span
                    className={`font-bold ${isMobile ? "text-xl" : "text-3xl"}`}
                  >
                    Price on Demand
                  </span>
                </div>
              ) : (
                <>
                  {exclusiveOfGST && (
                    <>
                      <span className={` ${isMobile ? "text-xl" : "text-2xl"}`}>
                        ₹{exclusiveOfGST.toFixed(2)}
                      </span>
                      <p className="text-sm text-gray-500 mt-1">
                        Exclusive of GST
                      </p>
                    </>
                  )}
                  <div className="mb-4">
                    <span
                      className={`font-bold ${
                        isMobile ? "text-xl" : "text-3xl"
                      }`}
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
                    <p className="text-sm text-gray-500 mt-1">
                      Inclusive of GST
                    </p>
                  </div>
                </>
              )}
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
                  disabled={
                    product.stock_quantity !== null &&
                    product.stock_quantity !== undefined &&
                    quantity >= product.stock_quantity
                  }
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              {product.price !== "0" && product.price !== "" && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleWishlistClick}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isWishlisted
                        ? "fill-red-500 text-red-500"
                        : "text-gray-500"
                    }`}
                  />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <div className={`gap-2 ${isMobile ? "flex-col" : "flex"}`}>
                {product.price !== "0" && product.price !== "" && (
                  <Button
                    className={`flex-grow-[7] ${isMobile ? "mb-4 w-full" : ""}`}
                    size="lg"
                    onClick={handleAddToCart}
                    disabled={
                      product.stock_status !== "instock" || isAddingToCart
                    }
                  >
                    {product.stock_status === "instock"
                      ? isAddingToCart
                        ? "Adding to Cart..."
                        : "Add to Cart"
                      : "Out of Stock"}
                  </Button>
                )}

                {product.price !== "0" && product.price !== "" && (
                  <Button
                    variant={isWishlisted ? "default" : "outline"}
                    className={`flex-grow-[3] ${
                      isWishlisted ? "bg-red-500 hover:bg-red-600" : ""
                    } ${isMobile ? "w-full" : ""}`}
                    size="lg"
                    onClick={handleWishlistClick}
                  >
                    <Heart
                      className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`}
                    />
                    <span className="ml-2">
                      {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
                    </span>
                  </Button>
                )}
              </div>

              {!(product.price === "0" || product.price === "") && (
                <Button
                  variant="secondary"
                  className="w-full hover:bg-[#D2EEFF]"
                  size="lg"
                  onClick={handleBuyNow}
                  disabled={
                    product.stock_status !== "instock" || product.price == "0"
                  }
                >
                  Buy Now
                </Button>
              )}
              {(product.price === "0" || product.price === "") && (
                <Button
                  variant="secondary"
                  className="w-full hover:bg-[#D2EEFF]"
                  size="lg"
                  onClick={handleContactForNull}
                  disabled={product.stock_status !== "instock"}
                >
                  Ask for Quote
                </Button>
              )}
            </div>

            <div className="border-t pt-4">
              <p className="text-sm text-gray-500">
                Availability:{" "}
                <span className="font-medium">
                  {product.stock_status ? "In Stock" : "Not Available"}
                </span>
              </p>
              {product.sku && (
                <p className="text-sm text-gray-500">
                  SKU: <span className="font-medium">{product.sku}</span>
                </p>
              )}
            </div>

            <div className="mt-6">
              <div className="flex gap-2 items-center">
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter Pincode"
                  className="border rounded p-2 w-1/2"
                  maxLength={6}
                />
                <Button
                  size="lg"
                  onClick={handleCheckDelivery}
                  disabled={checkingDelivery}
                >
                  {checkingDelivery ? "Checking..." : "Check Delivery"}
                </Button>
              </div>

              <div className="mt-4">
                {deliveryInfo && (
                  <div className="text-sm">
                    {deliveryInfo.available ? (
                      <>
                        <p>
                          Delivery at <b>{deliveryInfo.pincode}</b>{" "}
                          {deliveryInfo.city && (
                            <>
                              – <b>{deliveryInfo.city}</b>
                            </>
                          )}
                        </p>
                        {/* {deliveryInfo.shippingCharges !== undefined && (
                          <p>
                            Shipping charges: ₹
                            {deliveryInfo.shippingCharges.toFixed(2)}
                          </p>
                        )} */}
                        {deliveryInfo.estimatedDays && (
                          <p className="text-green-600 font-semibold mt-1">
                            Expected delivery by:{" "}
                            {new Date(
                              Date.now() +
                                deliveryInfo.estimatedDays * 24 * 60 * 60 * 1000
                            ).toDateString()}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-red-600">
                        Delivery not available to this pincode ❌
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <RelatedProducts
          category={product.categories[0]?.slug || ""}
          currentProductId={product.id}
        />
        <Features />
        {/* Product Details Tabs */}
        <Tabs defaultValue="description" className="mb-12 ">
          <TabsList>
            <TabsTrigger value="about">
              {isMobile ? "About" : "About the item"}
            </TabsTrigger>
            <TabsTrigger value="description">Description</TabsTrigger>
            <TabsTrigger value="specifications">Specifications</TabsTrigger>
            <TabsTrigger value="reviews">
              Reviews ({product.rating_count})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="about" className="prose max-w-none px-4">
            {product.short_description && (
              <>
                <div
                  dangerouslySetInnerHTML={{
                    __html: product.short_description,
                  }}
                />
                <style jsx global>{`
                  .ProseMirror table {
                    border-collapse: collapse;
                    table-layout: fixed;
                    width: 100%;
                    margin: 0 0 1rem 0;
                    overflow: hidden;
                  }

                  .ProseMirror ul {
                    list-style-type: disc;
                    padding-left: 1.5em;
                    margin: 1em 0;
                  }

                  .ProseMirror ol {
                    list-style-type: decimal;
                    padding-left: 1.5em;
                    margin: 1em 0;
                  }

                  .ProseMirror li {
                    margin-bottom: 0.5em;
                  }
                  .ProseMirror table td,
                  .ProseMirror table th {
                    min-width: 1em;
                    border: 1px solid #ddd;
                    padding: 12px;
                    vertical-align: top;
                    box-sizing: border-box;
                    position: relative;
                  }

                  .ProseMirror table th {
                    font-weight: bold;
                    background-color: #f9f9f9;
                  }

                  .ProseMirror table tr:nth-child(even) td {
                    background-color: #f9f9f9;
                  }

                  .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                  }

                  .table-enhanced {
                    margin-bottom: 1.5rem !important;
                    border-radius: 4px;
                    overflow: hidden;
                  }

                  .table-cell-enhanced {
                    padding: 12px !important;
                  }
                `}</style>
              </>
            )}
          </TabsContent>

          <TabsContent value="description" className="prose px-4">
            <div
              className="w-[90%] max-w-[100%]"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </TabsContent>

          <TabsContent value="specifications" className="px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold mb-4">Product Information</h3>
                <dl className="space-y-2">
                  {product.brand && (
                    <div className="flex">
                      <dt className="w-1/3 text-gray-500">Brand</dt>
                      <dd className="w-2/3">{product.brand}</dd>
                    </div>
                  )}
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
                        {product.dimensions.height} x{" "}
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
                      warrantyInformation: "1 Year Manufacturer Warranty",
                      shippingInformation: "Free shipping on orders over $50",
                      availabilityStatus:
                        productData.stock_status === "instock"
                          ? "In Stock"
                          : "Out of Stock",
                      returnPolicy: "30-day return policy",
                    });
                  } catch (err) {
                    console.error("Error refreshing product:", err);
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
                    const productData = await fetchProductById(product.id);
                    setProduct({
                      ...productData,
                      reviews: productData.reviews || [],
                      warrantyInformation: "1 Year Manufacturer Warranty",
                      shippingInformation: "Free shipping on orders over $50",
                      availabilityStatus:
                        productData.stock_status === "instock"
                          ? "In Stock"
                          : "Out of Stock",
                      returnPolicy: "30-day return policy",
                    });
                  } catch (err) {
                    console.error("Error refreshing product:", err);
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
