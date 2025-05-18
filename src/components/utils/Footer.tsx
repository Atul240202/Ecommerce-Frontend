import Link from "next/link";
import { useEffect, useState } from "react";
import { Facebook, Instagram, Youtube } from "lucide-react";
import { Features } from "./Features";
import logo from "../../assets/logo.webp";
import { useLocation } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";

export function Footer() {
  const location = useLocation();
  const isProduct = location.pathname.startsWith("/product/");
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {!isProduct && <Features />}
      <footer className=" bg-gray-50 border-t">
        {/* Yellow top border */}
        <div className="h-1 w-full bg-yellow-400"></div>

        <div className="mx-4 px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Company Info Column */}
            <div className="space-y-4">
              <div
                className={`flex  m-auto ${isMobile ? "justify-center" : ""}`}
              >
                <Link href="/" className="flex-shrink-0">
                  <img
                    src={logo}
                    alt="Industrywaala Logo"
                    width={150}
                    className="h-20 w-auto"
                  />
                </Link>
              </div>
              <p className="text-sm text-justify text-gray-600">
                At Industrywaala, we are dedicated to providing our customers
                with an extensive selection of high-quality industrial goods at
                wholesale prices. Our goal is to simplify the procurement
                process for businesses of all sizes and make it easier to find
                and purchase the products you need.
              </p>

              {/* Social Media - Desktop (hidden on mobile) */}
              <div className="hidden md:block">
                <h3 className="font-semibold text-gray-800 mb-3">Follow us</h3>
                <div className="flex gap-4">
                  <Link
                    href="https://www.facebook.com/industrywaala.com"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Facebook className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.instagram.com/industrywaala/"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Instagram className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.youtube.com/@Industrywaala"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <Youtube className="h-5 w-5" />
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/industry-waala-326034275/"
                    className="text-gray-600 hover:text-gray-800"
                  >
                    <FaLinkedinIn className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>

            <div
              className={`flex  ${
                isMobile ? "text-sm justify-between" : "justify-around"
              }`}
            >
              {/* About Column */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">ABOUT</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/about-us"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      About Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Shop All
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Shop by Brands
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/categories"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Shop by Categories
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Help Column */}
              <div className="space-y-4">
                <h3 className="font-bold text-lg text-gray-800">HELP</h3>
                <ul className="space-y-2">
                  <li>
                    <Link
                      href="/terms-and-conditions"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Terms and Condition
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/shipping-and-returns"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Shipping and Return
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/contact"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Contact Us
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/career"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      Career
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact Column */}
            <div
              className={`flex  ${
                isMobile ? "justify-between text-sm gap-5" : " justify-around"
              }`}
            >
              <div className="">
                <h3 className="font-bold text-lg text-gray-800">MAIL US</h3>
                <p className="text-gray-600">sales@industrywaala.com</p>
                <p className="text-gray-600 mt-2">Want to place an order?</p>
                <p className="text-gray-600">Call: +91 7377 01 7377</p>
                <p className="text-gray-600">GSTIN- 09ACUPT6154G1ZV</p>
              </div>

              <div className="">
                <div className="flex gap-2">
                  {/* <MapPin className='h-5 w-5 text-gray-600 mt-0.5 flex-shrink-0' /> */}
                  <h3 className="font-bold text-lg text-gray-800">
                    OFFICE ADDRESS
                  </h3>
                </div>
                <div className="flexgap-2 ">
                  <div className="">
                    <p className="text-gray-600 font-semibold">SARATECH</p>
                    <p className="text-gray-600">B -80, Sector- 5,</p>
                    <p className="text-gray-600"></p>
                    <p className="text-gray-600">Noida - Gautam Budh Nagar</p>
                    <p className="text-gray-600">Uttar Pradesh, 201301</p>
                  </div>
                </div>
                <div className={`${isMobile ? "hidden" : ""}`}>
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3221178506546!2d77.31936527495522!3d28.59011188600672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce52bdffd3635%3A0x52ca46b16e63fb2a!2sIndustrywaala!5e0!3m2!1sen!2sin!4v1745867546254!5m2!1sen!2sin"
                    width="200"
                    height="150"
                    className="border-1"
                    loading="lazy"
                  ></iframe>
                </div>{" "}
              </div>
            </div>

            <div className={`${isMobile ? "justify-items-center" : "hidden"}`}>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3503.3221178506546!2d77.31936527495522!3d28.59011188600672!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce52bdffd3635%3A0x52ca46b16e63fb2a!2sIndustrywaala!5e0!3m2!1sen!2sin!4v1745867546254!5m2!1sen!2sin"
                width="300"
                height="200"
                className="border-1"
                loading="lazy"
              ></iframe>
            </div>

            {/* Social Media - Mobile Only */}
            <div className="md:hidden justify-items-center">
              <h3 className="font-semibold text-gray-800 mb-3">Follow us</h3>
              <div className="flex gap-4">
                <Link
                  href="https://www.facebook.com/industrywaala.com"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Facebook className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.instagram.com/industrywaala/"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.youtube.com/@Industrywaala"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <Youtube className="h-5 w-5" />
                </Link>
                <Link
                  href="https://www.linkedin.com/in/industry-waala-326034275/"
                  className="text-gray-600 hover:text-gray-800"
                >
                  <FaLinkedinIn className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t">
          <div className="container mx-auto px-4 py-4">
            <p className="text-sm text-center text-gray-600">
              CopyRight Industrywaala - ALL RIGHTS RESERVED || Crafted with 💙
              Just Charge
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
