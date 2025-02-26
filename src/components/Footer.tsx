import { ShieldCheck, ShoppingBag, Lock, Plane } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Youtube } from 'lucide-react';
import logo from '../assets/logo.webp';

export function Features() {
  const features = [
    { icon: Plane, title: 'Quality Assured', subtitle: 'Always' },
    { icon: ShoppingBag, title: '100% Original', subtitle: 'Products' },
    { icon: Lock, title: 'Secure', subtitle: 'Payments' },
    { icon: ShieldCheck, title: '100% Buyer', subtitle: 'Protection' },
  ];

  return (
    <div className='flex justify-center gap-6 py-6 bg-white border-b'>
      {features.map((feature, index) => (
        <div
          key={index}
          className='flex items-center gap-3 border px-4 py-3 shadow-sm transition-all duration-300 hover:shadow-lg'
        >
          <feature.icon className='w-6 h-6 text-blue-600' />
          <div className='w-[10vw]'>
            <h4 className='font-semibold text-gray-800'>{feature.title}</h4>
            <p className='text-sm text-gray-500'>{feature.subtitle}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export function Footer() {
  return (
    <>
      <Features />
      <footer className='bg-gray-50 border-t mt-0'>
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
                At industrywaala, we are dedicated to providing our customers
                with an extensive selection of high-quality industrial goods at
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
    </>
  );
}
