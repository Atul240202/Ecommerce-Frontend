import { Heart } from "lucide-react";
import Link from "next/link";
import { useShop } from "../../contexts/ShopContext";
interface ProductVariableCardProps {
  product: {
    id: number;
    title: string;
    thumbnail: string;
    price: number;
    minPrice?: number;
    maxPrice?: number;
    brand?: string;
  };
}

export function ProductVariableCard({ product }: ProductVariableCardProps) {
  const { addToWishlist, isInWishlist } = useShop();
  const isWishlisted = isInWishlist(product.id);

  // Format price with Indian Rupee symbol and thousands separator
  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      <div className="relative aspect-square overflow-hidden">
        <Link href={`/product/${product.id}`}>
          <img
            src={product.thumbnail || "/placeholder.svg"}
            alt={product.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </Link>
        <button
          onClick={() => addToWishlist(product)}
          className={`absolute top-2 right-2 p-1.5 rounded-full ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-white" : ""}`} />
        </button>
      </div>
      <div className="p-4">
        {product.brand && (
          <div className="text-xs text-gray-500 mb-1">{product.brand}</div>
        )}
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 h-12">
            {product.title}
          </h3>
        </Link>
        <div className="flex flex-col">
          <div className="text-blue-600 font-semibold">
            {product.minPrice && product.maxPrice
              ? `${formatPrice(product.minPrice)} – ${formatPrice(
                  product.maxPrice
                )}`
              : formatPrice(product.price)}
          </div>
          <div className="text-xs text-gray-500">(Inclusive GST)</div>
        </div>
        <div className="mt-3">
          <Link
            href={`/product/${product.id}`}
            className="w-full inline-flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Select options
          </Link>
        </div>
      </div>
    </div>
  );
}
