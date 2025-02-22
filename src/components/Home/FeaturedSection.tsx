import { BestSellerSidebar } from './BestSellerSidebar';
import { MonthFeaturedGrid } from './MonthFeaturedGrid';

export function FeaturedSection() {
  return (
    <div className='py-12 px-12'>
      <div className='container mx-auto px-4'>
        <div className='flex gap-6'>
          <BestSellerSidebar />
          <MonthFeaturedGrid />
        </div>
      </div>
    </div>
  );
}
