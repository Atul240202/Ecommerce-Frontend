import type React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { toast } from "../../components/ui/use-toast";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Cookies from "js-cookie";

interface LoginPopupProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  productName?: string;
}

declare global {
  interface Window {
    google: any;
  }
}

export default function LoginPopup({
  isOpen,
  onClose,
  onLoginSuccess,
  productName,
}: LoginPopupProps) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "Login failed");

      Cookies.set("authToken", data.token, { expires: 1 });
      Cookies.set("isLoggedIn", "true", { expires: 1 });
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: data.user.id,
          fullName: data.user.fullName,
          email: data.user.email,
        })
      );
      window.dispatchEvent(new Event("storage"));
      toast({
        title: "Login Successful",
        description: "You have been successfully logged in.",
      });
      onLoginSuccess();
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegisterClick = () => {
    onClose();
    navigate("/register");
  };

  const handleGoogleOAuthLogin = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    const redirectUri =
      import.meta.env.MODE === "development"
        ? "http://localhost:5173/auth/callback"
        : "https://www.industrywaala.com/auth/callback";

    const scope = encodeURIComponent("openid email profile");
    const responseType = "id_token";
    const nonce = Date.now().toString(); // required for id_token
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&nonce=${nonce}&prompt=select_account`;

    const popup = window.open(url, "_blank", "width=500,height=600");

    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.data?.type === "oauth_callback") {
        window.removeEventListener("message", handleMessage);

        if (event.data.redirectTo) {
          navigate(event.data.redirectTo, {
            state: { googleData: event.data.tempData },
          });
          return;
        }

        const { token, user } = event.data;

        Cookies.set("authToken", token, { expires: 1 });
        Cookies.set("isLoggedIn", "true", { expires: 1 });
        localStorage.setItem("user", JSON.stringify(user));
        window.dispatchEvent(new Event("storage"));

        toast({
          title: "Login Successful",
          description: "You have been successfully logged in with Google.",
        });

        onLoginSuccess();
      }
    };

    window.addEventListener("message", handleMessage);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Login Required</DialogTitle>
          <DialogDescription>
            {productName
              ? `Please login to add ${productName} to your cart.`
              : "Please login to add this product to your cart."}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? "border-red-500 pr-10" : "pr-10"}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">{errors.password}</p>
            )}
          </div>

          <div className="text-sm">
            <a
              href="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Forgot Password?
            </a>
          </div>
        </form>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="button" variant="outline" onClick={handleRegisterClick}>
            Register
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing In...
              </>
            ) : (
              "Login"
            )}
          </Button>
        </DialogFooter>

        <div className="relative mt-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-4"
          onClick={handleGoogleOAuthLogin}
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google"
            width={20}
            height={20}
          />
          Sign in with Google
        </Button>
      </DialogContent>
    </Dialog>
  );
}
