import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const categories = [
  { name: 'Power Tools', subcategories: ['Drills', 'Grinders', 'Saws'] },
  {
    name: 'Hand Tools',
    subcategories: ['Hammers', 'Screwdrivers', 'Wrenches'],
  },
  { name: 'Bearing' },
  { name: 'Lubricants' },
  { name: 'Beltings' },
  { name: 'Insulations' },
  { name: 'Electricals', subcategories: ['Wires', 'Switches', 'Breakers'] },
  { name: 'Adhesives' },
  { name: 'HVAC', subcategories: ['Air Conditioners', 'Ventilation Fans'] },
  { name: 'Abrasives' },
  { name: 'Industrial Sprays' },
  { name: 'Measuring Tools', subcategories: ['Calipers', 'Micrometers'] },
  { name: 'Painting Tools' },
  { name: 'Welding Equipments' },
  { name: 'Copper Fitting' },
  {
    name: 'Safety Equipments',
    subcategories: ['Gloves', 'Helmets', 'Safety Glasses'],
  },
];

export function SubHeader() {
  return (
    <nav className='border-b bg-white'>
      <div className='container mx-auto px-12'>
        <div className='flex items-center gap-6 text-sm'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='default' className='h-8 gap-2'>
                Shop By Categories
                <ChevronDown className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-56'>
              {categories.map((category, index) =>
                category.subcategories ? (
                  <DropdownMenuSub key={index}>
                    <DropdownMenuSubTrigger className='flex items-center w-full'>
                      {category.name}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      {category.subcategories.map((sub, subIndex) => (
                        <DropdownMenuItem key={subIndex}>
                          <Link
                            href={`/category/${category.name
                              .toLowerCase()
                              .replace(/\s+/g, '-')}/${sub
                              .toLowerCase()
                              .replace(/\s+/g, '-')}`}
                          >
                            {sub}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                ) : (
                  <DropdownMenuItem key={index}>
                    <Link
                      href={`/category/${category.name
                        .toLowerCase()
                        .replace(/\s+/g, '-')}`}
                      className='flex items-center w-full'
                    >
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link
            href='/'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Home
          </Link>
          <Link
            href='/shop-by-brand'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Shop by Brand
          </Link>
          <Link
            href='/shop-by-department'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Shop by Department
          </Link>
          <Link
            href='/top-sellers'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Top Sellers
          </Link>
          <Link
            href='/blog'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Blog
          </Link>
          <Link
            href='/about-us'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            About us
          </Link>
          <Link
            href='/contact-us'
            className='h-12 flex items-center hover:text-[#4280ef]'
          >
            Contact us
          </Link>
        </div>
      </div>
    </nav>
  );
}
