import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getUserFinalOrders } from "../../services/finalOrderService";
import { Button } from "../ui/button";
import {
  Loader2,
  Download,
  ChevronDown,
  ChevronUp,
  FileText,
} from "lucide-react";
import { format } from "date-fns";

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
}

export function AccountOrders() {
  const [finalOrders, setFinalOrders] = useState<FinalOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        const data = await getUserFinalOrders();
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
                      ₹
                      {Number(finalOrder.sub_total) +
                        Number(finalOrder.shipping_charges)}
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
                        {/* <div className="relative w-14 h-14 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            className="w-full h-full object-contain rounded-md"
                          />
                        </div> */}
                        <div className="flex-1 min-w-0">
                          <div
                            // to={`/product/${item.slug}`}
                            className="text-blue-500 text-sm"
                          >
                            <h4 className="font-medium text-sm line-clamp-1">
                              {item.name}
                            </h4>
                          </div>
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

                    <div className="flex gap-2 mt-3">
                      {finalOrder.trackingUrl && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-green-500 border-green-500 flex-1 text-xs py-1 h-8"
                          onClick={() =>
                            window.open(finalOrder.trackingUrl, "_blank")
                          }
                        >
                          <FileText className="h-3 w-3 mr-1" />
                          Track
                        </Button>
                      )}
                    </div>
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
      <h2 className="text-2xl font-bold mb-8">My Orders</h2>

      <div className="bg-white rounded-lg border overflow-hidden mb-6">
        <div className="p-4 border-b bg-gray-50">
          <div className="grid grid-cols-10 gap-4">
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
            <div className="col-span-2 text-center">
              <h3 className="font-medium">Status</h3>
            </div>
          </div>
        </div>

        {finalOrders.map((finalOrder) => (
          <div key={finalOrder._id} className="border-b last:border-b-2">
            {finalOrder.order_items.map((item, index) => (
              <div key={`${finalOrder._id}-${index}`} className="p-4">
                <div className="grid grid-cols-10 gap-4 items-center">
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
                      {/* <div className="relative w-12 h-12 flex-shrink-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-contain rounded-md"
                        />
                      </div> */}
                      <div>
                        <div
                        // to={`/product/${item.slug}`}
                        >
                          <h4 className="font-medium line-clamp-1 hover:text-blue-500">
                            {item.name}
                          </h4>
                        </div>
                        <p className="text-xs text-gray-500">
                          Qty: {item.units}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-1 text-center">
                    <span className="font-medium">₹{item.selling_price}</span>
                  </div>
                  <div className="col-span-2 text-center">
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
                  <div className="col-span-2 text-right">
                    {index === 0 && (
                      <div className="flex justify-end gap-2">
                        {finalOrder.trackingUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-green-500 border-green-500"
                            onClick={() =>
                              window.open(finalOrder.trackingUrl, "_blank")
                            }
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Track
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
                    {(
                      Number(finalOrder.sub_total) +
                      Number(finalOrder.shipping_charges)
                    ).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
