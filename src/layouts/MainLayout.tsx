import type React from 'react';
import { useLocation } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Header } from '@/components/Header';
import { SubHeader } from '@/components/Home/SubHeader';
import { Footer } from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <ToastProvider>
      <div className='min-h-screen flex flex-col'>
        <Header />
        {isHomePage && <SubHeader />}
        <main className='flex-1'>{children}</main>
        <Footer />
      </div>
    </ToastProvider>
  );
}
