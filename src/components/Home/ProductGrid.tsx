import { useState, useEffect } from "react";
import { ProductCardFeatured } from "./ProductCardFeatured";
import {
  fetchFeaturedProducts,
  fetchBestSellerProducts,
} from "../../services/api";
import { Button } from "../../components/ui/button";

interface ApiProduct {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  stock_status: string;
  images: Array<{ src: string }>;
  categories: Array<{ name: string }>;
  slug: string;
}

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
  description: string;
  stock: number;
  slug: string;
}

export function ProductGrid() {
  const [activeTab, setActiveTab] = useState<"featured" | "bestseller">(
    "featured"
  );
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [featured, bestSellers] = await Promise.all([
          fetchFeaturedProducts(5),
          fetchBestSellerProducts(5),
        ]);

        // Transform API data
        const transformProducts = (products: ApiProduct[]): Product[] =>
          products.map((product) => ({
            id: product.id,
            title: product.name,
            description: product.description,
            thumbnail: product.images?.[0]?.src || "/placeholder.svg",
            price: Number.parseFloat(product.price || "0"),
            regularPrice: Number.parseFloat(product.regular_price || "0"),
            salePrice: Number.parseFloat(product.sale_price || "0"),
            discountPercentage: product.on_sale
              ? ((Number.parseFloat(product.regular_price || "0") -
                  Number.parseFloat(product.sale_price || "0")) /
                  Number.parseFloat(product.regular_price || "1")) *
                100
              : 0,
            rating: Number.parseFloat(product.average_rating || "0"),
            stock: product.stock_status === "instock" ? 100 : 0,
            slug: product.slug,
          }));

        setFeaturedProducts(transformProducts(featured || []));
        setBestSellerProducts(transformProducts(bestSellers || []));
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="py-12">
      <div className="container mx-auto px-4">
        <div className="flex mb-8">
          {isMobile ? (
            <></>
          ) : (
            <h2
              className={`font-semibold text-[#1a2030] ${
                isMobile ? "text-lg" : "text-3xl"
              }`}
            >
              Buy our featured products
            </h2>
          )}

          <div
            className={`flex ml-auto  ${
              isMobile ? "w-[100%] justify-between" : "gap-8"
            }`}
          >
            <Button
              // variant={activeTab === 'featured' ? 'bg-[#2D81FF] text-white' : 'outline'}
              className={` ${
                activeTab === "featured"
                  ? "bg-[#2D81FF] text-white hover:bg-[#2D81FF]"
                  : "text-[#2D81FF] bg-white hover:bg-[#eaf2ff]"
              }`}
              onClick={() => setActiveTab("featured")}
            >
              Featured
            </Button>
            <Button
              // variant={activeTab === 'bestseller' ? 'default' : 'outline'}
              className={`  ${
                activeTab === "bestseller"
                  ? "bg-[#2D81FF] text-white hover:bg-[#2D81FF]"
                  : "text-[#2D81FF] bg-white hover:bg-[#eaf2ff]"
              }`}
              onClick={() => setActiveTab("bestseller")}
            >
              Best Seller
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8 px-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(activeTab === "featured"
              ? featuredProducts
              : bestSellerProducts
            ).map((product) => (
              <ProductCardFeatured key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
