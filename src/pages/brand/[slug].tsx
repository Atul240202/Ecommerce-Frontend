import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { searchBrandedProducts } from "../../services/api";
import { MainLayout } from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { ProductCardFeatured } from "../../components/Home/ProductCardFeatured";
import { ProductFilter } from "../../components/ProductPage/ProductFilter";
import { ProductSort } from "../../components/ProductPage/ProductSort";
import { ChevronLeft, ChevronRight, Filter, X } from "lucide-react";
import { Button } from "../../components/ui/button";

interface Brand {
  name: string;
  image: string;
  keyword: string;
  banner: string;
}

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [brand, setBrand] = useState<Brand | null>(null);
  const [filterOpen, setFilterOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch brand info
  useEffect(() => {
    const fetchBrandInfo = async () => {
      try {
        const response = await fetch("/tempData/brand.json");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }
        const brands = await response.json();
        const brand = brands.find((b: Brand) => b.keyword === slug);
        if (brand) {
          setBrand(brand);
          document.title = `${brand.name} Products | IndustryWaala`;
        } else {
          navigate("/brand");
        }
      } catch (err) {
        console.error("Error fetching brand info:", err);
        navigate("/brand");
      }
    };

    if (slug) {
      fetchBrandInfo();
    }
  }, [slug, navigate]);

  // Fetch products by brand keyword
  useEffect(() => {
    if (!slug) return;

    const getProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await searchBrandedProducts(slug, currentPage, 50);
        setProducts(data.products || []);
        setFilteredProducts(data.products || []);
        setTotalPages(data.pages || 1);
      } catch (err) {
        console.error("Failed to fetch products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, [slug, currentPage]);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts or page changes
    window.scrollTo(0, 0);
  }, [slug, currentPage]);

  const handleFilterChange = (filters: any) => {
    const filtered = products.filter((product) => {
      const price = parseFloat(product.price || product.regular_price || "0");
      const categoryNames = product.categories?.map((c: any) => c.name) || [];

      const priceMatch =
        price >= filters.priceRange[0] && price <= filters.priceRange[1];

      const categoryMatch =
        filters.selectedCategories.length === 0 ||
        filters.selectedCategories.some((cat: string) =>
          categoryNames.includes(cat)
        );

      return priceMatch && categoryMatch;
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

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Brands", href: "/brand" },
            { label: brand?.name || slug || "", href: "#" },
          ]}
        />

        {/* Mobile filter toggle */}
        <div className="md:hidden flex justify-between items-center mb-4">
          <Button variant="outline" onClick={toggleFilter}>
            {filterOpen ? (
              <>
                <X className="h-4 w-4 mr-2" /> Close Filters
              </>
            ) : (
              <>
                <Filter className="h-4 w-4 mr-2" /> Filters
              </>
            )}
          </Button>
          <ProductSort onSortChange={handleSortChange} />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-600">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-[#4280ef] text-white rounded-md hover:bg-[#3270df]"
            >
              Try Again
            </button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">
              No products found for this brand.
            </p>
            <Button className="mt-4" onClick={() => navigate("/brand")}>
              Browse All Brands
            </Button>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar filter - mobile */}
            <div
              className={`md:hidden fixed inset-0 z-50 bg-white transform ${
                filterOpen ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out overflow-y-auto`}
            >
              <div className="p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <Button variant="ghost" size="sm" onClick={toggleFilter}>
                    <X className="h-6 w-6" />
                  </Button>
                </div>
                <ProductFilter
                  products={products}
                  onFilterChange={handleFilterChange}
                />
              </div>
            </div>

            {/* Sidebar filter - desktop */}
            <div className="hidden md:block w-full md:w-1/4">
              <ProductFilter
                products={products}
                onFilterChange={handleFilterChange}
              />
            </div>

            <div className="w-full md:w-3/4">
              <div>
                <img src={brand?.banner} />
              </div>
              {/* Desktop sort */}
              <div className="hidden md:flex justify-end mb-4">
                <ProductSort onSortChange={handleSortChange} />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCardFeatured
                    key={product.id}
                    product={{
                      id: product.id,
                      title: product.name,
                      description: product.description,
                      brand: product.brand || "",
                      thumbnail: product.images?.[0]?.src || "/placeholder.svg",
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
                    }}
                  />
                ))}
              </div>

              {/* Pagination */}
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

                    {!isMobile && getPaginationItems()}

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
