import { useEffect, useState } from 'react';
import { BestSellerSidebar } from './BestSellerSidebar';
import { MonthFeaturedGrid } from './MonthFeaturedGrid';

export function FeaturedSection() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return (
    <div className='py-12'>
      <div className='container mx-auto px-4'>
        <div className='flex gap-6'>
          {isMobile ? <></> : <BestSellerSidebar />}

          <MonthFeaturedGrid />
        </div>
      </div>
    </div>
  );
}
