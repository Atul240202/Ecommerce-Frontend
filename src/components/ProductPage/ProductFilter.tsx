import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterState {
  priceRange: [number, number];
}

interface FilterProps {
  products: any[];
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilter({ products, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 0],
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (products.length) {
      // Calculate price range
      const prices = products.map((p) => p.price);
      const min = Math.floor(Math.min(...prices) * 0.9); // 10% lower
      const max = Math.ceil(Math.max(...prices) * 1.1); // 10% higher
      setMinPrice(min);
      setMaxPrice(max);
      setFilters((prev) => ({ ...prev, priceRange: [min, max] }));
    }
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }));
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className='space-y-6'>
      <div>
        <h3 className='font-semibold mb-4'>Price Range</h3>
        <Slider
          defaultValue={[minPrice, maxPrice]}
          min={minPrice}
          max={maxPrice}
          step={1}
          onValueChange={handlePriceChange}
          className='mb-4'
        />
        <div className='flex gap-4'>
          <Input
            type='number'
            value={filters.priceRange[0]}
            onChange={(e) =>
              handlePriceChange([+e.target.value, filters.priceRange[1]])
            }
            className='w-24'
          />
          <span className='text-gray-500'>to</span>
          <Input
            type='number'
            value={filters.priceRange[1]}
            onChange={(e) =>
              handlePriceChange([filters.priceRange[0], +e.target.value])
            }
            className='w-24'
          />
        </div>
      </div>

      <Button className='w-full' onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
