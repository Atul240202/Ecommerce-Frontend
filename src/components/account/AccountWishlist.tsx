import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2 } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useNavigate } from 'react-router-dom';

interface WishlistItem {
  id: number;
  title: string;
  thumbnail: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
}

export function AccountWishlist() {
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const { addToCart, removeFromWishlist } = useShop();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchWishlistItems = async () => {
      try {
        // For demo purposes, we'll fetch 5 random products
        const productIds = [1, 2, 3, 4, 5];
        const items = await Promise.all(
          productIds.map(async (id) => {
            const response = await fetch(
              `https://dummyjson.com/products/${id}`
            );
            return response.json();
          })
        );
        setWishlistItems(items);
      } catch (error) {
        console.error('Error fetching wishlist items:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistItems();
  }, []);

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlistItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id));
    }
  };

  const handleAddToCart = async (id: number) => {
    await addToCart(id, 1);
  };

  const handleRemoveFromWishlist = (id: number) => {
    removeFromWishlist(id);
    setWishlistItems((prev) => prev.filter((item) => item.id !== id));
  };

  const handleBuySelected = () => {
    // Add selected items to cart and navigate to checkout
    selectedItems.forEach((id) => {
      addToCart(id, 1);
    });
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]'></div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className='text-center py-16'>
        <h2 className='text-xl font-semibold mb-4'>Your wishlist is empty</h2>
        <p className='text-gray-600 mb-8'>
          Add items to your wishlist to save them for later.
        </p>
        <Button onClick={() => navigate('/')}>Continue Shopping</Button>
      </div>
    );
  }

  return (
    <div>
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold'>
          My Wishlist ({wishlistItems.length} items)
        </h2>
        {selectedItems.length > 0 && (
          <Button onClick={handleBuySelected}>Buy Selected Items</Button>
        )}
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-4 text-left'>
                <Checkbox
                  checked={
                    selectedItems.length === wishlistItems.length &&
                    wishlistItems.length > 0
                  }
                  onCheckedChange={handleSelectAll}
                />
              </th>
              <th className='p-4 text-left'>Product</th>
              <th className='p-4 text-left'>Price</th>
              <th className='p-4 text-left'>Stock Status</th>
              <th className='p-4 text-left'>Action</th>
              <th className='p-4 text-left'>Remove</th>
            </tr>
          </thead>
          <tbody>
            {wishlistItems.map((item) => (
              <tr key={item.id} className='border-b'>
                <td className='p-4'>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                  />
                </td>
                <td className='p-4'>
                  <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 flex-shrink-0'>
                      <img
                        src={item.thumbnail || '/placeholder.svg'}
                        alt={item.title}
                        className='h-full w-full object-cover rounded-md'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>{item.title}</h3>
                      <div className='flex items-center mt-1'>
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`w-4 h-4 ${
                              i < Math.round(item.rating)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                            xmlns='http://www.w3.org/2000/svg'
                            viewBox='0 0 20 20'
                            fill='currentColor'
                          >
                            <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                          </svg>
                        ))}
                        <span className='text-xs text-gray-500 ml-1'>
                          ({item.rating})
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className='p-4'>
                  <div className='font-semibold'>${item.price.toFixed(2)}</div>
                  {item.discountPercentage > 0 && (
                    <div className='text-sm text-green-600'>
                      Save {item.discountPercentage.toFixed(0)}%
                    </div>
                  )}
                </td>
                <td className='p-4'>
                  <span className='px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium'>
                    {item.stock > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </td>
                <td className='p-4'>
                  <Button
                    size='sm'
                    onClick={() => handleAddToCart(item.id)}
                    disabled={item.stock <= 0}
                  >
                    Add to Cart
                  </Button>
                </td>
                <td className='p-4'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveFromWishlist(item.id)}
                  >
                    <Trash2 className='h-5 w-5 text-gray-500' />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
