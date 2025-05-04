import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainLayout } from "../layouts/MainLayout";
import { Breadcrumb } from "../components/Breadcrumb";

interface Brand {
  name: string;
  image: string;
  keyword: string;
  banner: string;
}

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch("/tempData/brand.json");
        if (!response.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data = await response.json();
        console.log("Brand data", data);
        setBrands(data);
      } catch (err) {
        console.error("Error fetching brands:", err);
        setError("Failed to load brands. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, []);

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

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
            { label: "Shop by Brand", href: "#" },
          ]}
        />

        <div className="mb-8">
          <h1 className="text-3xl font-bold">Shop by Brand</h1>
          <p className="text-gray-600 mt-2">
            Explore our collection of premium brands and find the perfect
            products for your needs.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand) => (
            <Link
              key={brand.keyword}
              to={`/brand/${brand.keyword}`}
              className="block transition-transform hover:scale-105"
            >
              <div className="bg-white rounded-lg shadow-md p-6 h-40 flex items-center justify-center">
                <img
                  src={brand.image}
                  alt={`${brand.name} logo`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
