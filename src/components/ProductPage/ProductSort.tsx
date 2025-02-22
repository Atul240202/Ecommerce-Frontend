import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SortOption {
  label: string;
  value: string;
}

const sortOptions: SortOption[] = [
  { label: 'Name (A - Z)', value: 'name-asc' },
  { label: 'Price (Low to High)', value: 'price-asc' },
  { label: 'Price (High to Low)', value: 'price-desc' },
  { label: 'Rating (High to Low)', value: 'rating-desc' },
  { label: 'Discount (High to Low)', value: 'discount-desc' },
];

interface ProductSortProps {
  onSortChange: (value: string) => void;
}

export function ProductSort({ onSortChange }: ProductSortProps) {
  return (
    <div className='flex items-center justify-between py-4'>
      <Select onValueChange={onSortChange}>
        <SelectTrigger className='w-[200px]'>
          <SelectValue placeholder='Sort by' />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
