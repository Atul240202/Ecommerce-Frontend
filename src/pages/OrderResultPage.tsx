import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { getUserFinalOrders } from "../services/finalOrderService";
import { MainLayout } from "../layouts/MainLayout";

export default function OrderResultPage() {
  const { transactionId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const { data: orders } = await getUserFinalOrders();
        const matchedOrder = orders.find(
          (o) => o.phonepeTransactionId === transactionId
        );
        if (!matchedOrder) throw new Error("Order not found");
        setOrder(matchedOrder);
      } catch (err) {
        console.error(err);
        setError(err.message || "Failed to fetch order.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [transactionId]);

  if (loading) {
    return (
      <MainLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Loader2 className="animate-spin w-8 h-8" />
          <span className="ml-2">Verifying your payment...</span>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="text-center mt-10">
          <XCircle className="text-red-600 w-16 h-16 mx-auto mb-4" />
          <h2 className="text-red-600 text-xl font-semibold">Payment Failed</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/" className="text-blue-600 underline mt-4 block">
            Homepage
          </Link>
        </div>
      </MainLayout>
    );
  }

  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 6);

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto mt-10 p-4 border rounded-xl shadow">
        <div className="text-center">
          <CheckCircle2 className="text-green-600 w-16 h-16 mx-auto mb-4" />
          <h1 className="text-2xl font-semibold text-green-600 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-700 mb-1">
            Thank you for shopping with Industrywaala!
          </p>
          <p className="text-sm text-gray-600">
            We've sent a confirmation email with your invoice.
          </p>
        </div>

        <div className="mt-4 text-sm text-gray-800">
          <p>
            <strong>Order ID:</strong> {order.order_id}
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(order.order_date).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {order.status}
          </p>
          <p>
            <strong>Expected Delivery:</strong>{" "}
            {deliveryDate.toLocaleDateString()}
          </p>
          <p>
            <strong>Payment Method:</strong> {order.payment_method}
          </p>
          <p>
            <strong>Shipping Address:</strong> {order.shipping_address},{" "}
            {order.shipping_city}, {order.shipping_state},{" "}
            {order.shipping_pincode}
          </p>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Items in your order:</h3>
          <ul className="list-disc pl-6 space-y-1 text-sm">
            {order.order_items.map((item, i) => (
              <li key={i}>
                {item.name} x {item.units} — ₹{item.selling_price}
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-4 text-right font-grey">
          Product charges: ₹{Number(order.sub_total)}
        </div>

        <div className="mt-4 text-right font-grey">
          Shipping charges: ₹{Number(order.shipping_charges)}
        </div>

        <div className="mt-4 text-right font-semibold">
          Total: ₹{Number(order.sub_total) + Number(order.shipping_charges)}
        </div>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="inline-block bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Go to Home
          </Link>
        </div>
      </div>
    </MainLayout>
  );
}
