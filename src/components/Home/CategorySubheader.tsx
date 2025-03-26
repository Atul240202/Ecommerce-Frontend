'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ChevronLeft } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface Subcategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CategorySubheader = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);

  useEffect(() => {
    // Fetch categories from the JSON file
    fetch('/tempData/categories.json')
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll);
      // Initial check
      checkScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', checkScroll);
      }
    };
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <nav className='relative bg-white border-b border-gray-200 z-40'>
      <div className='container mx-auto px-4 relative'>
        {/* Left scroll button - only visible when scrollable to the left */}
        {showLeftScroll && (
          <button
            onClick={scrollLeft}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1 md:p-2'
            aria-label='Scroll left'
          >
            <ChevronLeft className='h-5 w-5 text-gray-700' />
          </button>
        )}

        {/* Scrollable container for categories */}
        <div
          ref={scrollContainerRef}
          className='flex justify-between overflow-x-auto py-3 scrollbar-hide scroll-smooth'
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => (
            <div key={index} className='flex-shrink-0 relative'>
              {category.subcategories.length > 0 ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className='flex flex-col items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap bg-transparent border-0 cursor-pointer'>
                      <div className='w-12 h-12 mb-1 rounded-full overflow-hidden border border-gray-200'>
                        <img
                          src={category.icon || '/placeholder.svg'}
                          alt={category.name}
                          width={60}
                          height={60}
                          className='object-cover'
                        />
                      </div>
                      <div className='flex items-center'>
                        <span>{category.name}</span>
                        <ChevronDown className='ml-1 h-3 w-3' />
                      </div>
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='start' className='w-56 z-50'>
                    {category.subcategories.map((subcategory, subIndex) => (
                      <DropdownMenuItem key={subIndex} asChild>
                        <Link
                          href={subcategory.href}
                          className='w-full cursor-pointer'
                        >
                          {subcategory.name}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Link
                  href={category.href}
                  className='flex flex-col items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap'
                >
                  <div className='w-12 h-12 mb-1 rounded-full overflow-hidden border border-gray-200'>
                    <img
                      src={category.icon || '/placeholder.svg'}
                      alt={category.name}
                      width={60}
                      height={60}
                      className='object-cover'
                    />
                  </div>
                  <div className='flex items-center'>
                    <span>{category.name}</span>
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right scroll button - only visible when scrollable to the right */}
        {showRightScroll && (
          <button
            onClick={scrollRight}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1 md:p-2'
            aria-label='Scroll right'
          >
            <ChevronRight className='h-5 w-5 text-gray-700' />
          </button>
        )}
      </div>
    </nav>
  );
};

export default CategorySubheader;
