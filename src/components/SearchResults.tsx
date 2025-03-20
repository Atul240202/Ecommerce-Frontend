import Link from 'next/link';

interface Product {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage?: number;
  brand?: string;
  category?: string;
}

interface SearchResultsProps {
  results: Product[];
  isLoading: boolean;
  searchTerm: string;
  onResultClick: () => void;
}

export function SearchResults({
  results,
  isLoading,
  searchTerm,
  onResultClick,
}: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-50 p-4 mt-1 max-h-[70vh] overflow-y-auto'>
        <div className='flex items-center justify-center py-8'>
          <div className='animate-spin rounded-full h-8 w-8 border-b-2 border-[#4280ef]'></div>
        </div>
      </div>
    );
  }

  if (results.length === 0 && searchTerm.trim() !== '') {
    return (
      <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-50 p-4 mt-1'>
        <p className='text-gray-500 text-center py-4'>
          No products found for "{searchTerm}"
        </p>
      </div>
    );
  }

  if (results.length === 0 || searchTerm.trim() === '') {
    return null;
  }

  return (
    <div className='absolute top-full left-0 right-0 bg-white shadow-lg rounded-b-md z-50 mt-1 max-h-[70vh] overflow-y-auto'>
      <div className='p-2'>
        <h3 className='text-sm font-medium text-gray-500 px-2 py-1'>
          Search Results
        </h3>
        <div className='divide-y'>
          {results.map((product) => (
            <Link
              href={`/product/${product.id}`}
              key={product.id}
              className='flex items-center p-2 hover:bg-gray-50 rounded transition-colors'
              onClick={onResultClick}
            >
              <div className='flex-shrink-0 h-12 w-12 relative'>
                <img
                  src={
                    product.thumbnail || '/placeholder.svg?height=48&width=48'
                  }
                  alt={product.title}
                  className='object-contain'
                />
              </div>
              <div className='ml-4 flex-1'>
                <p className='text-sm font-medium text-gray-900 line-clamp-1'>
                  {product.title}
                </p>
                <div className='flex items-center mt-1'>
                  <p className='text-sm font-medium text-[#4280ef]'>
                    ${product.price.toFixed(2)}
                  </p>
                  {product.discountPercentage && (
                    <p className='ml-2 text-xs text-gray-500 line-through'>
                      $
                      {(
                        (product.price * 100) /
                        (100 - product.discountPercentage)
                      ).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
        <div className='p-2 border-t'>
          <Link
            href={`/search?q=${encodeURIComponent(searchTerm)}`}
            className='text-[#4280ef] text-sm font-medium hover:underline flex items-center justify-center'
            onClick={onResultClick}
          >
            View all results
            <svg
              className='h-4 w-4 ml-1'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M9 5l7 7-7 7'
              />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
