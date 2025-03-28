import { useState, useEffect } from 'react';
import { trackOrder } from '../../services/orderTrackingService';
import { Loader2 } from 'lucide-react';

interface OrderTrackingProps {
  orderId: string;
}

export function OrderTracking({ orderId }: OrderTrackingProps) {
  const [trackingData, setTrackingData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrackingData = async () => {
      if (!orderId) {
        setError('No order ID provided');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await trackOrder(orderId);
        if (response.success) {
          setTrackingData(response.data);
        } else {
          setError('Failed to fetch tracking information');
        }
      } catch (err) {
        setError('An error occurred while fetching tracking information');
        console.error('Tracking error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrackingData();
  }, [orderId]);

  if (loading) {
    return (
      <div className='flex items-center justify-center py-8'>
        <Loader2 className='h-6 w-6 animate-spin mr-2' />
        <span>Loading tracking information...</span>
      </div>
    );
  }

  if (error) {
    return <div className='text-red-500 py-4'>{error}</div>;
  }

  if (
    !trackingData ||
    !trackingData.tracking_data ||
    !trackingData.tracking_data.shipment_track
  ) {
    return (
      <div className='text-gray-500 py-4'>
        No tracking information available
      </div>
    );
  }

  const { shipment_track } = trackingData.tracking_data;

  return (
    <div className='space-y-4'>
      <div className='bg-gray-50 p-4 rounded-lg'>
        <h3 className='font-medium mb-2'>Shipment Information</h3>
        <div className='grid grid-cols-2 gap-4'>
          <div>
            <p className='text-sm text-gray-500'>AWB Number</p>
            <p className='font-medium'>{shipment_track.awb_code}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Courier</p>
            <p className='font-medium'>{shipment_track.courier_name}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Current Status</p>
            <p className='font-medium'>{shipment_track.current_status}</p>
          </div>
          <div>
            <p className='text-sm text-gray-500'>Last Updated</p>
            <p className='font-medium'>
              {new Date(shipment_track.last_update_time).toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      <div>
        <h3 className='font-medium mb-4'>Tracking History</h3>
        <div className='space-y-4'>
          {shipment_track.shipment_track_activities.map(
            (activity: any, index: number) => (
              <div key={index} className='border-l-2 pl-4 pb-4 relative'>
                <div className='absolute w-3 h-3 bg-primary rounded-full -left-[7px] top-1'></div>
                <p className='font-medium'>{activity.activity}</p>
                <p className='text-sm text-gray-500'>{activity.location}</p>
                <p className='text-sm text-gray-500'>
                  {new Date(activity.date).toLocaleString()}
                </p>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
