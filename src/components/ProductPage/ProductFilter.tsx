import { useState, useEffect } from 'react';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface FilterState {
  priceRange: [number, number];
  brands: string[];
  categories: string[];
  availability: string[];
}

interface FilterProps {
  products: any[];
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilter({ products, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 0],
    brands: [],
    categories: [],
    availability: [],
  });
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [brands, setBrands] = useState<{ name: string; count: number }[]>([]);
  const [categories, setCategories] = useState<
    { name: string; count: number }[]
  >([]);

  useEffect(() => {
    if (products.length) {
      // Calculate price range
      const prices = products.map((p) => p.price);
      const min = Math.floor(Math.min(...prices) * 0.9); // 10% lower
      const max = Math.ceil(Math.max(...prices) * 1.1); // 10% higher
      setMinPrice(min);
      setMaxPrice(max);
      setFilters((prev) => ({ ...prev, priceRange: [min, max] }));

      // Calculate unique brands with counts
      const brandCounts = products.reduce((acc, product) => {
        acc[product.brand] = (acc[product.brand] || 0) + 1;
        return acc;
      }, {});
      setBrands(
        Object.entries(brandCounts).map(([name, count]) => ({
          name,
          count: count as number,
        }))
      );

      // Calculate unique categories with counts
      const categoryCounts = products.reduce((acc, product) => {
        acc[product.category] = (acc[product.category] || 0) + 1;
        return acc;
      }, {});
      setCategories(
        Object.entries(categoryCounts).map(([name, count]) => ({
          name,
          count: count as number,
        }))
      );
    }
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }));
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      brands: checked
        ? [...prev.brands, brand]
        : prev.brands.filter((b) => b !== brand),
    }));
  };

  const handleAvailabilityChange = (status: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      availability: checked
        ? [...prev.availability, status]
        : prev.availability.filter((s) => s !== status),
    }));
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

      <div>
        <h3 className='font-semibold mb-4'>Brands</h3>
        <div className='space-y-2'>
          {brands.map(({ name, count }) => (
            <div key={name} className='flex items-center'>
              <Checkbox
                id={`brand-${name}`}
                checked={filters.brands.includes(name)}
                onCheckedChange={(checked) =>
                  handleBrandChange(name, checked as boolean)
                }
              />
              <label htmlFor={`brand-${name}`} className='ml-2 text-sm'>
                {name} ({count})
              </label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className='font-semibold mb-4'>Availability</h3>
        <div className='space-y-2'>
          {['In Stock', 'Low Stock', 'Out of Stock'].map((status) => (
            <div key={status} className='flex items-center'>
              <Checkbox
                id={`availability-${status}`}
                checked={filters.availability.includes(status)}
                onCheckedChange={(checked) =>
                  handleAvailabilityChange(status, checked as boolean)
                }
              />
              <label
                htmlFor={`availability-${status}`}
                className='ml-2 text-sm'
              >
                {status}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button className='w-full' onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
