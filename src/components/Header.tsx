import Image from 'next/image';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import logo from '../assets/logo.webp';

export function Header() {
  return (
    <header className='border-b'>
      <div className='container mx-auto px-12 py-4'>
        <div className='flex items-center justify-between'>
          <Link href='/' className='flex-shrink-0'>
            <img
              src={logo}
              alt='Industrywaala Logo'
              width={180}
              height={40}
              className='h-10 w-auto'
            />
          </Link>
          <div className='flex-1 max-w-xl mx-4 hidden md:block'>
            <div className='relative'>
              <Input
                type='search'
                placeholder='Search for items'
                className='w-full pl-4 pr-10'
              />
              <button className='absolute right-3 top-1/2 -translate-y-1/2'>
                <svg
                  className='h-5 w-5 text-gray-400'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className='flex items-center gap-4'>
            <Link href='/wishlist' className='flex items-center gap-1'>
              <span className='relative'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                  />
                </svg>
                <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center'>
                  0
                </span>
              </span>
              <span className='hidden md:inline'>Wishlist</span>
            </Link>
            <Link href='/cart' className='flex items-center gap-1'>
              <span className='relative'>
                <svg
                  className='h-6 w-6'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                  />
                </svg>
                <span className='absolute -top-1 -right-1 h-4 w-4 rounded-full bg-[#4280ef] text-[10px] font-medium text-white flex items-center justify-center'>
                  0
                </span>
              </span>
              <span className='hidden md:inline'>Cart</span>
            </Link>
            <Link href='/account' className='flex items-center gap-1'>
              <svg
                className='h-6 w-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z'
                />
              </svg>
              <span className='hidden md:inline'>Account</span>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
