import Link from 'next/link';
import { Loader2 } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
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
    <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-md shadow-lg z-10 mt-1 max-h-96 overflow-y-auto">
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
                  href={`/product/${product.id}`}
                  className="flex items-center p-3 hover:bg-gray-50"
                  onClick={onClose}
                >
                  <div className="w-12 h-12 flex-shrink-0 mr-3">
                    <img
                      src={product.images[0]?.src || '/placeholder.svg'}
                      alt={product.name}
                      width={48}
                      height={48}
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{product.name}</p>
                    <p className="text-xs text-gray-500">
                      {product.categories.map((cat) => cat.name).join(', ')}
                    </p>
                    <p className="text-sm font-bold">Rs. {product.price}</p>
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
