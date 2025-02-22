import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '../assets/logo.webp';

export function Footer() {
  return (
    <footer className='bg-gray-50 border-t'>
      <div className='container mx-auto px-16 py-12'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
          <div className='space-y-4'>
            <img
              src={logo}
              alt='Industrywaala Logo'
              width={240}
              height={60}
              className='h-14 w-auto'
            />
            <p className='text-sm text-gray-600 max-w-xs'>
              At industrywaala, we are dedicated to providing our customers with
              an extensive selection of high-quality industrial goods at
              wholesale prices.
            </p>
            <div className='flex gap-4'>
              <Link href='#' className='text-gray-600 hover:text-[#4280ef]'>
                <Facebook className='h-5 w-5' />
              </Link>
              <Link href='#' className='text-gray-600 hover:text-[#4280ef]'>
                <Instagram className='h-5 w-5' />
              </Link>
              <Link href='#' className='text-gray-600 hover:text-[#4280ef]'>
                <Youtube className='h-5 w-5' />
              </Link>
            </div>
          </div>
          {/* Add other footer sections here */}
        </div>
      </div>
      <div className='border-t'>
        <div className='container mx-auto px-4 py-4'>
          <p className='text-sm text-center text-gray-600'>
            COPYRIGHT Saratech | ALL RIGHTS RESERVED
          </p>
        </div>
      </div>
    </footer>
  );
}
