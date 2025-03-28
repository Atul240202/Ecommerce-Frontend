import { MainLayout } from '../layouts/MainLayout';
import ForgotPasswordForm from '../components/auth/ForgotPasswordForm';
import { Breadcrumb } from '../components/Breadcrumb';

export default function ForgotPasswordPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Login', href: '/login' },
            { label: 'Forgot Password', href: '/forgot-password' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <ForgotPasswordForm />
        </div>
      </div>
    </MainLayout>
  );
}
