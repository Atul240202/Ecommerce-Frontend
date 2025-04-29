import type React from "react";
import { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Breadcrumb } from "../components/Breadcrumb";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { toast } from "../components/ui/use-toast";
import { MapPin, Phone, MessageSquare } from "lucide-react";
import Cookies from "js-cookie";
import { useSearchParams } from "react-router-dom";

export default function ContactPage() {
  const [searchParams] = useSearchParams();
  const [isMobile, setIsMobile] = useState(false);
  const productUrl = searchParams.get("product");
  const quantity = searchParams.get("quantity");
  const defaultMessage = productUrl
    ? `Hey, I would like to buy ${productUrl} whose quantity would be ${
        quantity || ""
      }. Kindly revert back with quotation.`
    : "";

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: defaultMessage,
  });
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!Cookies.get("authToken")) {
      alert("Kindly login for completing this process");
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("authToken")}`,
        },
        body: JSON.stringify(formData),
      });
      const result = await response.json();

      if (response.ok) {
        alert("We'll get back to you as soon as possible.");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        alert(`${result.message} || "Please try again later."`);
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Contact Us", href: "#" },
          ]}
        />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            {/* Contact Form */}

            <div>
              <h1 className="text-3xl font-bold text-[#0e224d] mb-2">
                Contact Us
              </h1>
              <p className="text-gray-600 mb-8">
                Our team would love to hear from you!
              </p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Input
                      placeholder="First name"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <Input
                      placeholder="Last name"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Phone number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="min-h-[150px]"
                    required
                  />
                </div>
                <div>
                  <Button
                    type="submit"
                    className="bg-[#4280ef] hover:bg-[#425a8b]"
                  >
                    Send message
                  </Button>
                </div>
              </form>
            </div>

            {/* Google Map */}
            <div className="h-[450px] w-full">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3222748143903!2d77.31936527528747!3d28.59010717568791!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce52bdffd3635%3A0x52ca46b16e63fb2a!2sIndustrywaala!5e0!3m2!1sen!2sin!4v1740588056207!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          {/* Contact Options */}
          <div className="bg-[#f0f3f8] py-12 px-4 rounded-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div
                className={`text-center ${
                  isMobile ? "w-auto mb-4" : "w-[30vw]"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    <MessageSquare className="h-6 w-6 text-[#4280ef]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Mail us</h3>
                <p className="text-gray-600 text-sm mb-2">Speak to our team</p>
                <a
                  href="mailto:sales@industrywaala.com"
                  className="text-[#4280ef] text-sm hover:underline"
                >
                  sales@industrywaala.com
                </a>
              </div>

              <div
                className={`text-center ${
                  isMobile ? "w-auto mb-4" : "w-[25vw]"
                }`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    <Phone className="h-6 w-6 text-[#4280ef]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Call us</h3>
                <p className="text-gray-600 text-sm mb-2">
                  Mon-Fri from 10am to 7pm
                </p>
                <a
                  href="tel:+917377017377"
                  className="text-[#4280ef] text-sm hover:underline"
                >
                  +91 7377 01 7377
                </a>
              </div>

              <div
                className={`text-center ${isMobile ? "w-auto" : "w-[30vw]"}`}
              >
                <div className="flex justify-center mb-4">
                  <div className="bg-white p-4 rounded-full shadow-md">
                    <MapPin className="h-6 w-6 text-[#4280ef]" />
                  </div>
                </div>
                <h3 className="text-lg font-semibold mb-2">Visit our office</h3>
                {/* <p className="text-gray-600 text-sm mb-2">Visit our office</p> */}
                <address className="text-sm not-italic">
                  <p>SARATECH</p>
                  <p>B-80, Sector-5</p>
                  <p>Noida-201301</p>
                  <p>Gautam Budh Nagar</p>
                  <p>Uttar Pradesh 201301</p>
                </address>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
