import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountNotifications } from '@/components/account/AccountNotifications';
import { AccountWishlist } from '@/components/account/AccountWishlist';
import { AccountOrders } from '@/components/account/AccountOrders';
import { AccountTracking } from '@/components/account/AccountTracking';
import { AccountDetails } from '@/components/account/AccountDetails';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        // User is signed in
        setUser({
          uid: currentUser.uid,
          email: currentUser.email,
          displayName: currentUser.displayName || 'User',
          photoURL: currentUser.photoURL,
        });
      } else {
        // User is signed out
        navigate('/login');
      }
      setLoading(false);
    });

    // Check URL hash for active tab
    const hash = window.location.hash.replace('#', '');
    if (
      hash &&
      ['notification', 'wishlist', 'orders', 'tracking', 'details'].includes(
        hash
      )
    ) {
      setActiveTab(hash);
    }

    return () => unsubscribe();
  }, [navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  if (loading) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]'>
          <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]'></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        <div className='max-w-6xl mx-auto'>
          <div className='mb-8'>
            <h1 className='text-2xl font-semibold text-[#0e224d]'>
              Hello {user?.displayName}
            </h1>
            <p className='text-gray-600 mt-2'>
              From your account dashboard, you can easily check & view your
              recent orders, manage your shipping and billing addresses and edit
              your password and account details.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className='border-b w-full justify-start mb-8'>
              <TabsTrigger value='notification'>Notification</TabsTrigger>
              <TabsTrigger value='wishlist'>Wishlist</TabsTrigger>
              <TabsTrigger value='orders'>Orders</TabsTrigger>
              <TabsTrigger value='tracking'>Order Tracking</TabsTrigger>
              <TabsTrigger value='details'>Account Details</TabsTrigger>
            </TabsList>

            <TabsContent value='notification'>
              <AccountNotifications />
            </TabsContent>

            <TabsContent value='wishlist'>
              <AccountWishlist />
            </TabsContent>

            <TabsContent value='orders'>
              <AccountOrders />
            </TabsContent>

            <TabsContent value='tracking'>
              <AccountTracking />
            </TabsContent>

            <TabsContent value='details'>
              <AccountDetails user={user} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
}
