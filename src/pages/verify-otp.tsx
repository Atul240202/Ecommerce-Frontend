import { MainLayout } from '@/layouts/MainLayout';
import OtpVerification from '@/components/auth/OtpVerification';
import { Breadcrumb } from '@/components/Breadcrumb';

export default function VerifyOtpPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Register', href: '/register' },
            { label: 'Verify OTP', href: '/verify-otp' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <OtpVerification />
        </div>
      </div>
    </MainLayout>
  );
}
