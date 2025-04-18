import type React from "react";

import { MainLayout } from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Checkbox } from "../../components/ui/checkbox";
import { toast } from "../../components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Cookies from "js-cookie";

export default function GoogleRegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [googleData, setGoogleData] = useState<any>(null);
  const [phone, setPhone] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Get Google data from location state
    if (location.state?.googleData) {
      setGoogleData(location.state.googleData);
    } else {
      // No Google data, redirect to regular registration
      navigate("/register");
    }
  }, [location, navigate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate phone
    const phoneRegex = /^\d{10}$/;
    if (!phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!phoneRegex.test(phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }

    // Validate terms agreement
    if (!agreeTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Complete Google registration with phone number
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/google`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...googleData,
            phone,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 400) {
          // Handle 400-specific error (e.g., already registered)
          toast({
            title: "Registration Failed",
            description:
              "This email ID or mobile number is already registered.",
            variant: "destructive",
          });
          return;
        }

        throw new Error(data.message || "Registration failed");
      }
      // Store auth token in cookies
      Cookies.set("authToken", data.token, { expires: 14 });
      Cookies.set("isLoggedIn", "true", { expires: 14 });

      // Store user info in localStorage for easy access
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
        })
      );

      // Trigger storage event to update header
      window.dispatchEvent(new Event("storage"));

      toast({
        title: "Registration Successful",
        description: "Your account has been created successfully.",
      });

      // Navigate to home page
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!googleData) {
    return <div>Loading...</div>;
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Register", href: "/register" },
            { label: "Complete Registration", href: "/register/google" },
          ]}
        />

        <div className="max-w-md mx-auto my-8">
          <div className="w-full p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-center mb-6">
              Complete Your Registration
            </h2>
            <p className="text-center mb-6">
              Hi {googleData.firstName}, we just need your phone number to
              complete your registration.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  pattern="\d{10}"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                  className={errors.phone ? "border-red-500" : ""}
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="terms"
                  checked={agreeTerms}
                  onCheckedChange={(checked) =>
                    setAgreeTerms(checked as boolean)
                  }
                />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
                  <a
                    href="/terms-and-conditions"
                    className="text-blue-600 hover:underline"
                  >
                    Terms and Conditions
                  </a>
                </Label>
              </div>
              {errors.terms && (
                <p className="text-red-500 text-xs">{errors.terms}</p>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Completing Registration...
                  </>
                ) : (
                  "Complete Registration"
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
