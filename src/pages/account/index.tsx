import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AccountNotifications } from '@/components/account/AccountNotifications';
import { AccountWishlist } from '@/components/account/AccountWishlist';
import { AccountOrders } from '@/components/account/AccountOrders';
import { AccountTracking } from '@/components/account/AccountTracking';
import { AccountDetails } from '@/components/account/AccountDetails';
import { LogOut } from 'lucide-react';
import Cookies from 'js-cookie';
import { toast } from '@/components/ui/use-toast';

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('wishlist');
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkLoginStatus();

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
  }, [navigate]);

  const checkLoginStatus = () => {
    const authToken = Cookies.get('authToken');
    const loggedIn = Cookies.get('isLoggedIn') === 'true';

    if (!authToken || !loggedIn) {
      navigate('/login');
      return;
    }

    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate('/login');
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      console.log('loggedin user');
    }
  }, [user]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.location.hash = value;
  };

  const handleSignOut = () => {
    // Clear cookies
    Cookies.remove('authToken');
    Cookies.remove('isLoggedIn');

    // Clear localStorage
    localStorage.removeItem('user');

    // Trigger storage event to update header
    window.dispatchEvent(new Event('storage'));

    toast({
      title: 'Signed Out',
      description: 'You have been successfully signed out.',
    });

    // Navigate to home page
    navigate('/');
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
          <div className='mb-8 flex justify-between items-center'>
            <div>
              <h1 className='text-2xl font-semibold text-[#0e224d]'>
                Hello {user?.fullName}
              </h1>
              <p className='text-gray-600 mt-2'>
                From your account dashboard, you can easily check & view your
                recent orders, manage your shipping and billing addresses and
                edit your password and account details.
              </p>
            </div>
            <Button
              variant='outline'
              className='flex items-center gap-2 border-red-500 text-red-500 hover:bg-red-50'
              onClick={handleSignOut}
            >
              <LogOut size={16} />
              Sign Out
            </Button>
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
