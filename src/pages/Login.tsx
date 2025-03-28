import { MainLayout } from '../layouts/MainLayout';
import LoginForm from '../components/auth/LoginForm';
import { Breadcrumb } from '../components/Breadcrumb';

export default function LoginPage() {
  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Login', href: '/login' },
          ]}
        />

        <div className='max-w-md mx-auto my-8'>
          <LoginForm />
        </div>
      </div>
    </MainLayout>
  );
}
