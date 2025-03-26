import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

// Create a new final order
export const createFinalOrder = async (orderData: any) => {
  try {
    const response = await axios.post(`${API_URL}/final-orders`, orderData, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating final order:', error);
    throw error;
  }
};

// Get all final orders
export const getFinalOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/final-orders`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching final orders:', error);
    throw error;
  }
};

// Get a specific final order by ID
export const getFinalOrderById = async (orderId: string) => {
  try {
    const response = await axios.get(`${API_URL}/final-orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error fetching final order ${orderId}:`, error);
    throw error;
  }
};

// Get final orders for the current user
export const getUserFinalOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/final-orders/user`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user final orders:', error);
    throw error;
  }
};

// Update a final order status
export const updateFinalOrderStatus = async (
  orderId: string,
  status: string
) => {
  try {
    const response = await axios.patch(
      `${API_URL}/final-orders/${orderId}/status`,
      { status },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating final order ${orderId} status:`, error);
    throw error;
  }
};

// Delete a final order (admin only)
export const deleteFinalOrder = async (orderId: string) => {
  try {
    const response = await axios.delete(`${API_URL}/final-orders/${orderId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error deleting final order ${orderId}:`, error);
    throw error;
  }
};

// Retry ShipRocket integration for a failed order
export const retryShipRocketIntegration = async (orderId: string) => {
  try {
    const response = await axios.post(
      `${API_URL}/final-orders/${orderId}/retry-shiprocket`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error retrying ShipRocket integration for order ${orderId}:`,
      error
    );
    throw error;
  }
};

// Check ShipRocket API status for an order
export const checkShipRocketStatus = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${API_URL}/final-orders/${orderId}/shiprocket-status`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(
      `Error checking ShipRocket status for order ${orderId}:`,
      error
    );
    throw error;
  }
};
