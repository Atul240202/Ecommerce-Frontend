import { Header } from '@/components/Header';
import { SubHeader } from '@/components/Home/SubHeader';
import { Footer } from '@/components/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <SubHeader />
      <main className='flex-1'>{children}</main>
      <Footer />
    </div>
  );
}
