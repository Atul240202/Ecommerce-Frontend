import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update /category routes to /categories
  const updatedItems = items.map((item) =>
    item.href.startsWith('/category/')
      ? { ...item, href: item.href.replace('/category/', '/categories/') }
      : item
  );

  // Truncate items for mobile: Show first, last, and "..." in between
  const displayItems =
    isMobile && updatedItems.length > 3
      ? [
          updatedItems[0],
          { label: '...', href: '#' },
          updatedItems[updatedItems.length - 1],
        ]
      : updatedItems;

  return (
    <nav
      className={`flex items-center space-x-2 text-gray-600 mb-6 ${
        isMobile ? 'text-xs w-full' : 'text-sm'
      }`}
    >
      {displayItems.map((item, index) => (
        <div key={index} className='flex items-center'>
          {index > 0 && <ChevronRight className='h-4 w-4 mx-2' />}
          {item.label === '...' ? (
            <span className='text-gray-500'>...</span>
          ) : index === displayItems.length - 1 ? (
            <span className='text-gray-900 font-medium'>{item.label}</span>
          ) : (
            <Link to={item.href} className='hover:text-primary'>
              {item.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
