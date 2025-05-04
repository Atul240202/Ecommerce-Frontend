import type React from "react";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ToastProvider } from "../components/ui/toast";
import { Header } from "../components/utils/Header";
import { SubHeader } from "../components/Home/SubHeader";
import { Footer } from "../components/utils/Footer";
import CategorySubheader from "../components/Home/CategorySubheader";
import BrandSubheader from "../components/Home/BrandSubheader";
import { Phone, MessageCircle, Send } from "lucide-react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  const isHomePage = location.pathname === "/";
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <ToastProvider>
      <div className="min-h-screen flex flex-col">
        <div className="fixed top-0 left-0 w-full bg-white z-50">
          <Header />
        </div>

        <div className={`flex-1 ${isMobile ? "mt-[110px]" : "mt-[85px]"}`}>
          {!isLoginPage && !isRegisterPage && <SubHeader />}
          <div className={``}>{isHomePage && <BrandSubheader />}</div>
          <div className={``}>{isHomePage && <CategorySubheader />}</div>
          <main className="flex-1">{children}</main>
        </div>

        <Footer />
        {/* Floating Contact Buttons */}
        <div className="fixed bottom-4 right-4 flex flex-col items-end gap-3 z-50">
          {/* WhatsApp */}
          <a
            href="https://wa.me/917377017377" // replace with your WhatsApp number
            target="_blank"
            rel="noopener noreferrer"
            className="bg-green-500 hover:bg-green-600 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <Send className="w-5 h-5" />
          </a>

          {/* Call */}
          <a
            href="tel:+917377017377" // replace with your phone number
            className="bg-blue-500 hover:bg-blue-600 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <Phone className="w-5 h-5" />
          </a>

          {/* Message */}
          {/* <a
            href="sms:+919999999999" // replace with your phone number
            className="bg-yellow-500 hover:bg-yellow-600 text-white p-3 rounded-full shadow-lg transition-all"
          >
            <MessageCircle className="w-5 h-5" />
          </a> */}
        </div>
      </div>
    </ToastProvider>
  );
}
