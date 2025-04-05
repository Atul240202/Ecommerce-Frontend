import { useState, useEffect } from 'react';
import { Slider } from '@radix-ui/react-slider'; // ya wherever your Slider is from
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';

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
      const prices = products.map((p) => p.price);
      const min = Math.floor(Math.min(...prices) * 0.9);
      const max = Math.ceil(Math.max(...prices) * 1.1);
      setMinPrice(min);
      setMaxPrice(max);
      setFilters({ priceRange: [min, max] });
    }
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    setFilters({ priceRange: value as [number, number] });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-semibold mb-4">Price Range</h3>
        <Slider
          value={filters.priceRange}
          min={minPrice}
          max={maxPrice}
          step={1}
          onValueChange={handlePriceChange}
          className="relative flex w-full touch-none select-none items-center"
        >
          <div className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-200">
            <div
              className="absolute h-full bg-[#2D81FF]"
              style={{
                left: `${
                  ((filters.priceRange[0] - minPrice) / (maxPrice - minPrice)) *
                  100
                }%`,
                width: `${
                  ((filters.priceRange[1] - filters.priceRange[0]) /
                    (maxPrice - minPrice)) *
                  100
                }%`,
              }}
            />
          </div>
          {filters.priceRange.map((val, idx) => (
            <div
              key={idx}
              className="block h-4 w-4 rounded-full border-2 border-white bg-[#2D81FF] shadow transition-all"
              style={{
                position: 'absolute',
                left: `${((val - minPrice) / (maxPrice - minPrice)) * 100}%`,
                transform: 'translateX(-50%)',
              }}
            />
          ))}
        </Slider>

        <div className="flex gap-4 mt-4">
          <Input
            type="number"
            value={filters.priceRange[0]}
            onChange={(e) =>
              handlePriceChange([+e.target.value, filters.priceRange[1]])
            }
            className="w-24"
          />
          <span className="text-gray-500">to</span>
          <Input
            type="number"
            value={filters.priceRange[1]}
            onChange={(e) =>
              handlePriceChange([filters.priceRange[0], +e.target.value])
            }
            className="w-24"
          />
        </div>
      </div>

      <Button className="w-full bg-[#2D81FF]" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
