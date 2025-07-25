import Link from "next/link";
import { Loader2 } from "lucide-react";

interface Product {
  id: number;
  name: string;
  price: string;
  sale_price: string;
  regular_price: string;
  slug: string;
  images: Array<{ src: string }>;
  categories: Array<{ name: string }>;
}

interface SearchResultsProps {
  query: string;
  results: Product[];
  loading: boolean;
  onClose: () => void;
}

export function SearchResults({
  query,
  results,
  loading,
  onClose,
}: SearchResultsProps) {
  return (
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1 max-h-[500px] overflow-y-auto">
      {loading ? (
        <div className="p-4 text-center">
          <Loader2 className="h-5 w-5 inline-block animate-spin mr-2" />
          Searching...
        </div>
      ) : results.length > 0 ? (
        <div>
          <div className="p-2 bg-gray-50 border-b">
            <p className="text-sm font-medium">Search results for "{query}"</p>
          </div>
          <ul>
            {results.map((product) => (
              <li key={product.id} className="border-b last:border-b-0">
                <Link
                  href={`/product/${product.slug}`}
                  className="flex items-center p-3 hover:bg-gray-50"
                  onClick={onClose}
                >
                  <div className="w-20 h-20 flex-shrink-0 mr-3">
                    <img
                      src={product.images[0]?.src || "/placeholder.svg"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-lg font-medium">{product.name}</p>
                    <p className="text-md text-gray-500">
                      {product.categories.map((cat) => cat.name).join(", ")}
                    </p>
                    {product.price !== "0" && product.price !== "" && (
                      <p className="text-md font-bold">
                        Rs.{" "}
                        {product.sale_price ||
                          product.regular_price ||
                          product.price}
                      </p>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="p-4 text-center">
          <p>Search for a valid product: "{query}"</p>
        </div>
      )}
    </div>
  );
}
