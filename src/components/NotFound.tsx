import { MainLayout } from '../layouts/MainLayout';
import { AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export function NotFound() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-16'>
        <div className='max-w-md mx-auto text-center'>
          <AlertCircle className='mx-auto h-24 w-24 text-red-500 mb-8' />
          <h1 className='text-3xl font-bold text-gray-900 mb-4'>
            Page Not Found
          </h1>
          <p className='text-gray-600 mb-8'>
            We're sorry, the page you requested could not be found. Please check
            the URL or try navigating back to the homepage.
          </p>
          <Link to='/'>
            <Button size='lg'>Go to Homepage</Button>
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
