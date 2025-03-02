import type React from 'react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { indianStates } from '@/lib/constants';

interface UserData {
  createdAt: string;
  email: string;
  fullName: string;
  phone: string;
  username?: string;
  shippingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    companyName?: string;
    phone?: string;
  };
  subscribeToNewsletter?: boolean;
}

interface AccountDetailsProps {
  user: {
    uid: string;
    email: string;
    displayName: string;
    photoURL: string | null;
  };
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const [userData, setUserData] = useState<UserData>({
    createdAt: '',
    email: user.email || '',
    fullName: user.displayName || '',
    phone: '',
    username: '',
    shippingAddress: {
      firstName: '',
      lastName: '',
      address1: '',
      address2: '',
      city: '',
      state: '',
      postcode: '',
      country: 'India',
      companyName: '',
      phone: '',
    },
    subscribeToNewsletter: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const auth = getAuth();
        const db = getFirestore();

        if (auth.currentUser) {
          const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));

          if (userDoc.exists()) {
            const data = userDoc.data() as UserData;
            setUserData((prev) => ({
              ...prev,
              ...data,
              shippingAddress: {
                ...prev.shippingAddress,
                ...data.shippingAddress,
              },
            }));

            // If the user has a shipping address, split the fullName into firstName and lastName
            if (data.fullName && !data.shippingAddress?.firstName) {
              const nameParts = data.fullName.split(' ');
              const firstName = nameParts[0] || '';
              const lastName = nameParts.slice(1).join(' ') || '';

              setUserData((prev) => ({
                ...prev,
                shippingAddress: {
                  ...prev.shippingAddress,
                  firstName,
                  lastName,
                  phone: data.phone,
                },
              }));
            }
          }
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (name.startsWith('shipping.')) {
      const shippingField = name.replace('shipping.', '');
      setUserData((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [shippingField]: value,
        },
      }));
    } else {
      setUserData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleCheckboxChange = (checked: boolean) => {
    setUserData((prev) => ({ ...prev, subscribeToNewsletter: checked }));
  };

  const handleStateChange = (value: string) => {
    setUserData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        state: value,
      },
    }));
  };

  const handleSetAsDefault = () => {
    setIsDefault(true);
    // In a real app, you would update the user's default shipping address in the database
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const auth = getAuth();
      const db = getFirestore();

      if (!auth.currentUser) {
        throw new Error('User not authenticated');
      }

      // Update user data in Firestore
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        username: userData.username,
        shippingAddress: userData.shippingAddress,
        subscribeToNewsletter: userData.subscribeToNewsletter,
      });

      setMessage({
        type: 'success',
        text: 'Account details updated successfully!',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Split the full name for display purposes
  const nameParts = userData.fullName?.split(' ') || [];
  const firstName = nameParts[0] || '';
  const lastName = nameParts.slice(1).join(' ') || '';

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
      <div className='md:col-span-2'>
        {message.text && (
          <div
            className={`p-4 mb-6 rounded-md ${
              message.type === 'success'
                ? 'bg-green-100 text-green-800'
                : 'bg-red-100 text-red-800'
            }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className='space-y-8'>
          <div>
            <h3 className='text-lg font-medium mb-4'>Contact Information</h3>
            <div className='space-y-4'>
              <div>
                <Label htmlFor='fullName'>Fullname *</Label>
                <Input
                  id='fullName'
                  name='fullName'
                  value={userData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='phone'>Phone Number *</Label>
                <Input
                  id='phone'
                  name='phone'
                  type='tel'
                  value={userData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='email'>Email *</Label>
                <Input
                  id='email'
                  name='email'
                  type='email'
                  value={userData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='flex items-center space-x-2'>
                <Checkbox
                  id='newsletter'
                  checked={userData.subscribeToNewsletter}
                  onCheckedChange={handleCheckboxChange}
                />
                <Label htmlFor='newsletter' className='text-sm font-normal'>
                  Keep me up to date on news and exclusive offers
                </Label>
              </div>
            </div>
          </div>

          <div>
            <h3 className='text-lg font-medium mb-4'>Shipping address</h3>
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='shipping.firstName'>First name*</Label>
                <Input
                  id='shipping.firstName'
                  name='shipping.firstName'
                  value={userData.shippingAddress?.firstName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='shipping.lastName'>Last name*</Label>
                <Input
                  id='shipping.lastName'
                  name='shipping.lastName'
                  value={userData.shippingAddress?.lastName || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='shipping.address1'>Address 1*</Label>
                <Input
                  id='shipping.address1'
                  name='shipping.address1'
                  value={userData.shippingAddress?.address1 || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='shipping.address2'>Address 2</Label>
                <Input
                  id='shipping.address2'
                  name='shipping.address2'
                  value={userData.shippingAddress?.address2 || ''}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor='shipping.state'>State*</Label>
                <Select
                  value={userData.shippingAddress?.state || ''}
                  onValueChange={handleStateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select an option...' />
                  </SelectTrigger>
                  <SelectContent>
                    {indianStates.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor='shipping.city'>City*</Label>
                <Input
                  id='shipping.city'
                  name='shipping.city'
                  value={userData.shippingAddress?.city || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='shipping.postcode'>Postcode / ZIP*</Label>
                <Input
                  id='shipping.postcode'
                  name='shipping.postcode'
                  value={userData.shippingAddress?.postcode || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              <div>
                <Label htmlFor='shipping.companyName'>Company name</Label>
                <Input
                  id='shipping.companyName'
                  name='shipping.companyName'
                  value={userData.shippingAddress?.companyName || ''}
                  onChange={handleChange}
                />
              </div>

              <div>
                <Label htmlFor='shipping.phone'>Phone*</Label>
                <Input
                  id='shipping.phone'
                  name='shipping.phone'
                  value={
                    userData.shippingAddress?.phone || userData.phone || ''
                  }
                  onChange={handleChange}
                  required
                />
              </div>

              <div className='md:col-span-2'>
                <Label htmlFor='additionalInfo'>Additional Information</Label>
                <Textarea
                  id='additionalInfo'
                  name='additionalInfo'
                  placeholder='Notes about your order, e.g. special delivery instructions'
                  className='min-h-[100px]'
                />
              </div>
            </div>
          </div>

          <Button
            type='submit'
            disabled={isLoading}
            className='bg-[#4280ef] hover:bg-[#3a72d4]'
          >
            {isLoading ? 'Saving...' : 'Save Change'}
          </Button>
        </form>
      </div>

      <div className='bg-gray-50 p-6 rounded-lg h-fit'>
        <h3 className='text-xl font-semibold mb-4'>{userData.fullName}</h3>

        {userData.shippingAddress?.address1 && (
          <>
            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Home Address:</h4>
              <p className='text-gray-700'>
                {userData.shippingAddress.address1}
                <br />
                {userData.shippingAddress.address2 && (
                  <>
                    {userData.shippingAddress.address2}
                    <br />
                  </>
                )}
                {userData.shippingAddress.city},{' '}
                {userData.shippingAddress.state}{' '}
                {userData.shippingAddress.postcode}
                <br />
                {userData.shippingAddress.country}
              </p>
            </div>

            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Delivery address:</h4>
              <p className='text-gray-700'>
                {userData.shippingAddress.address1}
                <br />
                {userData.shippingAddress.address2 && (
                  <>
                    {userData.shippingAddress.address2}
                    <br />
                  </>
                )}
                {userData.shippingAddress.city},{' '}
                {userData.shippingAddress.state}{' '}
                {userData.shippingAddress.postcode}
                <br />
                {userData.shippingAddress.country}
              </p>
            </div>

            <div className='mb-6'>
              <h4 className='font-medium mb-2'>Phone Number:</h4>
              <p className='text-gray-700'>(+91) {userData.phone}</p>
            </div>

            {!isDefault && (
              <Button
                variant='outline'
                onClick={handleSetAsDefault}
                className='w-full'
              >
                Set as Default
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
