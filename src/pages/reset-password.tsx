import { MainLayout } from '@/layouts/MainLayout';
import ResetPasswordForm from '@/components/auth/ResetPasswordForm';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function ResetPasswordPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Login', href: '/login' },
            { label: 'Forgot Password', href: '/forgot-password' },
            { label: 'Reset Password', href: '/reset-password' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <ResetPasswordForm />
        </div>
      </div>
    </MainLayout>
  );
}
