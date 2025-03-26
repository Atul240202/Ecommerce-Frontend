import axios from 'axios';

// Track an order
export const trackOrder = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/final-orders/${orderId}/track`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error tracking order:', error);
    throw error;
  }
};
