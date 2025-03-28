import { Button } from '../../components/ui/button';
import { Link } from 'react-router-dom';
import { OrderTracking } from './OrderTracking';

interface OrderItem {
  id: number;
  title: string;
  thumbnail?: string;
  price: number;
  quantity: number;
}

interface OrderDetails {
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  finalOrderData?: any;
}

interface OrderConfirmationProps {
  orderNumber: string;
  orderDetails: OrderDetails;
}

export function OrderConfirmation({
  orderNumber,
  orderDetails,
}: OrderConfirmationProps) {
  const { items, subtotal, shipping, total, finalOrderData } = orderDetails;

  // Check if ShipRocket API call failed
  const hasShipRocketFailed =
    finalOrderData &&
    finalOrderData.shipRocketApiStatus &&
    !finalOrderData.shipRocketApiStatus.success;

  return (
    <div className='container mx-auto px-4 py-16'>
      <div className='max-w-3xl mx-auto'>
        <div className='text-center mb-12'>
          {hasShipRocketFailed ? (
            <>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-8 w-8 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
              </div>
              <h1 className='text-3xl font-bold mb-2'>
                Order Processing Issue
              </h1>
              <p className='text-red-600 mb-4'>
                Order failed due to technical issue. Our team has been notified
                and will contact you shortly.
              </p>
              <p className='text-lg font-medium'>
                Reference Number:{' '}
                <span className='text-blue-600'>{orderNumber}</span>
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                Please contact our customer support with this reference number
                for assistance.
              </p>
            </>
          ) : (
            <>
              <div className='inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
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
              <h1 className='text-3xl font-bold mb-2'>
                Thank you for your order!
              </h1>
              <p className='text-gray-600 mb-4'>
                Your order has been placed successfully.
              </p>
              <p className='text-lg font-medium'>
                Order Number:{' '}
                <span className='text-blue-600'>{orderNumber}</span>
              </p>
              <p className='text-sm text-gray-500 mt-2'>
                A confirmation email has been sent to your registered email
                address.
              </p>
            </>
          )}
        </div>

        <div className='bg-white border rounded-lg overflow-hidden mb-8'>
          <div className='bg-gray-50 p-4 border-b'>
            <h2 className='text-xl font-semibold'>Order Summary</h2>
          </div>
          <div className='p-4'>
            <div className='space-y-4 mb-6'>
              {items.map((item) => (
                <div key={item.id} className='flex items-center gap-4'>
                  <div className='relative w-16 h-16'>
                    <img
                      src={item.thumbnail || '/placeholder.svg'}
                      alt={item.title}
                      width={64}
                      height={64}
                      className='rounded-md object-cover'
                    />
                  </div>
                  <div className='flex-1'>
                    <h3 className='font-medium'>{item.title}</h3>
                    <p className='text-sm text-gray-600'>
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className='text-right'>
                    <p className='font-medium'>
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className='border-t pt-4 space-y-2'>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className='flex justify-between text-sm'>
                <span className='text-gray-600'>Shipping</span>
                <span>₹{shipping.toFixed(2)}</span>
              </div>
              <div className='flex justify-between font-semibold text-lg pt-2 border-t mt-2'>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {hasShipRocketFailed && (
          <div className='bg-red-50 border border-red-200 rounded-lg overflow-hidden mb-8'>
            <div className='bg-red-100 p-4 border-b border-red-200'>
              <h2 className='text-xl font-semibold text-red-700'>
                Shipping Issue
              </h2>
            </div>
            <div className='p-4'>
              <div className='flex items-center gap-3'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6 text-red-600'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  />
                </svg>
                <p className='text-red-700'>
                  We encountered a technical issue while processing your
                  shipping information.
                </p>
              </div>
              <p className='mt-2 text-sm text-red-600'>
                Your order has been received, but there was an issue with the
                shipping service. Our team will review this and process your
                order manually. Please contact customer support if you have any
                questions.
              </p>
              {finalOrderData.shipRocketApiStatus &&
                finalOrderData.shipRocketApiStatus.message && (
                  <p className='mt-2 text-sm text-red-600'>
                    Error details: {finalOrderData.shipRocketApiStatus.message}
                  </p>
                )}
            </div>
          </div>
        )}

        {finalOrderData && (
          <div className='bg-white border rounded-lg overflow-hidden mb-8'>
            <div className='bg-gray-50 p-4 border-b'>
              <h2 className='text-xl font-semibold'>Shipping Details</h2>
            </div>
            <div className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <h3 className='font-medium mb-2'>Shipping Address</h3>
                  <p>
                    {finalOrderData.shipping_customer_name}{' '}
                    {finalOrderData.shipping_last_name}
                  </p>
                  <p>{finalOrderData.shipping_address}</p>
                  {finalOrderData.shipping_address_2 && (
                    <p>{finalOrderData.shipping_address_2}</p>
                  )}
                  <p>
                    {finalOrderData.shipping_city},{' '}
                    {finalOrderData.shipping_state}{' '}
                    {finalOrderData.shipping_pincode}
                  </p>
                  <p>{finalOrderData.shipping_country}</p>
                  <p>Phone: {finalOrderData.shipping_phone}</p>
                </div>
                <div>
                  <h3 className='font-medium mb-2'>Payment Information</h3>
                  <p>
                    Payment Method:{' '}
                    {finalOrderData.payment_method === 'COD'
                      ? 'Cash on Delivery'
                      : 'Online Payment'}
                  </p>
                  <p>Order Date: {finalOrderData.order_date}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {finalOrderData && finalOrderData.awbCode && (
          <div className='bg-white border rounded-lg overflow-hidden mb-8'>
            <div className='bg-gray-50 p-4 border-b'>
              <h2 className='text-xl font-semibold'>Shipping Information</h2>
            </div>
            <div className='p-4'>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-4'>
                <div>
                  <p className='text-sm text-gray-500'>AWB Number</p>
                  <p className='font-medium'>{finalOrderData.awbCode}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Courier</p>
                  <p className='font-medium'>{finalOrderData.courierName}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Status</p>
                  <p className='font-medium'>{finalOrderData.shipmentStatus}</p>
                </div>
                {finalOrderData.trackingUrl && (
                  <div>
                    <p className='text-sm text-gray-500'>Tracking Link</p>
                    <a
                      href={finalOrderData.trackingUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='text-blue-600 hover:underline'
                    >
                      Track your shipment
                    </a>
                  </div>
                )}
              </div>

              {finalOrderData._id && (
                <div className='mt-6'>
                  <h3 className='font-medium mb-4'>Tracking Information</h3>
                  <OrderTracking orderId={finalOrderData._id} />
                </div>
              )}
            </div>
          </div>
        )}

        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <Link to='/'>
            <Button variant='outline'>Continue Shopping</Button>
          </Link>
          <Link to='/account?tab=orders'>
            <Button>View My Orders</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
