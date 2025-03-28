import { getAuthToken } from '../services/auth';

export interface UnprocessedOrder {
  tempId: string;
  products: Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
    thumbnail?: string;
  }>;
  shippingAddress: {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    apartment?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  billingAddress?: {
    id: string;
    firstName: string;
    lastName: string;
    address1: string;
    apartment?: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    phone: string;
  };
  subtotal: number;
  shipping: number;
  total: number;
  reason: string;
}

/**
 * Store an unprocessed order in the database
 */
export const storeUnprocessedOrder = async (
  orderData: UnprocessedOrder
): Promise<{ success: boolean; data?: any }> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/unprocessed-orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to store unprocessed order');
    }

    return { success: true, data: data.data };
  } catch (error) {
    console.error('Error storing unprocessed order:', error);
    return { success: false };
  }
};

/**
 * Delete an unprocessed order from the database
 */
export const deleteUnprocessedOrder = async (
  tempId: string
): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/unprocessed-orders/${tempId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete unprocessed order');
    }

    return true;
  } catch (error) {
    console.error('Error deleting unprocessed order:', error);
    return false;
  }
};

/**
 * Delete all unprocessed orders for the current user
 */
export const deleteAllUserUnprocessedOrders = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/unprocessed-orders/user`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to delete unprocessed orders');
    }

    return true;
  } catch (error) {
    console.error('Error deleting unprocessed orders:', error);
    return false;
  }
};

/**
 * Get all unprocessed orders for the current user
 */
export const getUserUnprocessedOrders = async (): Promise<any[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('User not authenticated');
    }

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/unprocessed-orders`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || 'Failed to fetch unprocessed orders');
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching unprocessed orders:', error);
    return [];
  }
};
