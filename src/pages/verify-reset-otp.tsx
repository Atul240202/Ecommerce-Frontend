import { MainLayout } from '@/layouts/MainLayout';
import ResetPasswordOtpVerification from '@/components/auth/ResetPasswordOtpVerification';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function VerifyResetOtpPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Login', href: '/login' },
            { label: 'Forgot Password', href: '/forgot-password' },
            { label: 'Verify OTP', href: '/verify-reset-otp' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <ResetPasswordOtpVerification />
        </div>
      </div>
    </MainLayout>
  );
}
