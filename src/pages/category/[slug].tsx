import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { MainLayout } from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ProductCardFeatured } from "../../components/Home/ProductCardFeatured";
import { ProductFilter } from "../../components/ProductPage/ProductFilter";
import { ProductSort } from "../../components/ProductPage/ProductSort";
import {
  fetchProducts,
  fetchProductsByCategory,
  type Product,
} from "../../services/api";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLocation } from "react-router-dom";

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get("q");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, [slug]); // Re-run when the product ID changes
  useEffect(() => {
    if (!slug) return;

    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        let data;
        if (slug === "search" && query) {
          data = await fetchProducts(currentPage, 50, query);
        } else {
          data = await fetchProductsByCategory(slug, currentPage);
        }
        setProducts(data.products);
        setFilteredProducts(data.products);
        setTotalPages(data.pages);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [slug, currentPage]);

  const handleFilterChange = (filters: any) => {
    // Apply filters to products
    const filtered = products.filter((product) => {
      // Price filter
      if (filters.priceRange) {
        const productPrice = Number.parseFloat(product.price);
        if (
          productPrice < filters.priceRange[0] ||
          productPrice > filters.priceRange[1]
        ) {
          return false;
        }
      }

      return true;
    });

    setFilteredProducts(filtered);
  };

  const handleSortChange = (sortOption: string) => {
    // Sort filtered products
    const sorted = [...filteredProducts].sort((a, b) => {
      switch (sortOption) {
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "price-asc":
          return Number.parseFloat(a.price) - Number.parseFloat(b.price);
        case "price-desc":
          return Number.parseFloat(b.price) - Number.parseFloat(a.price);
        case "rating-desc":
          return (
            Number.parseFloat(b.average_rating) -
            Number.parseFloat(a.average_rating)
          );
        default:
          return 0;
      }
    });

    setFilteredProducts(sorted);
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;

    // Always show first page
    items.push(
      <button
        key={1}
        onClick={() => setCurrentPage(1)}
        className={`w-10 h-10 flex items-center justify-center border ${
          currentPage === 1
            ? "bg-[#4280ef] text-white"
            : "bg-white text-gray-700"
        }`}
      >
        1
      </button>
    );

    // Calculate start and end of pagination range
    let startPage = Math.max(2, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages - 1, startPage + maxVisiblePages - 3);

    if (endPage - startPage < maxVisiblePages - 3) {
      startPage = Math.max(2, endPage - (maxVisiblePages - 3) + 1);
    }

    // Add ellipsis after first page if needed
    if (startPage > 2) {
      items.push(
        <span
          key="ellipsis-1"
          className="w-10 h-10 flex items-center justify-center"
        >
          ...
        </span>
      );
    }

    // Add pages in the middle
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`w-10 h-10 flex items-center justify-center border ${
            currentPage === i
              ? "bg-[#4280ef] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {i}
        </button>
      );
    }

    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      items.push(
        <span
          key="ellipsis-2"
          className="w-10 h-10 flex items-center justify-center"
        >
          ...
        </span>
      );
    }

    // Always show last page if there's more than one page
    if (totalPages > 1) {
      items.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`w-10 h-10 flex items-center justify-center border ${
            currentPage === totalPages
              ? "bg-[#4280ef] text-white"
              : "bg-white text-gray-700"
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return items;
  };

  // Format category name for display
  const formatCategoryName = (slug: string) => {
    if (slug === "all") return "All Products";
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]"></div>
          </div>
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

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Categories", href: "/categories" },
            { label: formatCategoryName(slug || ""), href: "#" },
          ]}
        />
        {/* 
        <h1 className='text-3xl font-bold mb-8'>
          {slug === "search" && query ? `Search results for "${query}"` : formatCategoryName(slug || '')}

        </h1> */}

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No products found in this category.
            </p>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4">
              <ProductFilter
                products={products}
                onFilterChange={handleFilterChange}
              />
            </div>
            <div className="w-full md:w-3/4">
              <ProductSort onSortChange={handleSortChange} />

              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCardFeatured
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.name,
                      brand: product.name,
                      description: product.description,
                      thumbnail: product.images[0]?.src || "/placeholder.svg",
                      price:
                        Number.parseFloat(
                          product.regular_price || product.price
                        ) || 0,
                      regularPrice:
                        Number.parseFloat(
                          product.regular_price || product.price
                        ) || 0,
                      salePrice: product.on_sale
                        ? Number.parseFloat(product.sale_price)
                        : 0,
                      discountPercentage: product.on_sale
                        ? Math.round(
                            ((Number.parseFloat(product.regular_price) -
                              Number.parseFloat(product.sale_price)) /
                              Number.parseFloat(product.regular_price)) *
                              100
                          )
                        : 0,
                      rating: Number.parseFloat(product.average_rating),
                      stock: product.stock_status === "instock" ? 100 : 0,
                      slug: product.slug,
                      type: product.type,
                      variations:
                        product.variations?.map((variation) => variation.id) ||
                        [],
                    }}
                  />
                ))}
              </div>

              {/* Updated Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <div className="flex border rounded-md overflow-hidden">
                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.max(prev - 1, 1))
                      }
                      disabled={currentPage === 1}
                      className="px-4 py-2 border-r flex items-center justify-center disabled:opacity-50 bg-white"
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </button>

                    {getPaginationItems()}

                    <button
                      onClick={() =>
                        setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                      }
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border-l flex items-center justify-center disabled:opacity-50 bg-white"
                    >
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
