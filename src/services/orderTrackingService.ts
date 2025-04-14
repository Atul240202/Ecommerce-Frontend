import axios from "axios";
import Cookies from "js-cookie";

// Track an order
export const trackOrder = async (orderId: string) => {
  try {
    const response = await axios.get(
      `${import.meta.env.VITE_API_URL}/final-orders/${orderId}/track`,
      {
        headers: {
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error tracking order:", error);
    throw error;
  }
};

//If awb exists then cancel order by awb code
// export const cancelShipmentByAWB = async (awbs: string) => {
//   const response = await fetch(
//     `${import.meta.env.VITE_API_URL}/shiprocket/user/cancel-shipment`,
//     {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${Cookies.get("authToken")}`,
//       },
//       body: JSON.stringify({ awbs }),
//     }
//   );

//   if (!response.ok) throw new Error("Failed to cancel shipment by AWB");
//   return await response.json();
// };

export const cancelShipmentByOrderId = async (ids: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/final-orders/user/cancel-shipment`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("authToken")}`,
      },
      body: JSON.stringify({ ids }),
    }
  );

  if (!response.ok) throw new Error("Failed to cancel shipment by order ID");
  return await response.json();
};

export const fetchOrderInvoice = async (orderId: string) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_URL}/final-orders/user/invoice/${orderId}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${Cookies.get("authToken")}`,
      },
    }
  );

  if (!response.ok) throw new Error("Failed to fetch order invoice");
  return await response.json();
};
