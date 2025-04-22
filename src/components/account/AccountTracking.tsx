"use client";

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserFinalOrders } from "../../services/finalOrderService";
import {
  cancelShipmentByOrderId,
  trackOrder,
  fetchOrderInvoice,
  fetchOrderTaxInvoice,
} from "../../services/orderTrackingService";
import { Button } from "../ui/button";
import {
  Loader2,
  Download,
  ChevronDown,
  ChevronUp,
  Truck,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";

interface OrderItem {
  id: string;
  name: string;
  selling_price: number;
  units: number;
  image?: string;
}

interface FinalOrder {
  _id: string;
  order_id: string;
  order_date: string;
  user: string;
  order_items: OrderItem[];
  sub_total: number;
  shipping_charges: number;
  total: number;
  billing_address: string;
  billing_city: string;
  billing_state: string;
  billing_pincode: string;
  billing_country: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_pincode: string;
  shipping_country: string;
  payment_method: string;
  status: string;
  awbCode?: string;
  courierName?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
  shipping_customer_name: string;
  shipping_last_name: string;
  shipping_address_2: string;
  shipping_phone: string;
  shipRocketOrderId: string;
}

export function AccountTracking() {
  const [finalOrders, setFinalOrders] = useState<FinalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTracking, setActiveTracking] = useState<string | null>(null);
  const [trackingData, setTrackingData] = useState<any>(null);

  // Mobile detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Track expanded items in mobile view
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleItemExpansion = (orderId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  const parseTrackingData = (rawData: any): any | null => {
    if (!rawData || !Array.isArray(rawData) || rawData.length === 0)
      return null;

    const trackingObj = rawData[0];
    const key = Object.keys(trackingObj)[0];
    return trackingObj[key]?.tracking_data || null;
  };

  // Action handlers
  const handleViewInvoice = async (orderId: string) => {
    try {
      const res = await fetchOrderInvoice(orderId);
      if (res.success) window.open(res.invoiceUrl, "_blank");
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Failed to fetch invoice. Please try again.");
    }
  };

  const handleTrackOrder = async (orderId: string) => {
    try {
      const tracking = await trackOrder(orderId);
      if (tracking.success) {
        const parsed = parseTrackingData(tracking.data);
        setActiveTracking(orderId);
        setTrackingData(parsed);
      }
    } catch (err) {
      console.error("Error tracking order:", err);
      alert("Failed to track order. Please try again.");
    }
  };

  const handleCancelOrder = async (shipRocketOrderId: string) => {
    try {
      await cancelShipmentByOrderId(shipRocketOrderId);
      window.location.reload();
    } catch (err) {
      console.error("Error cancelling order:", err);
    }
  };

  const handleTaxInvoice = async (orderId: string) => {
    try {
      const res = await fetchOrderTaxInvoice(orderId);
      console.log("response");
      if (res.is_invoice_created) {
        window.open(res.invoice_url, "_blank");
      } else {
        toast("Invoice is not generated yet", {
          duration: 30000, // 30 seconds
          style: {
            background: "#333",
            color: "#fff",
          },
        });
      }
    } catch (err) {
      console.error("Error fetching invoice:", err);
      alert("Failed to fetch invoice. Please try again.");
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getUserFinalOrders();
        console.log("setFinalOrders", data);
        setFinalOrders(data.data);
      } catch (err) {
        setError("Failed to load your orders. Please try again later.");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM dd, yyyy");
    } catch (e) {
      return "Invalid date";
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-500 mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  if (finalOrders.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>
        <p className="text-gray-600">You haven't placed any orders yet.</p>
      </div>
    );
  }

  // Mobile view
  if (isMobile) {
    return (
      <div className="container px-4 py-6">
        <h2 className="text-xl font-bold mb-4">
          My Orders ({finalOrders.length})
        </h2>

        <div className="space-y-4 mb-6">
          {finalOrders.map((finalOrder) => (
            <div
              key={finalOrder._id}
              className="bg-white rounded-lg border overflow-hidden"
            >
              <div
                className="p-3 flex items-center justify-between cursor-pointer"
                onClick={() => toggleItemExpansion(finalOrder._id)}
              >
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-medium text-sm">
                      Order #{finalOrder.order_id}
                    </h4>
                    <span className="text-xs text-gray-500">
                      {formatDate(finalOrder.createdAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      ₹{finalOrder.sub_total}
                    </span>
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-xs ${getStatusColor(
                        finalOrder.status
                      )}`}
                    >
                      {finalOrder.status}
                    </span>
                  </div>
                </div>
                {expandedItems[finalOrder._id] ? (
                  <ChevronUp className="h-4 w-4 text-gray-500 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-gray-500 ml-2" />
                )}
              </div>

              {expandedItems[finalOrder._id] && (
                <div className="p-3 pt-0 border-t">
                  <div className="space-y-3">
                    {finalOrder.order_items.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 py-2 border-b last:border-b-0"
                      >
                        <div className="flex-1 min-w-0">
                          <Link
                            to={`/product/${item.id}`}
                            className="text-blue-500 text-sm"
                          >
                            <h4 className="font-medium text-sm line-clamp-1">
                              {item.name}
                            </h4>
                          </Link>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              Qty: {item.units}
                            </span>
                            <span className="font-medium text-sm">
                              ₹{item.selling_price}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="pt-2">
                      <h5 className="font-medium text-sm mb-1">
                        Shipping Address:
                      </h5>
                      <p className="text-xs text-gray-600">
                        {finalOrder.shipping_customer_name}{" "}
                        {finalOrder.shipping_last_name}
                        <br />
                        {finalOrder.shipping_address}
                        <br />
                        {finalOrder.shipping_address_2 && (
                          <>
                            {finalOrder.shipping_address_2}
                            <br />
                          </>
                        )}
                        {finalOrder.shipping_city}, {finalOrder.shipping_state}{" "}
                        {finalOrder.shipping_pincode}
                        <br />
                        {finalOrder.shipping_country}
                        <br />
                        Phone: {finalOrder.shipping_phone}
                      </p>
                    </div>

                    {/* Action Buttons - Mobile */}
                    <div className="flex flex-wrap gap-2 mt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-blue-500 border-blue-500 text-xs py-1 h-8 flex-1"
                        onClick={() => handleViewInvoice(finalOrder.order_id)}
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Invoice
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-yellow-500 border-yellow-500 text-xs py-1 h-8 flex-1"
                        onClick={() =>
                          handleTaxInvoice(finalOrder.shipRocketOrderId)
                        }
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Tax Invoice
                      </Button>
                      {finalOrder.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-500 text-xs py-1 h-8 flex-1"
                          onClick={() => handleTrackOrder(finalOrder.order_id)}
                        >
                          <Truck className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      )}
                      {finalOrder.status !== "cancelled" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-500 border-red-500 text-xs py-1 h-8 flex-1"
                          onClick={() =>
                            handleCancelOrder(finalOrder.shipRocketOrderId)
                          }
                        >
                          <XCircle className="h-3 w-3 mr-1" />
                          Cancel
                        </Button>
                      )}
                    </div>

                    {/* Tracking Details - Mobile */}
                    {activeTracking === finalOrder.order_id && (
                      <div className="bg-gray-100 p-3 rounded-md mt-3">
                        {trackingData ? (
                          <>
                            <h4 className="font-semibold text-sm mb-2">
                              Tracking Details
                            </h4>
                            <p className="text-xs mb-2">
                              Current Status:{" "}
                              {trackingData.shipment_track?.[0]
                                ?.current_status || "Not Available"}
                            </p>
                            {Array.isArray(
                              trackingData.shipment_track_activities
                            ) ? (
                              <ul className="text-xs space-y-1">
                                {trackingData.shipment_track_activities.map(
                                  (act: any, i: number) => (
                                    <li
                                      key={i}
                                      className="border-l-2 pl-2 border-blue-400"
                                    >
                                      <strong>{act.date}</strong>:{" "}
                                      {act.activity} ({act.location})
                                    </li>
                                  )
                                )}
                              </ul>
                            ) : (
                              <p className="text-xs text-gray-600">
                                {trackingData.error ||
                                  "No tracking activity found."}
                              </p>
                            )}
                            <button
                              className="text-red-500 mt-2 text-xs underline"
                              onClick={() => setActiveTracking(null)}
                            >
                              Close
                            </button>
                          </>
                        ) : (
                          <p className="text-xs text-gray-600">
                            No tracking data available.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Desktop view
  return (
    <div className="container pb-8">
      <h2 className="text-2xl font-bold mb-8">Track your shipment</h2>

      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-2">
              <h3 className="font-medium">Order #</h3>
            </div>
            <div className="col-span-2">
              <h3 className="font-medium">Date</h3>
            </div>
            <div className="col-span-3">
              <h3 className="font-medium">Product</h3>
            </div>
            <div className="col-span-1 text-center">
              <h3 className="font-medium">Price</h3>
            </div>
            <div className="col-span-1 text-center">
              <h3 className="font-medium">Status</h3>
            </div>
            <div className="col-span-3 text-right">
              <h3 className="font-medium">Actions</h3>
            </div>
          </div>
        </div>

        {finalOrders.map((finalOrder) => (
          <div key={finalOrder._id} className="border-b last:border-b-2">
            {finalOrder.order_items.map((item, index) => (
              <div key={`${finalOrder._id}-${index}`} className="p-4">
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-2">
                    {index === 0 && (
                      <span className="font-medium">{finalOrder.order_id}</span>
                    )}
                  </div>
                  <div className="col-span-2">
                    {index === 0 && (
                      <span>{formatDate(finalOrder.createdAt)}</span>
                    )}
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center gap-4">
                      <div>
                        <Link to={`/product/${item.id}`}>
                          <h4 className="font-medium line-clamp-1 hover:text-blue-500">
                            {item.name}
                          </h4>
                        </Link>
                        <p className="text-xs text-gray-500">
                          Qty: {item.units}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium">₹{item.selling_price}</span>
                  </div>
                  <div className="col-span-1 text-center">
                    {index === 0 && (
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          finalOrder.status
                        )}`}
                      >
                        {finalOrder.status}
                      </span>
                    )}
                  </div>
                  <div className="col-span-3 text-right">
                    {index === 0 && (
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-blue-500 w-[8vw] border-blue-500"
                          onClick={() => handleViewInvoice(finalOrder.order_id)}
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Order Invoice
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-yellow-500 w-[8vw] border-yellow-500"
                          onClick={() =>
                            handleTaxInvoice(finalOrder.shipRocketOrderId)
                          }
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Tax Invoice
                        </Button>
                        {finalOrder.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500 w-[7vw] border-green-500"
                            onClick={() =>
                              handleTrackOrder(finalOrder.order_id)
                            }
                          >
                            <Truck className="h-4 w-4 mr-1" />
                            Track
                          </Button>
                        )}
                        {finalOrder.status !== "cancelled" && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-500 w-[7vw] border-red-500"
                            onClick={() =>
                              handleCancelOrder(finalOrder.shipRocketOrderId)
                            }
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Cancel
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            <div className="p-4 bg-gray-50">
              <div className="flex justify-between items-center">
                <div>
                  <h5 className="font-medium text-sm">Shipping Address:</h5>
                  <p className="text-xs text-gray-600">
                    {finalOrder.shipping_customer_name}{" "}
                    {finalOrder.shipping_last_name},{" "}
                    {finalOrder.shipping_address},
                    {finalOrder.shipping_address_2 &&
                      ` ${finalOrder.shipping_address_2},`}
                    {finalOrder.shipping_city}, {finalOrder.shipping_state}{" "}
                    {finalOrder.shipping_pincode},{finalOrder.shipping_country},
                    Phone: {finalOrder.shipping_phone}
                  </p>
                </div>
                <div className="text-right">
                  <h5 className="font-medium text-sm">Total Amount:</h5>
                  <p className="text-lg font-bold">
                    ₹
                    {Number(finalOrder.sub_total) +
                      Number(finalOrder.shipping_charges)}
                  </p>
                </div>
              </div>
            </div>
            {activeTracking === finalOrder.order_id && (
              <div className="bg-gray-100 px-6 py-4">
                {trackingData ? (
                  <>
                    <h4 className="font-semibold text-sm mb-2">
                      Tracking Details
                    </h4>
                    <p className="text-xs mb-2">
                      Current Status:{" "}
                      {trackingData.shipment_track?.[0]?.current_status ||
                        "Not Available"}
                    </p>
                    {Array.isArray(trackingData.shipment_track_activities) ? (
                      <ul className="text-xs space-y-1">
                        {trackingData.shipment_track_activities.map(
                          (act: any, i: number) => (
                            <li
                              key={i}
                              className="border-l-2 pl-2 border-blue-400"
                            >
                              <strong>{act.date}</strong>: {act.activity} (
                              {act.location})
                            </li>
                          )
                        )}
                      </ul>
                    ) : (
                      <p className="text-xs text-gray-600">
                        {trackingData.error || "No tracking activity found."}
                      </p>
                    )}
                    <button
                      className="text-red-500 mt-2 text-xs underline"
                      onClick={() => setActiveTracking(null)}
                    >
                      Close
                    </button>
                  </>
                ) : (
                  <p className="text-xs text-gray-600">
                    No tracking data available.
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
