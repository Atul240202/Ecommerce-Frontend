import Cookies from "js-cookie";

const API_URL = import.meta.env.VITE_API_URL;

// Helper to make authorized fetch requests
const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
  const token = Cookies.get("authToken");

  const headers = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };

  const response = await fetch(url, { ...options, headers });
  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "API request failed");
  }
  return response.json();
};

// 1. Create a new final order
export const createFinalOrder = async (orderData: any) => {
  const token = Cookies.get("authToken");

  const response = await fetch(`${API_URL}/final-orders`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(orderData),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to place order.");
  }
  if (data.redirectUrl) {
    window.location.href = data.redirectUrl;
  }
  return data;
};

// 2. Get all final orders (admin)
export const getFinalOrders = async () => {
  return await fetchWithAuth(`${API_URL}/final-orders/all`, {
    method: "GET",
  });
};

// 3. Get final orders for the current user
export const getUserFinalOrders = async () => {
  return await fetchWithAuth(`${API_URL}/final-orders/my-orders`, {
    method: "GET",
  });
};

// 4. Get a specific final order by ID
export const getFinalOrderById = async (orderId: string) => {
  return await fetchWithAuth(`${API_URL}/final-orders/${orderId}`, {
    method: "GET",
  });
};

// 5. Update a final order status (admin)
export const updateFinalOrderStatus = async (
  orderId: string,
  status: string
) => {
  return await fetchWithAuth(`${API_URL}/final-orders/${orderId}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
};

// 6. Delete a final order (admin only)
export const deleteFinalOrder = async (orderId: string) => {
  return await fetchWithAuth(`${API_URL}/final-orders/${orderId}`, {
    method: "DELETE",
  });
};

// 7. Retry ShipRocket integration
export const retryShipRocketIntegration = async (orderId: string) => {
  return await fetchWithAuth(
    `${API_URL}/final-orders/${orderId}/retry-shiprocket`,
    {
      method: "POST",
    }
  );
};

// 8. Track order via ShipRocket (tracking endpoint)
export const trackFinalOrder = async (orderId: string) => {
  return await fetchWithAuth(`${API_URL}/final-orders/${orderId}/track`, {
    method: "GET",
  });
};
