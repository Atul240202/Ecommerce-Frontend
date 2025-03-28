import type React from 'react';

import { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../components/ui/tabs';
import { Plus, Trash2, Edit } from 'lucide-react';
import { toast } from '../../components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { indianStates } from '../../lib/constants';
import {
  getUserProfile,
  updateUserProfile,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
  setDefaultAddress,
} from '../../services/userService';
import Cookies from 'js-cookie';

interface Address {
  id: string;
  type: 'shipping' | 'billing';
  isDefault: boolean;
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
}

interface UserData {
  _id?: string;
  fullName: string;
  email: string;
  phone: string;
  addresses: Address[];
  subscribeToNewsletter?: boolean;
}

interface AccountDetailsProps {
  user: {
    _id: string;
    email: string;
    fullName: string;
  };
}

export function AccountDetails({ user }: AccountDetailsProps) {
  const [userData, setUserData] = useState<UserData>({
    fullName: user.fullName || '',
    email: user.email || '',
    phone: '',
    addresses: [],
    subscribeToNewsletter: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Address management
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [currentAddress, setCurrentAddress] = useState<Partial<Address> | null>(
    null
  );
  const [addressType, setAddressType] = useState<'shipping' | 'billing'>(
    'shipping'
  );
  const [isEditingAddress, setIsEditingAddress] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    const authToken = Cookies.get('authToken');
    if (!authToken) {
      setMessage({
        type: 'error',
        text: 'You must be logged in to view your profile.',
      });
      return;
    }

    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);

      // Fetch user profile data
      const userProfile = await getUserProfile();
      console.log('User profile data', userProfile);
      // Fetch user addresses
      const addresses = await getUserAddresses();

      setUserData({
        ...userProfile,
        addresses: addresses || [],
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your profile data. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (checked: boolean) => {
    setUserData((prev) => ({ ...prev, subscribeToNewsletter: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // Update user profile
      await updateUserProfile({
        fullName: userData.fullName,
        email: userData.email,
        phone: userData.phone,
        subscribeToNewsletter: userData.subscribeToNewsletter,
      });

      setMessage({
        type: 'success',
        text: 'Account details updated successfully!',
      });

      toast({
        title: 'Success',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.message || 'An error occurred while updating your account',
      });

      toast({
        title: 'Error',
        description: error.message || 'Failed to update your profile.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Address management functions
  const openAddAddressDialog = (type: 'shipping' | 'billing') => {
    setAddressType(type);
    setCurrentAddress(null);
    setIsEditingAddress(false);
    setIsAddressDialogOpen(true);
  };

  const openEditAddressDialog = (address: Address) => {
    setCurrentAddress(address);
    setAddressType(address.type);
    setIsEditingAddress(true);
    setIsAddressDialogOpen(true);
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!currentAddress) {
        throw new Error('Address data is missing');
      }

      if (isEditingAddress && currentAddress.id) {
        // Update existing address
        const { id, ...addressData } = currentAddress as Address;
        await updateUserAddress(id, {
          ...addressData,
          type: addressType,
        });

        // Refresh data to get updated addresses
        await fetchUserData();

        toast({
          title: 'Success',
          description: 'Address updated successfully.',
        });
      } else {
        // Add new address
        const newAddress = {
          ...currentAddress,
          type: addressType,
          isDefault:
            userData.addresses.filter((a) => a.type === addressType).length ===
            0, // Make default if first of its type
        };

        await addUserAddress(newAddress as Omit<Address, 'id'>);

        // Refresh data to get updated addresses
        await fetchUserData();

        toast({
          title: 'Success',
          description: 'New address added successfully.',
        });
      }

      // Close dialog
      setIsAddressDialogOpen(false);
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save address.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      await deleteUserAddress(addressId);

      // Refresh data to get updated addresses
      await fetchUserData();

      toast({
        title: 'Success',
        description: 'Address deleted successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete address.',
        variant: 'destructive',
      });
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      await setDefaultAddress(addressId);

      // Refresh data to get updated addresses
      await fetchUserData();

      toast({
        title: 'Success',
        description: 'Default address updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to set default address.',
        variant: 'destructive',
      });
    }
  };

  const handleAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    if (currentAddress) {
      setCurrentAddress({
        ...currentAddress,
        [name]: value,
      });
    } else {
      setCurrentAddress({
        type: addressType,
        isDefault: false,
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: '',
        postcode: '',
        country: 'India',
        phone: '',
        [name]: value,
      });
    }
  };

  const handleAddressStateChange = (value: string) => {
    if (currentAddress) {
      setCurrentAddress({
        ...currentAddress,
        state: value,
      });
    } else {
      setCurrentAddress({
        type: addressType,
        isDefault: false,
        firstName: '',
        lastName: '',
        address1: '',
        city: '',
        state: value,
        postcode: '',
        country: 'India',
        phone: '',
      });
    }
  };

  // Filter addresses by type
  const shippingAddresses = userData.addresses.filter(
    (addr) => addr.type === 'shipping'
  );
  const billingAddresses = userData.addresses.filter(
    (addr) => addr.type === 'billing'
  );

  // Check if token exists
  const authToken = Cookies.get('authToken') !== null;
  // const isAuthenticated = localStorage.getItem('token') !== null;

  if (!authToken) {
    return (
      <div className='text-center py-8'>
        <h2 className='text-xl font-semibold mb-4'>Authentication Required</h2>
        <p className='text-gray-600 mb-4'>
          You need to be logged in to view and manage your profile.
        </p>
        <Button onClick={() => (window.location.href = '/login')}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <div className='space-y-8'>
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

      <Tabs defaultValue='personal' className='w-full'>
        <TabsList className='mb-6'>
          <TabsTrigger value='personal'>Personal Information</TabsTrigger>
          <TabsTrigger value='addresses'>Address Book</TabsTrigger>
        </TabsList>

        <TabsContent value='personal'>
          <form onSubmit={handleSubmit} className='space-y-8'>
            <div>
              <h3 className='text-lg font-medium mb-4'>Contact Information</h3>
              <div className='space-y-4'>
                <div>
                  <Label htmlFor='fullName'>Full Name *</Label>
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
                    disabled
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

            <Button
              type='submit'
              disabled={isLoading}
              className='bg-[#4280ef] hover:bg-[#3a72d4]'
            >
              {isLoading ? 'Updating...' : 'Update Changes'}
            </Button>
          </form>
        </TabsContent>

        <TabsContent value='addresses'>
          <div className='space-y-6'>
            {/* Shipping Addresses */}
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Shipping Addresses</h3>
                <Button
                  onClick={() => openAddAddressDialog('shipping')}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' /> Add New Address
                </Button>
              </div>

              {shippingAddresses.length === 0 ? (
                <div className='text-center py-8 border rounded-md bg-gray-50'>
                  <p className='text-gray-500'>
                    You haven't added any shipping addresses yet.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {shippingAddresses.map((address) => (
                    <Card
                      key={address.id}
                      className={address.isDefault ? 'border-blue-500' : ''}
                    >
                      <CardHeader className='pb-2'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <CardTitle className='text-base'>
                              {address.firstName} {address.lastName}
                            </CardTitle>
                            {address.isDefault && (
                              <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                                Default
                              </span>
                            )}
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openEditAddressDialog(address)}
                              className='h-8 w-8'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDeleteAddress(address.id)}
                              className='h-8 w-8 text-red-500'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='text-sm space-y-1 text-gray-600'>
                          {address.companyName && <p>{address.companyName}</p>}
                          <p>{address.address1}</p>
                          {address.address2 && <p>{address.address2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postcode}
                          </p>
                          <p>{address.country}</p>
                          <p>Phone: {address.phone}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {!address.isDefault && (
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full'
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            {/* Billing Addresses */}
            <div>
              <div className='flex justify-between items-center mb-4'>
                <h3 className='text-lg font-medium'>Billing Addresses</h3>
                <Button
                  onClick={() => openAddAddressDialog('billing')}
                  variant='outline'
                  className='flex items-center gap-2'
                >
                  <Plus className='h-4 w-4' /> Add New Address
                </Button>
              </div>

              {billingAddresses.length === 0 ? (
                <div className='text-center py-8 border rounded-md bg-gray-50'>
                  <p className='text-gray-500'>
                    You haven't added any billing addresses yet.
                  </p>
                </div>
              ) : (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  {billingAddresses.map((address) => (
                    <Card
                      key={address.id}
                      className={address.isDefault ? 'border-blue-500' : ''}
                    >
                      <CardHeader className='pb-2'>
                        <div className='flex justify-between items-start'>
                          <div>
                            <CardTitle className='text-base'>
                              {address.firstName} {address.lastName}
                            </CardTitle>
                            {address.isDefault && (
                              <span className='text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full'>
                                Default
                              </span>
                            )}
                          </div>
                          <div className='flex gap-2'>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => openEditAddressDialog(address)}
                              className='h-8 w-8'
                            >
                              <Edit className='h-4 w-4' />
                            </Button>
                            <Button
                              variant='ghost'
                              size='icon'
                              onClick={() => handleDeleteAddress(address.id)}
                              className='h-8 w-8 text-red-500'
                            >
                              <Trash2 className='h-4 w-4' />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className='text-sm space-y-1 text-gray-600'>
                          {address.companyName && <p>{address.companyName}</p>}
                          <p>{address.address1}</p>
                          {address.address2 && <p>{address.address2}</p>}
                          <p>
                            {address.city}, {address.state} {address.postcode}
                          </p>
                          <p>{address.country}</p>
                          <p>Phone: {address.phone}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        {!address.isDefault && (
                          <Button
                            variant='outline'
                            size='sm'
                            className='w-full'
                            onClick={() => handleSetDefaultAddress(address.id)}
                          >
                            Set as Default
                          </Button>
                        )}
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Address Dialog */}
      <Dialog open={isAddressDialogOpen} onOpenChange={setIsAddressDialogOpen}>
        <DialogContent className='sm:max-w-[500px]'>
          <DialogHeader>
            <DialogTitle>
              {isEditingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleAddressSubmit} className='space-y-4 py-4'>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='firstName'>First Name *</Label>
                <Input
                  id='firstName'
                  name='firstName'
                  value={currentAddress?.firstName || ''}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor='lastName'>Last Name *</Label>
                <Input
                  id='lastName'
                  name='lastName'
                  value={currentAddress?.lastName || ''}
                  onChange={handleAddressChange}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor='companyName'>Company Name (Optional)</Label>
              <Input
                id='companyName'
                name='companyName'
                value={currentAddress?.companyName || ''}
                onChange={handleAddressChange}
              />
            </div>

            <div>
              <Label htmlFor='address1'>Address Line 1 *</Label>
              <Input
                id='address1'
                name='address1'
                value={currentAddress?.address1 || ''}
                onChange={handleAddressChange}
                required
              />
            </div>

            <div>
              <Label htmlFor='address2'>Address Line 2 (Optional)</Label>
              <Input
                id='address2'
                name='address2'
                value={currentAddress?.address2 || ''}
                onChange={handleAddressChange}
              />
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='city'>City *</Label>
                <Input
                  id='city'
                  name='city'
                  value={currentAddress?.city || ''}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor='state'>State *</Label>
                <Select
                  value={currentAddress?.state || ''}
                  onValueChange={handleAddressStateChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select state' />
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
            </div>

            <div className='grid grid-cols-2 gap-4'>
              <div>
                <Label htmlFor='postcode'>Postal Code *</Label>
                <Input
                  id='postcode'
                  name='postcode'
                  value={currentAddress?.postcode || ''}
                  onChange={handleAddressChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor='country'>Country *</Label>
                <Select
                  value={currentAddress?.country || 'India'}
                  onValueChange={(value) => {
                    if (currentAddress) {
                      setCurrentAddress({ ...currentAddress, country: value });
                    } else {
                      setCurrentAddress({
                        type: addressType,
                        isDefault: false,
                        firstName: '',
                        lastName: '',
                        address1: '',
                        city: '',
                        state: '',
                        postcode: '',
                        country: value,
                        phone: '',
                      });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select country' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='India'>India</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor='phone'>Phone Number *</Label>
              <Input
                id='phone'
                name='phone'
                type='tel'
                value={currentAddress?.phone || ''}
                onChange={handleAddressChange}
                required
              />
            </div>

            <DialogFooter className='pt-4'>
              <Button
                type='button'
                variant='outline'
                onClick={() => setIsAddressDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button type='submit' disabled={isLoading}>
                {isLoading
                  ? 'Saving...'
                  : isEditingAddress
                  ? 'Update Address'
                  : 'Add Address'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
