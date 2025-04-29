import { MainLayout } from "../layouts/MainLayout";
import { Breadcrumb } from "../components/Breadcrumb";

export default function ShippingAndReturnsPage() {
  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Pages", href: "#" },
            { label: "Shipping & Returns", href: "#" },
          ]}
        />

        <div className="max-w-5xl mx-auto">
          <h1 className="text-3xl font-bold text-[#0e224d] text-center my-8">
            Shipping & Returns Policy
          </h1>

          <div className="mb-8 rounded-lg overflow-hidden">
            <img
              src="https://res.cloudinary.com/da3r1iagy/image/upload/v1740596034/vuopqj4a_1_oipydu.png"
              alt="Shipping and Returns"
              width={1000}
              height={400}
              className="w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                1. Shipping Information
              </h2>
              <p className="text-gray-700 mb-4">
                At Industrywaala, we strive to deliver your orders as quickly
                and efficiently as possible. We process and ship orders within
                1-2 business days after receiving payment confirmation. Delivery
                times may vary depending on your location and the shipping
                method selected.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                2. Shipping Methods and Costs
              </h2>
              <p className="text-gray-700 mb-4">
                We offer various shipping methods to meet your needs, including
                standard shipping, express shipping, and international shipping.
                Shipping costs are calculated based on the weight, dimensions,
                and destination of your order. You can view the shipping options
                and costs during the checkout process.
              </p>
              <p className="text-gray-700 mb-4">
                For orders above ₹5,000, we offer free standard shipping within
                India. International shipping rates vary by country and will be
                calculated at checkout.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                3. Order Tracking
              </h2>
              <p className="text-gray-700 mb-4">
                Once your order is shipped, you will receive a confirmation
                email with a tracking number. You can use this tracking number
                to monitor the status and location of your package. If you have
                any questions about your shipment, please contact our customer
                service team.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                4. Return Policy
              </h2>
              <p className="text-gray-700 mb-4">
                We want you to be completely satisfied with your purchase. If
                you are not satisfied with your order, you may return it within
                30 days of delivery for a full refund or exchange. Please note
                that certain items, such as custom-made products or clearance
                items, may not be eligible for return.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                5. Return Process
              </h2>
              <p className="text-gray-700 mb-4">
                To initiate a return, please follow these steps:
              </p>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li>
                  Contact our customer service team to obtain a Return
                  Merchandise Authorization (RMA) number.
                </li>
                <li>
                  Pack the item(s) securely in the original packaging, if
                  possible.
                </li>
                <li>
                  Include the RMA number and your order information with the
                  return package.
                </li>
                <li>
                  Ship the package to the address provided by our customer
                  service team.
                </li>
              </ol>
              <p className="text-gray-700 mt-4">
                Once we receive and inspect the returned item(s), we will
                process your refund or exchange. Refunds will be issued to the
                original payment method within 7-10 business days.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                6. Return Shipping Costs
              </h2>
              <p className="text-gray-700 mb-4">
                Return shipping costs are the responsibility of the customer,
                except in cases where the item received was defective, damaged,
                or incorrect. In such cases, we will provide a prepaid return
                shipping label and reimburse you for the return shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                7. Damaged or Defective Items
              </h2>
              <p className="text-gray-700 mb-4">
                If you receive a damaged or defective item, please contact our
                customer service team within 48 hours of delivery. We will
                arrange for a replacement or refund, depending on your
                preference and product availability. Please provide photos of
                the damaged or defective item to help us process your claim more
                efficiently.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                8. Cancellation Policy
              </h2>
              <p className="text-gray-700 mb-4">
                You may cancel your order before it is shipped. Once an order
                has been shipped, it cannot be canceled, but you may return it
                according to our return policy. To cancel an order, please
                contact our customer service team as soon as possible with your
                order number and cancellation request.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-[#0e224d] mb-3">
                9. Contact Us
              </h2>
              <p className="text-gray-700 mb-4">
                If you have any questions or concerns about our shipping and
                returns policy, please contact us at{" "}
                <a
                  href="mailto:sales@industrywaala.com"
                  className="text-[#4280ef] hover:underline"
                >
                  sales@industrywaala.com
                </a>{" "}
                or call us at{" "}
                <a
                  href="tel:+917377017377"
                  className="text-[#4280ef] hover:underline"
                >
                  +91 7377 01 7377
                </a>
                .
              </p>
              <p className="text-gray-700">
                Thank you for shopping with Industrywaala!
              </p>
            </section>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
