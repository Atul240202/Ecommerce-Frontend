import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { MainLayout } from "../layouts/MainLayout";

export default function PaymentCallback() {
  const [params] = useSearchParams();
  const transactionId = params.get("transactionId");
  const navigate = useNavigate();
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    console.log("transaction id", transactionId);
    const verifyPayment = async () => {
      try {
        const res = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/payment/phonepe/status/${transactionId}`
        );
        console.log("payment res", res);
        const data = await res.json();
        console.log("payment confirmation data", data);

        if (data.success) {
          navigate(`/order-confirmation/online/${data.transactionId}`);
        } else {
          toast({
            title: "Payment Failed",
            description:
              "Transaction could not be completed. Try another method.",
            variant: "destructive",
          });
          navigate("/order-confirmation/online/failed");
        }
      } catch (err) {
        console.error("Error verifying payment", err);
        toast({
          title: "Server Error",
          description: "Something went wrong during payment verification.",
          variant: "destructive",
        });
        navigate("/order-confirmation/online/failed");
      } finally {
        setVerifying(false);
      }
    };

    if (transactionId) verifyPayment();
  }, [transactionId, navigate]);

  return (
    <MainLayout>
      <div className="flex justify-center items-center min-h-screen flex-col text-center">
        <Loader2 className="animate-spin w-8 h-8 text-blue-500 mb-2" />
        <p className="text-gray-600 text-sm">
          Verifying your payment with PhonePe...
        </p>
      </div>
    </MainLayout>
  );
}
