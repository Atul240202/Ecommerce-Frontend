import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, ShoppingCart, Loader2 } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { toast } from '@/components/ui/use-toast';

export function AccountWishlist() {
  const {
    wishlist,
    isWishlistLoading,
    fetchWishlist,
    removeFromWishlist,
    addToCart,
  } = useShop();
  const navigate = useNavigate();
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [isAddingToCart, setIsAddingToCart] = useState<Record<number, boolean>>(
    {}
  );
  const [isRemovingItem, setIsRemovingItem] = useState<Record<number, boolean>>(
    {}
  );

  useEffect(() => {
    fetchWishlist();
  }, []);

  const handleSelectItem = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedItems.length === wishlist.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(wishlist.map((item) => item.productId));
    }
  };

  const handleAddToCart = async (productId: number, productName: string) => {
    setIsAddingToCart((prev) => ({ ...prev, [productId]: true }));
    try {
      await addToCart(productId, 1, productName);
      // Note: We don't need to manually remove from wishlist here anymore
      // as the updated ShopContext will handle this automatically
    } finally {
      setIsAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleRemoveFromWishlist = async (productId: number) => {
    setIsRemovingItem((prev) => ({ ...prev, [productId]: true }));
    try {
      await removeFromWishlist(productId);
    } finally {
      setIsRemovingItem((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const handleBuySelected = async () => {
    if (selectedItems.length === 0) {
      toast({
        title: 'No items selected',
        description: 'Please select items to add to cart',
        variant: 'destructive',
      });
      return;
    }

    // Add selected items to cart one by one
    for (const id of selectedItems) {
      const item = wishlist.find((item) => item.productId === id);
      if (item) {
        await handleAddToCart(id, item.name);
      }
    }

    // Clear selection after adding to cart
    setSelectedItems([]);
  };

  if (isWishlistLoading) {
    return (
      <div className='flex justify-center items-center h-64'>
        <Loader2 className='h-12 w-12 animate-spin text-blue-500' />
      </div>
    );
  }

  if (wishlist.length === 0) {
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
          My Wishlist ({wishlist.length} items)
        </h2>
        {selectedItems.length > 0 && (
          <Button onClick={handleBuySelected}>
            <ShoppingCart className='mr-2 h-4 w-4' />
            Add Selected to Cart
          </Button>
        )}
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full border-collapse'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='p-4 text-left'>
                <Checkbox
                  checked={
                    selectedItems.length === wishlist.length &&
                    wishlist.length > 0
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
            {wishlist.map((item) => (
              <tr key={item.productId} className='border-b'>
                <td className='p-4'>
                  <Checkbox
                    checked={selectedItems.includes(item.productId)}
                    onCheckedChange={() => handleSelectItem(item.productId)}
                  />
                </td>
                <td className='p-4'>
                  <div className='flex items-center gap-4'>
                    <div className='relative w-16 h-16 flex-shrink-0'>
                      <img
                        src={item.image || '/placeholder.svg'}
                        alt={item.name}
                        className='w-full h-full object-cover rounded-md'
                      />
                    </div>
                    <div>
                      <h3 className='font-medium'>{item.name}</h3>
                      <div className='text-xs text-gray-500 mt-1'>
                        Added on {new Date(item.addedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </td>
                <td className='p-4'>
                  <div className='font-semibold'>₹{item.price.toFixed(2)}</div>
                </td>
                <td className='p-4'>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      item.stock_status === 'instock'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {item.stock_status === 'instock'
                      ? 'In Stock'
                      : 'Out of Stock'}
                  </span>
                </td>
                <td className='p-4'>
                  <Button
                    size='sm'
                    onClick={() => handleAddToCart(item.productId, item.name)}
                    disabled={
                      item.stock_status !== 'instock' ||
                      isAddingToCart[item.productId]
                    }
                  >
                    {isAddingToCart[item.productId] ? (
                      <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    ) : (
                      <ShoppingCart className='mr-2 h-4 w-4' />
                    )}
                    Add to Cart
                  </Button>
                </td>
                <td className='p-4'>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => handleRemoveFromWishlist(item.productId)}
                    disabled={isRemovingItem[item.productId]}
                  >
                    {isRemovingItem[item.productId] ? (
                      <Loader2 className='h-5 w-5 animate-spin text-red-500' />
                    ) : (
                      <Trash2 className='h-5 w-5 text-red-500' />
                    )}
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
