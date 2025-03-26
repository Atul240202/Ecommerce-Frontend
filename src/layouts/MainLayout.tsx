import type React from 'react';
import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ToastProvider } from '@/components/ui/toast';
import { Header } from '@/components/Header';
import { SubHeader } from '@/components/Home/SubHeader';
import { Footer } from '@/components/Footer';
import CategorySubheader from '../components/Home/CategorySubheader';
interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';
  const isHomePage = location.pathname === '/';
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <ToastProvider>
      <div className='min-h-screen flex flex-col'>
        <div className='fixed top-0 left-0 w-full bg-white z-50'>
          <Header />
        </div>

        <div className={`flex-1 ${isMobile ? 'mt-[120px]' : 'mt-[75px]'}`}>
          {!isLoginPage && !isRegisterPage && <SubHeader />}
          <div>{isHomePage && <CategorySubheader />}</div>

          <main className='flex-1'>{children}</main>
        </div>

        <Footer />
      </div>
    </ToastProvider>
  );
}
