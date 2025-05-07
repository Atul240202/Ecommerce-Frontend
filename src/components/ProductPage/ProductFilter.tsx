import { useState, useEffect } from "react";
import { Slider } from "@radix-ui/react-slider";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

interface FilterState {
  priceRange: [number, number];
  selectedCategories: string[];
}

interface FilterProps {
  products: any[];
  onFilterChange: (filters: FilterState) => void;
}

export function ProductFilter({ products, onFilterChange }: FilterProps) {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 0],
    selectedCategories: [],
  });
  const [allCategories, setAllCategories] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    if (products.length) {
      const prices = products.map((p) =>
        parseFloat(p.price || p.regular_price || "0")
      );
      const min = Math.floor(Math.min(...prices));
      const max = Math.ceil(Math.max(...prices));
      setMinPrice(min);
      setMaxPrice(max);
      setFilters((prev) => ({ ...prev, priceRange: [min, max] }));

      const categorySet = new Set<string>();
      products.forEach((p) => {
        p.categories?.forEach((c: any) => categorySet.add(c.name));
      });
      setAllCategories([...categorySet]);
    }
  }, [products]);

  const handlePriceChange = (value: number[]) => {
    setFilters({ priceRange: value as [number, number] });
  };

  const handleApplyFilters = () => {
    onFilterChange(filters);
  };

  const toggleCategory = (category: string) => {
    setFilters((prev) => {
      const alreadySelected = prev.selectedCategories.includes(category);
      return {
        ...prev,
        selectedCategories: alreadySelected
          ? prev.selectedCategories.filter((c) => c !== category)
          : [...prev.selectedCategories, category],
      };
    });
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
                position: "absolute",
                left: `${((val - minPrice) / (maxPrice - minPrice)) * 100}%`,
                transform: "translateX(-50%)",
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
      <div>
        <h3 className="font-semibold mb-4">Categories</h3>
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {allCategories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={filters.selectedCategories.includes(cat)}
                onChange={() => toggleCategory(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>
      <Button className="w-full bg-[#2D81FF]" onClick={handleApplyFilters}>
        Apply Filters
      </Button>
    </div>
  );
}
