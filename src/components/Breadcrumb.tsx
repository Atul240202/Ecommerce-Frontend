// import { Link } from 'react-router-dom';
// import { ChevronRight } from 'lucide-react';

// interface BreadcrumbProps {
//   category: string;
// }

// export function Breadcrumb({ category }: BreadcrumbProps) {
//   // Convert slug to display name
//   const displayName = category
//     .split('-')
//     .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//     .join(' ');

//   return (
//     <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
//       <Link to='/' className='hover:text-primary'>
//         Home
//       </Link>
//       <ChevronRight className='h-4 w-4' />
//       <Link to='/categories' className='hover:text-primary'>
//         Categories
//       </Link>
//       <ChevronRight className='h-4 w-4' />
//       <span className='text-gray-900 font-medium'>{displayName}</span>
//     </nav>
//   );
// }

import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav className='flex items-center space-x-2 text-sm text-gray-600 mb-6'>
      {items.map((item, index) => (
        <div key={index} className='flex items-center'>
          {index > 0 && <ChevronRight className='h-4 w-4 mx-2' />}
          {index === items.length - 1 ? (
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
