import { MainLayout } from '../layouts/MainLayout';
import RegisterForm from '../components/auth/RegisterForm';
import { Breadcrumb } from '../components/Breadcrumb';

export default function RegisterPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Register', href: '/register' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <RegisterForm />
        </div>
      </div>
    </MainLayout>
  );
}
