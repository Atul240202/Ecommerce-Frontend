import type React from 'react';
import { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { LoginModal } from '@/components/LoginModal';
import { OrderConfirmation } from '../components/OrderConfirmation';
import { useCheckout } from '@/contexts/CheckoutContext';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  street: string;
  apartment?: string;
  country: string;
  state: string;
  postcode: string;
  city: string;
  phone: string;
}

interface FormErrors {
  [key: string]: boolean;
}

const indianStates = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  // Union Territories
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi',
  'Jammu and Kashmir',
  'Ladakh',
  'Lakshadweep',
  'Puducherry',
];

export default function CheckoutPage() {
  const { products, updateQuantity, subtotal, shipping, total } = useCheckout();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [address, setAddress] = useState<UserAddress>({
    id: '',
    firstName: '',
    lastName: '',
    street: '',
    country: 'India',
    state: '',
    postcode: '',
    city: '',
    phone: '',
  });
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'phonepe' | 'cod'>(
    'phonepe'
  );
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [billingAddress, setBillingAddress] = useState<UserAddress>({
    id: '',
    firstName: '',
    lastName: '',
    street: '',
    country: 'India',
    state: '',
    postcode: '',
    city: '',
    phone: '',
  });
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [checkoutStep, setCheckoutStep] = useState<
    'shipping' | 'payment' | 'billing'
  >('shipping');
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    const authToken = Cookies.get('authToken');
    const loggedIn = Cookies.get('isLoggedIn') === 'true';
    setIsLoggedIn(authToken != null && loggedIn);

    if (authToken && loggedIn) {
      fetchUserAddresses();
    }
  };

  const fetchUserAddresses = async () => {
    // TODO: Fetch user addresses from API
    // For now, we'll use dummy data
    const dummyAddresses: UserAddress[] = [
      {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        street: '123 Main St',
        country: 'India',
        state: 'Uttar Pradesh',
        postcode: '201301',
        city: 'Noida',
        phone: '+91 1234567890',
      },
      {
        id: '2',
        firstName: 'Jane',
        lastName: 'Doe',
        street: '456 Elm St',
        country: 'India',
        state: 'Delhi',
        postcode: '110001',
        city: 'New Delhi',
        phone: '+91 9876543210',
      },
    ];
    setSavedAddresses(dummyAddresses);
  };

  const handleQuantityChange = (productId: number, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const newQuantity = Math.max(1, product.quantity + change);
      updateQuantity(productId, newQuantity);
    }
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    const selectedAddress = savedAddresses.find(
      (addr) => addr.id === addressId
    );
    if (selectedAddress) {
      setAddress(selectedAddress);
    }
  };

  const validateForm = (formType: 'shipping' | 'billing') => {
    const errors: FormErrors = {};
    const requiredFields = [
      'firstName',
      'lastName',
      'street',
      'country',
      'state',
      'city',
      'postcode',
      'phone',
    ];

    if (formType === 'shipping') {
      requiredFields.forEach((field) => {
        if (!address[field as keyof UserAddress]) {
          errors[field] = true;
        }
      });
    } else if (formType === 'billing' && !useSameAddress && billingAddress) {
      requiredFields.forEach((field) => {
        if (!billingAddress[field as keyof UserAddress]) {
          errors[`billing_${field}`] = true;
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (validateForm('shipping')) {
      setCheckoutStep('payment');
      setShowPaymentOptions(true);
      setValidationError(null);
    } else {
      setValidationError(
        'Please fill all the mandatory fields in shipping address.'
      );
    }
  };

  const handleSaveBillingAddress = () => {
    if (useSameAddress || validateForm('billing')) {
      setCheckoutStep('billing');
      setValidationError(null);
    } else {
      setValidationError(
        'Please fill all the mandatory fields in billing address.'
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (checkoutStep !== 'billing') {
      setValidationError(
        'Please complete all steps before placing your order.'
      );
      return;
    }

    if (!acceptTerms) {
      setValidationError('Please accept the terms and conditions.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // TODO: Replace with actual API call
      setOrderNumber('ORD' + Math.floor(Math.random() * 1000000));
      setOrderConfirmed(true);
    } catch (error) {
      console.error('Error submitting order:', error);
      // Show error message to user
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    checkLoginStatus();
  };

  if (orderConfirmed) {
    return (
      <MainLayout>
        <OrderConfirmation
          orderNumber={orderNumber}
          orderDetails={{
            items: products,
            subtotal,
            shipping,
            total,
          }}
        />
      </MainLayout>
    );
  }

  if (products.length === 0) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16'>
          <div className='max-w-md mx-auto text-center'>
            <h1 className='text-2xl font-semibold mb-4'>
              Your checkout is empty
            </h1>
            <p className='text-gray-600 mb-8'>
              Add some products to proceed with checkout.
            </p>
            <Link to='/'>
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const handleBillingAddressSelect = (addressId: string) => {
    const selectedAddress = savedAddresses.find(
      (addr) => addr.id === addressId
    );
    if (selectedAddress) {
      setBillingAddress(selectedAddress);
    }
  };

  return (
    <MainLayout>
      <div className='container mx-auto px-4 py-8'>
        {isSubmitting && (
          <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-white p-6 rounded-lg flex items-center gap-4'>
              <Loader2 className='h-6 w-6 animate-spin' />
              <span>Processing your order...</span>
            </div>
          </div>
        )}
        {validationError && (
          <div
            className='bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative'
            role='alert'
          >
            <span className='block sm:inline'>{validationError}</span>
          </div>
        )}
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Checkout Form */}
          <div className='lg:col-span-2 space-y-8'>
            {isLoggedIn ? (
              <>
                <div>
                  <h2 className='text-xl font-semibold mb-4'>
                    Shipping address
                  </h2>
                  {savedAddresses.length > 0 && (
                    <Select
                      value={selectedAddressId}
                      onValueChange={handleAddressSelect}
                    >
                      <SelectTrigger className='w-full'>
                        <SelectValue placeholder='Select a saved address' />
                      </SelectTrigger>
                      <SelectContent>
                        {savedAddresses.map((addr) => (
                          <SelectItem key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}, {addr.state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                    <Input
                      placeholder='First name *'
                      value={address.firstName}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          firstName: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      placeholder='Last name *'
                      value={address.lastName}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          lastName: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      className='md:col-span-2'
                      placeholder='Company name (optional)'
                      value={address.company}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          company: e.target.value,
                        }))
                      }
                    />
                    <Input
                      className='md:col-span-2'
                      placeholder='Street address *'
                      value={address.street}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          street: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      className='md:col-span-2'
                      placeholder='Apartment, suite, unit, etc. (optional)'
                      value={address.apartment}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          apartment: e.target.value,
                        }))
                      }
                    />
                    <Select
                      value={address.country}
                      onValueChange={(value) =>
                        setAddress((prev) => ({ ...prev, country: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='Country *' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='India'>India</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={address.state}
                      onValueChange={(value) =>
                        setAddress((prev) => ({ ...prev, state: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='State *' />
                      </SelectTrigger>
                      <SelectContent>
                        {indianStates.map((state) => (
                          <SelectItem key={state} value={state}>
                            {state}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder='Town / City *'
                      value={address.city}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          city: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      placeholder='Postcode / ZIP *'
                      value={address.postcode}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          postcode: e.target.value,
                        }))
                      }
                      required
                    />
                    <Input
                      className='md:col-span-2'
                      placeholder='Phone *'
                      value={address.phone}
                      onChange={(e) =>
                        setAddress((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      required
                    />
                  </div>
                  <div className='mt-4'>
                    <Label className='flex items-center space-x-3'>
                      <Checkbox
                        checked={saveAddress}
                        onCheckedChange={(checked) =>
                          setSaveAddress(checked as boolean)
                        }
                      />
                      <span>Save this address for future orders</span>
                    </Label>
                  </div>
                </div>

                <Button onClick={handleProceedToPayment} className='w-full'>
                  Proceed to Payment
                </Button>

                {showPaymentOptions && (
                  <div>
                    <h2 className='text-xl font-semibold mb-4'>Payment</h2>
                    <p className='text-sm text-gray-600 mb-4'>
                      All transactions are secure and encrypted.
                    </p>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: 'phonepe' | 'cod') =>
                        setPaymentMethod(value)
                      }
                    >
                      <div className='space-y-4'>
                        <Label className='flex items-center space-x-3 border rounded-lg p-4'>
                          <RadioGroupItem value='phonepe' />
                          <span>PhonePe Payment Solutions</span>
                          <img
                            src='/placeholder.svg'
                            alt='PhonePe'
                            width={80}
                            height={24}
                            className='ml-auto'
                          />
                        </Label>
                        <Label className='flex items-center space-x-3 border rounded-lg p-4'>
                          <RadioGroupItem value='cod' />
                          <span>Cash on delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {checkoutStep === 'payment' && (
                  <div>
                    <h2 className='text-xl font-semibold mb-2'>
                      Billing address
                    </h2>
                    <p className='text-sm text-gray-600 mb-4'>
                      Select the address that matches your card or payment
                      method.
                    </p>
                    <RadioGroup
                      value={useSameAddress ? 'same' : 'different'}
                      onValueChange={(value) =>
                        setUseSameAddress(value === 'same')
                      }
                    >
                      <div className='space-y-4'>
                        <Label className='flex items-center space-x-3 border rounded-lg p-4'>
                          <RadioGroupItem value='same' />
                          <span>Same as shipping address</span>
                        </Label>
                        <div className='border rounded-lg'>
                          <Label className='flex items-center space-x-3 p-4'>
                            <RadioGroupItem value='different' />
                            <span>Use a different billing address</span>
                          </Label>
                          {!useSameAddress && (
                            <div className='border-t p-4'>
                              <div className='mb-4'>
                                <Select
                                  onValueChange={handleBillingAddressSelect}
                                >
                                  <SelectTrigger className='w-full'>
                                    <SelectValue placeholder='Select a saved address' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {savedAddresses.map((addr) => (
                                      <SelectItem key={addr.id} value={addr.id}>
                                        {addr.street}, {addr.city}, {addr.state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <Input
                                  placeholder='First name *'
                                  value={billingAddress?.firstName || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      firstName: e.target.value,
                                    }))
                                  }
                                  className={
                                    formErrors.billing_firstName
                                      ? 'border-red-500'
                                      : ''
                                  }
                                />
                                <Input
                                  placeholder='Last name *'
                                  value={billingAddress?.lastName || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      lastName: e.target.value,
                                    }))
                                  }
                                  className={
                                    formErrors.billing_lastName
                                      ? 'border-red-500'
                                      : ''
                                  }
                                />
                                <Input
                                  className='md:col-span-2'
                                  placeholder='Company name (optional)'
                                  value={billingAddress?.company || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      company: e.target.value,
                                    }))
                                  }
                                />
                                <Input
                                  className={`md:col-span-2 ${
                                    formErrors.billing_phone
                                      ? 'border-red-500'
                                      : ''
                                  }`}
                                  placeholder='Street address *'
                                  value={billingAddress?.street || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      street: e.target.value,
                                    }))
                                  }
                                />
                                <Input
                                  className='md:col-span-2'
                                  placeholder='Apartment, suite, unit, etc. (optional)'
                                  value={billingAddress?.apartment || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      apartment: e.target.value,
                                    }))
                                  }
                                />
                                <Select
                                  value={billingAddress?.country || 'India'}
                                  onValueChange={(value) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      country: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='Country *' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value='India'>India</SelectItem>
                                  </SelectContent>
                                </Select>
                                <Select
                                  value={billingAddress?.state || ''}
                                  onValueChange={(value) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      state: value,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder='State *' />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {indianStates.map((state) => (
                                      <SelectItem key={state} value={state}>
                                        {state}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <Input
                                  placeholder='Town / City *'
                                  value={billingAddress?.city || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      city: e.target.value,
                                    }))
                                  }
                                  className={
                                    formErrors.billing_city
                                      ? 'border-red-500'
                                      : ''
                                  }
                                />
                                <Input
                                  placeholder='Postcode / ZIP *'
                                  value={billingAddress?.postcode || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      postcode: e.target.value,
                                    }))
                                  }
                                  className={
                                    formErrors.billing_postcode
                                      ? 'border-red-500'
                                      : ''
                                  }
                                />
                                <Input
                                  className={`md:col-span-2 ${
                                    formErrors.billing_phone
                                      ? 'border-red-500'
                                      : ''
                                  }`}
                                  placeholder='Phone *'
                                  value={billingAddress?.phone || ''}
                                  onChange={(e) =>
                                    setBillingAddress((prev) => ({
                                      ...prev,
                                      phone: e.target.value,
                                    }))
                                  }
                                />
                              </div>
                              <div className='mt-4'>
                                <Button
                                  onClick={handleSaveBillingAddress}
                                  className='w-full'
                                >
                                  Save Billing Address
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                    {useSameAddress && (
                      <div className='mt-4'>
                        <Button
                          onClick={handleSaveBillingAddress}
                          className='w-full'
                        >
                          Confirm Billing Address
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {checkoutStep === 'billing' && (
                  <div className='space-y-4'>
                    <Label className='flex items-center space-x-3'>
                      <Checkbox
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        required
                      />
                      <span className='text-sm'>
                        I have read and agree to the website{' '}
                        <Link
                          to='/terms-and-conditions'
                          className='text-blue-600 hover:underline'
                        >
                          terms and conditions
                        </Link>
                      </span>
                    </Label>

                    <Button
                      type='submit'
                      className='w-full'
                      disabled={!acceptTerms}
                      onClick={handleSubmit}
                    >
                      Complete Order
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className='text-center'>
                <p className='mb-4'>
                  Please log in to continue with your purchase.
                </p>
                <Button onClick={() => setIsLoginModalOpen(true)}>
                  Login now to continue buying
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className='bg-gray-50 p-6 rounded-lg h-fit'>
            <h2 className='text-xl font-semibold mb-6'>Order Summary</h2>
            <div className='space-y-4'>
              {products.map((product) => (
                <div key={product.id} className='flex items-center gap-4'>
                  <div className='relative w-20 h-20'>
                    <img
                      src={product.thumbnail || '/placeholder.svg'}
                      alt={product.title}
                      // layout='fill'
                      // objectFit='cover'
                      className='w-full h-full object-contain rounded-lg'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{product.title}</h3>
                    <div className='flex items-center gap-2 mt-2'>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        -
                      </Button>
                      <span>{product.quantity}</span>
                      <Button
                        variant='outline'
                        size='icon'
                        className='h-6 w-6'
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='border-t mt-6 pt-6 space-y-4'>
              <div className='flex justify-between'>
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between'>
                <span>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold text-lg'>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          handleLoginSuccess();
          // Trigger storage event to update header
          window.dispatchEvent(new Event('storage'));
        }}
      />
    </MainLayout>
  );
}
