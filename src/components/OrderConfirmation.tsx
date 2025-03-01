import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FileDown, Truck } from 'lucide-react';
import Link from 'next/link';

interface OrderConfirmationProps {
  orderNumber: string;
  orderDetails: {
    items: Array<{
      id: number;
      title: string;
      quantity: number;
      price: number;
    }>;
    subtotal: number;
    shipping: number;
    total: number;
  };
}

export function OrderConfirmation({
  orderNumber,
  orderDetails,
}: OrderConfirmationProps) {
  const handleDownloadInvoice = () => {
    // TODO: Implement invoice download
    console.log('Downloading invoice...');
  };

  return (
    <div className='max-w-2xl mx-auto py-16 px-4'>
      <div className='text-center mb-8'>
        <div className='h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
          <svg
            className='h-8 w-8 text-green-600'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M5 13l4 4L19 7'
            />
          </svg>
        </div>
        <h1 className='text-2xl font-bold mb-2'>Order Confirmed!</h1>
        <p className='text-gray-600'>Order #{orderNumber}</p>
      </div>

      <Card className='mb-8'>
        <div className='p-6'>
          <h2 className='text-lg font-semibold mb-4'>Order Summary</h2>
          <div className='space-y-4'>
            {orderDetails.items.map((item) => (
              <div key={item.id} className='flex justify-between'>
                <div>
                  <span className='font-medium'>{item.title}</span>
                  <span className='text-gray-500 ml-2'>x{item.quantity}</span>
                </div>
                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
            <div className='border-t pt-4'>
              <div className='flex justify-between text-sm'>
                <span>Subtotal</span>
                <span>₹{orderDetails.subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm mt-2'>
                <span>Shipping</span>
                <span>₹{orderDetails.shipping.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold mt-4'>
                <span>Total</span>
                <span>₹{orderDetails.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className='flex flex-col gap-4'>
        <Button
          onClick={handleDownloadInvoice}
          variant='outline'
          className='w-full'
        >
          <FileDown className='mr-2 h-4 w-4' />
          Download Invoice
        </Button>
        <Link href='/account#tracking' className='w-full'>
          <Button variant='outline' className='w-full'>
            <Truck className='mr-2 h-4 w-4' />
            Track Order
          </Button>
        </Link>
        <Link href='/'>
          <Button className='w-full'>Shop More</Button>
        </Link>
      </div>
    </div>
  );
}
