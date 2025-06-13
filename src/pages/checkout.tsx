"use client";

import type React from "react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MainLayout } from "../layouts/MainLayout";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Checkbox } from "../components/ui/checkbox";
import { LoginModal } from "../components/utils/LoginModal";
import { useCheckout } from "../contexts/CheckoutContext";
import { Loader2, Plus } from "lucide-react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";
import { indianStates } from "../lib/constants";
import {
  getUserAddresses,
  getDefaultAddresses,
  getUserGst,
  addUserAddress,
  setDefaultAddress,
} from "../services/userService";
import { toast } from "../components/ui/use-toast";
import {
  storeUnprocessedOrder,
  // deleteUnprocessedOrder,
} from "../services/unprocessedOrderService";
import { createFinalOrder } from "../services/finalOrderService";
import { getCurrentUser } from "../services/auth";
import { v4 as uuidv4 } from "uuid";
import { format } from "date-fns";
import phonepe from "/phonepe.png";
import { checkDeliveryAvailability } from "../services/api";

interface UserAddress {
  id: string;
  firstName: string;
  lastName: string;
  company?: string;
  address1: string;
  apartment?: string;
  country: string;
  state: string;
  postcode: string;
  city: string;
  phone: string;
  type: "shipping" | "billing";
  isDefault: boolean;
}

interface FormErrors {
  [key: string]: boolean;
}

export default function CheckoutPage() {
  const {
    products,
    updateQuantity,
    subtotal,
    shipping,
    total,
    updateShipping,
  } = useCheckout();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const navigate = useNavigate();

  // Address states
  const [savedAddresses, setSavedAddresses] = useState<UserAddress[]>([]);
  const [defaultShippingAddress, setDefaultShippingAddress] =
    useState<UserAddress | null>(null);
  const [defaultBillingAddress, setDefaultBillingAddress] =
    useState<UserAddress | null>(null);
  const [selectedShippingAddressId, setSelectedShippingAddressId] =
    useState<string>("");
  const [selectedBillingAddressId, setSelectedBillingAddressId] =
    useState<string>("");
  const [showNewShippingForm, setShowNewShippingForm] = useState(false);
  const [showNewBillingForm, setShowNewBillingForm] = useState(false);
  const [saveNewShippingAddress, setSaveNewShippingAddress] = useState(true);
  const [saveNewBillingAddress, setSaveNewBillingAddress] = useState(true);
  const [showAddressSelection, setShowAddressSelection] = useState(false);
  const [undeliverableAddress, setUndeliverableAddress] = useState(false);
  const [showBillingAddressSelection, setShowBillingAddressSelection] =
    useState(false);
  const navigate = useNavigate();

  // New address form states
  const [newShippingAddress, setNewShippingAddress] = useState<
    Partial<UserAddress>
  >({
    type: "shipping",
    country: "India",
  });
  const [newBillingAddress, setNewBillingAddress] = useState<
    Partial<UserAddress>
  >({
    type: "billing",
    country: "India",
  });

  // Payment and checkout flow states
  const [paymentMethod, setPaymentMethod] = useState<"phonepe" | "cod">(
    "phonepe"
  );
  const [useSameAddress, setUseSameAddress] = useState(true);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [finalOrderData, setFinalOrderData] = useState<any>(null);

  // Unprocessed order tracking
  const [tempOrderId, setTempOrderId] = useState<string>("");
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [includeGST, setIncludeGST] = useState(false);
  const [gstNumber, setGstNumber] = useState("");

  // Add these state variables inside the CheckoutPage component
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [shippingError, setShippingError] = useState("");
  const [calculatedShipping, setCalculatedShipping] = useState(shipping);

  //To sustain checkout page data
  useEffect(() => {
    const savedCheckoutData = sessionStorage.getItem("checkoutData");
    if (savedCheckoutData) {
      const parsedData = JSON.parse(savedCheckoutData);

      setSelectedShippingAddressId(parsedData.selectedShippingAddressId || "");
      setSelectedBillingAddressId(parsedData.selectedBillingAddressId || "");
      setPaymentMethod(parsedData.paymentMethod || "phonepe");
      setIncludeGST(parsedData.includeGST || false);
      setGstNumber(parsedData.gstNumber || "");
      setAcceptTerms(parsedData.acceptTerms || false);

      if (parsedData.products && parsedData.products.length > 0) {
        parsedData.products.forEach((product: any) => {
          updateQuantity(product.id, product.quantity); // Restore quantity
        });
      }
    }
  }, []);

  useEffect(() => {
    const checkoutData = {
      selectedShippingAddressId,
      selectedBillingAddressId,
      paymentMethod,
      includeGST,
      gstNumber,
      acceptTerms,
      products,
    };

    sessionStorage.setItem("checkoutData", JSON.stringify(checkoutData));
  }, [
    selectedShippingAddressId,
    selectedBillingAddressId,
    paymentMethod,
    includeGST,
    gstNumber,
    acceptTerms,
    products,
  ]);

  useEffect(() => {
    checkLoginStatus();
    fetchUserGst();
    // Get tempId from sessionStorage if available
    const storedTempId = sessionStorage.getItem("unprocessed_order_tempid");
    if (storedTempId) {
      setTempOrderId(storedTempId);
    }
  }, []);

  const checkLoginStatus = async () => {
    const authToken = Cookies.get("authToken");
    const loggedIn = Cookies.get("isLoggedIn") === "true";
    setIsLoggedIn(authToken != null && loggedIn);

    if (authToken && loggedIn) {
      fetchUserAddresses();

      // Get current user for unprocessed order tracking
      try {
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    }
  };

  const fetchUserGst = async () => {
    try {
      const cust_gst = await getUserGst();
      if (cust_gst && includeGST) {
        setGstNumber(cust_gst);
      }
    } catch (error) {
      console.error("Error fetching user gst:", error);
    }
  };

  const fetchUserAddresses = async () => {
    try {
      // Fetch all user addresses
      const addresses = await getUserAddresses();
      setSavedAddresses(addresses);

      // Fetch default addresses
      const { shipping, billing } = await getDefaultAddresses();

      if (shipping) {
        setDefaultShippingAddress(shipping);
        setSelectedShippingAddressId(shipping.id);
      }

      if (billing) {
        setDefaultBillingAddress(billing);
        setSelectedBillingAddressId(billing.id);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      toast({
        title: "Error",
        description: "Failed to load your saved addresses",
        variant: "destructive",
      });
    }
  };

  const handleQuantityChange = (productId: number, change: number) => {
    const product = products.find((p) => p.id === productId);
    if (product) {
      const newQuantity = Math.max(1, product.quantity + change);
      updateQuantity(productId, newQuantity);
    }
  };

  // Add this function to calculate the declared value (product price)
  const calculateDeclaredValue = (product) => {
    if (product.sale_price && Number.parseFloat(product.sale_price) > 0) {
      return Number.parseFloat(product.sale_price);
    } else if (
      product.regular_price &&
      Number.parseFloat(product.regular_price) > 0
    ) {
      return Number.parseFloat(product.regular_price);
    } else {
      return Number.parseFloat(product.price);
    }
  };

  // Add this function to fetch shipping charges
  const fetchShippingCharges = async (postcode) => {
    if (!postcode || products.length === 0) return;

    setIsLoadingShipping(true);
    setShippingError("");

    try {
      // Calculate total weight and dimensions
      let totalWeight = 0;
      let maxLength = 0;
      let maxBreadth = 0;
      let maxHeight = 0;
      let totalDeclaredValue = 0;

      // Process each product
      products.forEach((product) => {
        // Add weight
        const productWeight = product.weight
          ? Number.parseFloat(product.weight) * product.quantity
          : 0.5 * product.quantity;
        totalWeight += productWeight;

        // Get dimensions
        const dimensions = product.dimensions || {};
        const parseDimension = (value?: string | number) =>
          Number(value) > 0 ? Number(value) : 0;

        const length = parseDimension(dimensions.length);
        const width = parseDimension(dimensions.width);
        const height = parseDimension(dimensions.height);

        // Update max dimensions
        maxLength = Math.max(maxLength, length);
        maxBreadth = Math.max(maxBreadth, width);
        maxHeight = Math.max(maxHeight, height);
        // Calculate declared value
        const declaredValue = calculateDeclaredValue(product);
        totalDeclaredValue += declaredValue * product.quantity;
      });

      // If dimensions are missing, use default shipping
      if (maxLength === 0 || maxBreadth === 0 || maxHeight === 0) {
        // Check if any product has shipping_amount
        let hasShippingAmount = false;
        let productShipping = 0;
        for (const product of products) {
          if (product.shipping_amount && product.shipping_amount > 0) {
            hasShippingAmount = true;
            productShipping += product.shipping_amount * product.quantity;
          }
        }

        if (hasShippingAmount) {
          setCalculatedShipping(productShipping);
        } else {
          const totalQty = products.reduce(
            (acc, product) => acc + product.quantity,
            0
          );
          setCalculatedShipping(200 * totalQty);
        }

        setIsLoadingShipping(false);
        return;
      }

      // Call API to get shipping charges
      const result = await checkDeliveryAvailability(
        postcode,
        totalWeight,
        maxLength,
        maxBreadth,
        maxHeight,
        totalDeclaredValue
      );

      if (result.success && result.available) {
        setCalculatedShipping(
          parseFloat(Number(result.shipping_charges).toFixed(2))
        );
      } else {
        // If delivery not available, fallback to 200 * total qty
        const totalQty = products.reduce(
          (acc, product) => acc + product.quantity,
          0
        );

        setCalculatedShipping(200 * totalQty);
        setUndeliverableAddress(true);
        setShippingError("Delivery may not be available to this pincode.");
      }
    } catch (error) {
      console.error("Error fetching shipping charges:", error);
      setShippingError(
        "Failed to calculate shipping. Using standard shipping rate."
      );
      setCalculatedShipping(200); // Default to 200 on error
    } finally {
      setIsLoadingShipping(false);
    }
  };

  // Add this effect to update the total when calculated shipping changes
  useEffect(() => {
    const newTotal = subtotal + calculatedShipping;
    if (typeof updateShipping === "function") {
      updateShipping(parseFloat(calculatedShipping.toFixed(2)));
    }
  }, [calculatedShipping, subtotal, updateShipping]);

  // Add this effect to fetch shipping charges when shipping address changes
  useEffect(() => {
    if (!selectedShippingAddressId || savedAddresses.length === 0) return;

    const selectedAddress = getSelectedShippingAddress();
    if (selectedAddress?.postcode) {
      fetchShippingCharges(selectedAddress.postcode);
    }
  }, [selectedShippingAddressId, savedAddresses, products]);

  //temporary function only for testing
  useEffect(() => {
    console.log("selectedShippingAddressId:", selectedShippingAddressId);
    console.log("savedAddresses:", savedAddresses);
    const selectedAddress = getSelectedShippingAddress();
    console.log("selectedAddress:", selectedAddress);

    if (selectedAddress?.postcode) {
      fetchShippingCharges(selectedAddress.postcode);
    }
  }, [selectedShippingAddressId, savedAddresses, products]);

  // Modify the handleShippingAddressSelect function to fetch shipping charges
  const handleShippingAddressSelect = async (addressId: string) => {
    setSelectedShippingAddressId(addressId);

    // If this is not already the default address, set it as default
    const selectedAddress = savedAddresses.find(
      (addr) => addr.id === addressId
    );
    if (selectedAddress && !selectedAddress.isDefault) {
      try {
        await setDefaultAddress(addressId);

        // Update the addresses list to reflect the new default
        setSavedAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault:
              addr.id === addressId && addr.type === "shipping"
                ? true
                : addr.type === "shipping"
                ? false
                : addr.isDefault,
          }))
        );

        // Update default shipping address
        setDefaultShippingAddress(selectedAddress);
      } catch (error) {
        console.error("Error setting default address:", error);
        toast({
          title: "Error",
          description: "Failed to set default address. Please try again.",
          variant: "destructive",
        });
      }
    }

    // Fetch shipping charges for the selected address
    if (selectedAddress && selectedAddress.postcode) {
      fetchShippingCharges(selectedAddress.postcode);
    }

    setShowNewShippingForm(false);
    setShowAddressSelection(false);
  };

  const handleBillingAddressSelect = async (addressId: string) => {
    setSelectedBillingAddressId(addressId);

    // If this is not already the default address, set it as default
    const selectedAddress = savedAddresses.find(
      (addr) => addr.id === addressId
    );
    if (selectedAddress && !selectedAddress.isDefault) {
      try {
        await setDefaultAddress(addressId);

        // Update the addresses list to reflect the new default
        setSavedAddresses((prev) =>
          prev.map((addr) => ({
            ...addr,
            isDefault:
              addr.id === addressId && addr.type === "billing"
                ? true
                : addr.type === "billing"
                ? false
                : addr.isDefault,
          }))
        );

        // Update default billing address
        setDefaultBillingAddress(selectedAddress);
      } catch (error) {
        console.error("Error setting default address:", error);
        toast({
          title: "Error",
          description: "Failed to set default address. Please try again.",
          variant: "destructive",
        });
      }
    }

    setShowNewBillingForm(false);
    setShowBillingAddressSelection(false);
  };

  const handleNewShippingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewShippingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewBillingAddressChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewBillingAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleShippingStateChange = (value: string) => {
    setNewShippingAddress((prev) => ({ ...prev, state: value }));
  };

  const handleBillingStateChange = (value: string) => {
    setNewBillingAddress((prev) => ({ ...prev, state: value }));
  };

  const validateForm = () => {
    const errors: FormErrors = {};

    // Validate shipping address
    if (!selectedShippingAddressId && !showNewShippingForm) {
      errors.shippingAddress = true;
    }

    // Validate new shipping address if shown
    if (showNewShippingForm) {
      const requiredFields = [
        "firstName",
        "lastName",
        "address1",
        "city",
        "state",
        "postcode",
        "phone",
      ];
      requiredFields.forEach((field) => {
        if (!newShippingAddress[field]) {
          errors[`shipping_${field}`] = true;
        }
      });
    }

    // Validate billing address if different from shipping
    if (showPaymentOptions && !useSameAddress) {
      if (!selectedBillingAddressId && !showNewBillingForm) {
        errors.billingAddress = true;
      }

      // Validate new billing address if shown
      if (showNewBillingForm) {
        const requiredFields = [
          "firstName",
          "lastName",
          "address1",
          "city",
          "state",
          "postcode",
          "phone",
        ];
        requiredFields.forEach((field) => {
          if (!newBillingAddress[field]) {
            errors[`billing_${field}`] = true;
          }
        });
      }
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      errors.terms = true;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const prepareFinalOrderData = () => {
    const selectedShippingAddress = getSelectedShippingAddress();
    const selectedBillingAddress = getSelectedBillingAddress();
    const dimensionsFromProducts = products.map((p) => ({
      length: Number(p.dimensions?.length || 0),
      breadth: Number(p.dimensions?.width || 0),
      height: Number(p.dimensions?.height || 0),
      weight: Number(p.weight || 0.5),
    }));
    const maxLength = Math.max(...dimensionsFromProducts.map((d) => d.length));
    const maxBreadth = Math.max(
      ...dimensionsFromProducts.map((d) => d.breadth)
    );
    const maxHeight = Math.max(...dimensionsFromProducts.map((d) => d.height));
    const totalWeight = dimensionsFromProducts.reduce(
      (sum, d) => sum + d.weight,
      0
    );
    if (!selectedShippingAddress) {
      throw new Error("Shipping address is required");
    }

    // Generate a unique order ID
    const generatedOrderId = `ORD${Date.now().toString().slice(-6)}${Math.floor(
      Math.random() * 1000
    )}`;

    // Format the current date as YYYY-MM-DD
    const currentDate = format(new Date(), "yyyy-MM-dd");
    // Prepare order items
    const orderItems = products.map((product) => ({
      id: product.id,
      name: product.title,
      sku: product.sku || `Shiprocket-${product.id}`, // Replace with actual SKU if available
      units: product.quantity.toString(),
      selling_price: product.price.toString(),
      discount: "0", // Replace with actual discount if available
      tax: "0", // Replace with actual tax if available
      hsn: "", // Replace with actual HSN code if available
    }));

    // Create the final order data object
    const finalOrderData = {
      order_id: generatedOrderId,
      order_date: currentDate,
      pickup_location: "Home", // Replace with actual pickup location
      channel_id: "2970164",
      comment: "",
      reseller_name: "",
      company_name: "",
      gst_number: gstNumber || "",
      // Billing information
      billing_customer_name:
        selectedBillingAddress?.firstName || selectedShippingAddress.firstName,
      billing_last_name:
        selectedBillingAddress?.lastName || selectedShippingAddress.lastName,
      billing_address:
        selectedBillingAddress?.address1 || selectedShippingAddress.address1,
      billing_address_2:
        selectedBillingAddress?.apartment ||
        selectedShippingAddress.apartment ||
        "",
      billing_isd_code: "+91", // Default ISD code for India
      billing_city:
        selectedBillingAddress?.city || selectedShippingAddress.city,
      billing_pincode:
        selectedBillingAddress?.postcode || selectedShippingAddress.postcode,
      billing_state:
        selectedBillingAddress?.state || selectedShippingAddress.state,
      billing_country:
        selectedBillingAddress?.country || selectedShippingAddress.country,
      billing_email: currentUser?.email || "",
      billing_phone:
        selectedBillingAddress?.phone || selectedShippingAddress.phone,
      billing_alternate_phone: "",

      // Shipping information
      shipping_is_billing: useSameAddress ? true : false,
      shipping_customer_name: selectedShippingAddress.firstName,
      shipping_last_name: selectedShippingAddress.lastName,
      shipping_address: selectedShippingAddress.address1,
      shipping_address_2: selectedShippingAddress.apartment || "",
      shipping_city: selectedShippingAddress.city,
      shipping_pincode: selectedShippingAddress.postcode,
      shipping_country: selectedShippingAddress.country,
      shipping_state: selectedShippingAddress.state,
      shipping_email: currentUser?.email || "",
      shipping_phone: selectedShippingAddress.phone,

      // Order items
      order_items: orderItems,

      // Payment and pricing information
      payment_method: paymentMethod === "cod" ? "COD" : "Prepaid",
      shipping_charges: calculatedShipping.toFixed(2), // Use calculated shipping
      giftwrap_charges: "0",
      transaction_charges: "0",
      total_discount: "0",
      sub_total: subtotal.toFixed(2),

      // Package information
      length: maxLength.toString(),
      breadth: maxBreadth.toString(),
      height: maxHeight.toString(),
      weight: totalWeight.toFixed(2),

      // Additional information
      ewaybill_no: "",
      customer_gstin: gstNumber || "",
      invoice_number: "",
      order_type: "ESSENTIALS",

      gateway: {
        type: paymentMethod === "cod" ? "COD" : "PhonePe",
        returnUrl: `${window.location.origin}/payment/callback`,
      },
      status: "pending",

      // Reference to unprocessed order if exists
      // unprocessed_order_id: tempOrderId || null,
    };

    return finalOrderData;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      setIsLoginModalOpen(true);
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // Prepare the final order data
      const orderData = prepareFinalOrderData();

      // Store the final order data for display in the confirmation page
      setFinalOrderData(orderData);

      // Create the final order in the database
      const result = await createFinalOrder(orderData);

      // For COD, this runs (PhonePe is already redirected)
      if (result.success && result.data) {
        setOrderNumber(result.data.order_id);
        setOrderConfirmed(true);
        if (paymentMethod === "cod" && result?.data?.order_id) {
          navigate(`/order-confirmation/cod/${result.data.order_id}`);
        }
      }
      if (tempOrderId) {
        // await deleteUnprocessedOrder(tempOrderId);
        // Clear from sessionStorage
        sessionStorage.removeItem("unprocessed_order_tempid");
      }

      // if (typeof clearCart === 'function') {
      //   clearCart();
      // } else {
      //   // Fallback if clearCart is not available
      //   console.warn(
      //     'clearCart function not available, using alternative method'
      //   );
      //   // localClearCart();
      // }

      // Show success message
      toast({
        title: "Order Placed Successfully",
        description: `Your order #${orderData.order_id} has been placed successfully.`,
        variant: "default",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      // Show error message to user
      toast({
        title: "Error",
        description:
          "There was a problem processing your order. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSuccess = () => {
    setIsLoginModalOpen(false);
    checkLoginStatus();
  };

  const getSelectedShippingAddress = () => {
    if (selectedShippingAddressId) {
      return (
        savedAddresses.find((addr) => addr.id === selectedShippingAddressId) ||
        null
      );
    }
    return null;
  };

  const getSelectedBillingAddress = () => {
    if (useSameAddress) {
      return getSelectedShippingAddress();
    }

    if (selectedBillingAddressId) {
      return (
        savedAddresses.find((addr) => addr.id === selectedBillingAddressId) ||
        null
      );
    }
    return null;
  };

  const storeOrderAsUnprocessed = async () => {
    if (!currentUser) return false;

    const selectedShippingAddress = getSelectedShippingAddress();
    if (!selectedShippingAddress) return false;

    const selectedBillingAddress = getSelectedBillingAddress();

    // Generate a unique tempId if we don't have one yet
    const orderTempId = tempOrderId || uuidv4();

    try {
      const unprocessedOrderData = {
        tempId: orderTempId,
        products: products.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          quantity: p.quantity,
          thumbnail: p.thumbnail,
          sku: p.sku || "",
        })),
        shippingAddress: {
          id: selectedShippingAddress.id,
          firstName: selectedShippingAddress.firstName,
          lastName: selectedShippingAddress.lastName,
          address1: selectedShippingAddress.address1,
          apartment: selectedShippingAddress.apartment,
          city: selectedShippingAddress.city,
          state: selectedShippingAddress.state,
          postcode: selectedShippingAddress.postcode,
          country: selectedShippingAddress.country,
          phone: selectedShippingAddress.phone,
        },
        billingAddress: selectedBillingAddress
          ? {
              id: selectedBillingAddress.id,
              firstName: selectedBillingAddress.firstName,
              lastName: selectedBillingAddress.lastName,
              address1: selectedBillingAddress.address1,
              apartment: selectedBillingAddress.apartment,
              city: selectedBillingAddress.city,
              state: selectedBillingAddress.state,
              postcode: selectedBillingAddress.postcode,
              country: selectedBillingAddress.country,
              phone: selectedBillingAddress.phone,
            }
          : undefined,
        subtotal,
        shipping: calculatedShipping, // Use calculated shipping
        total: parseFloat((subtotal + calculatedShipping).toFixed(2)),
        reason: "Process was not completed by the user.",
      };

      const result = await storeUnprocessedOrder(unprocessedOrderData);

      if (result.success) {
        // Only update tempOrderId if it's a new one
        if (!tempOrderId) {
          setTempOrderId(orderTempId);
          // Store in sessionStorage for persistence
          sessionStorage.setItem("unprocessed_order_tempid", orderTempId);
        }
        return true;
      }

      return false;
    } catch (error) {
      console.error("Error storing unprocessed order:", error);
      return false;
    }
  };

  const handleProceedToPayment = async () => {
    // Validate shipping address selection
    if (!selectedShippingAddressId && !showNewShippingForm) {
      toast({
        title: "Error",
        description: "Please select a shipping address",
        variant: "destructive",
      });
      return;
    }

    // Validate new shipping address if shown
    if (showNewShippingForm) {
      const requiredFields = [
        "firstName",
        "lastName",
        "address1",
        "city",
        "state",
        "postcode",
        "phone",
      ];
      const missingFields = requiredFields.filter(
        (field) => !newShippingAddress[field]
      );

      if (missingFields.length > 0) {
        toast({
          title: "Error",
          description:
            "Please fill all required fields in the shipping address form",
          variant: "destructive",
        });
        return;
      }
    }

    // Store the order as unprocessed before proceeding to payment
    const stored = await storeOrderAsUnprocessed();
    if (!stored) {
      console.warn(
        "Failed to store unprocessed order, but continuing with checkout"
      );
    }

    setShowPaymentOptions(true);
  };

  // if (orderConfirmed) {
  //   return (
  //     <MainLayout>
  //       <OrderConfirmation
  //         orderNumber={orderNumber}
  //         orderDetails={{
  //           items: products,
  //           subtotal,
  //           shipping,
  //           total,
  //           finalOrderData: finalOrderData,
  //         }}
  //       />
  //     </MainLayout>
  //   );
  // }

  if (products.length === 0) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-2xl font-semibold mb-4">
              Your checkout is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some products to proceed with checkout.
            </p>
            <Link to="/">
              <Button>Continue Shopping</Button>
            </Link>
          </div>
        </div>
      </MainLayout>
    );
  }

  const selectedShippingAddress = getSelectedShippingAddress();
  const selectedBillingAddress = getSelectedBillingAddress();

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        {isSubmitting && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg flex items-center gap-4">
              <Loader2 className="h-6 w-6 animate-spin" />
              <span>Processing your order...</span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {isLoggedIn ? (
              <>
                {/* Shipping Address Section */}
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <h2 className="text-xl font-semibold">Delivery address</h2>
                  </div>

                  <div className="p-4">
                    {!showAddressSelection && !showNewShippingForm && (
                      <>
                        {selectedShippingAddress ? (
                          <div className="border rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {selectedShippingAddress.firstName}{" "}
                                  {selectedShippingAddress.lastName}
                                </p>
                                <p>{selectedShippingAddress.address1}</p>
                                {selectedShippingAddress.apartment && (
                                  <p>{selectedShippingAddress.apartment}</p>
                                )}
                                <p>
                                  {selectedShippingAddress.city},{" "}
                                  {selectedShippingAddress.state}{" "}
                                  {selectedShippingAddress.postcode}
                                </p>
                                <p>{selectedShippingAddress.country}</p>
                                <p>Phone: {selectedShippingAddress.phone}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600"
                                onClick={() => setShowAddressSelection(true)}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        ) : defaultShippingAddress ? (
                          <div className="border rounded-lg p-4 mb-4">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium">
                                  {defaultShippingAddress.firstName}{" "}
                                  {defaultShippingAddress.lastName}
                                </p>
                                <p>{defaultShippingAddress.address1}</p>
                                {defaultShippingAddress.apartment && (
                                  <p>{defaultShippingAddress.apartment}</p>
                                )}
                                <p>
                                  {defaultShippingAddress.city},{" "}
                                  {defaultShippingAddress.state}{" "}
                                  {defaultShippingAddress.postcode}
                                </p>
                                <p>{defaultShippingAddress.country}</p>
                                <p>Phone: {defaultShippingAddress.phone}</p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-blue-600"
                                onClick={() => setShowAddressSelection(true)}
                              >
                                Change
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-4">
                            <p className="text-gray-500 mb-4">
                              You don't have any saved shipping addresses.
                            </p>
                            <Button
                              onClick={() => setShowNewShippingForm(true)}
                            >
                              Add New Address
                            </Button>
                          </div>
                        )}

                        {(selectedShippingAddress ||
                          defaultShippingAddress) && (
                          <Button
                            variant="outline"
                            className="w-full flex items-center justify-center gap-2"
                            onClick={() => setShowNewShippingForm(true)}
                          >
                            <Plus className="h-4 w-4" />
                            Use New Address
                          </Button>
                        )}
                      </>
                    )}

                    {/* Address Selection List */}
                    {showAddressSelection && (
                      <div className="space-y-4">
                        <h3 className="font-medium mb-4">Your addresses</h3>
                        <RadioGroup
                          value={selectedShippingAddressId}
                          onValueChange={handleShippingAddressSelect}
                        >
                          <div className="space-y-4">
                            {savedAddresses
                              .filter((addr) => addr.type === "shipping")
                              .map((address) => (
                                <div
                                  key={address.id}
                                  className={`border rounded-lg p-4 ${
                                    selectedShippingAddressId === address.id
                                      ? "bg-amber-50"
                                      : ""
                                  }`}
                                >
                                  <div className="flex items-start gap-3">
                                    <RadioGroupItem
                                      value={address.id}
                                      id={`address-${address.id}`}
                                      className="mt-1"
                                    />
                                    <div className="flex-1">
                                      <Label
                                        htmlFor={`address-${address.id}`}
                                        className="font-medium"
                                      >
                                        {address.firstName} {address.lastName}
                                      </Label>
                                      <p className="text-sm text-gray-600">
                                        {address.address1}
                                      </p>
                                      {address.apartment && (
                                        <p className="text-sm text-gray-600">
                                          {address.apartment}
                                        </p>
                                      )}
                                      <p className="text-sm text-gray-600">
                                        {address.city}, {address.state}{" "}
                                        {address.postcode}, {address.country}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        Phone: {address.phone}
                                      </p>
                                      <div className="mt-2 text-sm">
                                        <Link
                                          to={`/account?tab=addresses&edit=${address.id}#details`}
                                          className="text-blue-600 hover:underline"
                                        >
                                          Edit address
                                        </Link>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}

                            <Button
                              variant="outline"
                              className="w-full flex items-center justify-center gap-2"
                              onClick={() => {
                                setShowAddressSelection(false);
                                setShowNewShippingForm(true);
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Add New Address
                            </Button>
                          </div>
                        </RadioGroup>

                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            onClick={() => setShowAddressSelection(false)}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={() => setShowAddressSelection(false)}
                            disabled={!selectedShippingAddressId}
                          >
                            Use This Address
                          </Button>
                        </div>
                      </div>
                    )}

                    {/* New Shipping Address Form */}
                    {showNewShippingForm && (
                      <div className="space-y-4">
                        <h3 className="font-medium mb-4">Add a new address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="shipping_firstName">
                              First name *
                            </Label>
                            <Input
                              id="shipping_firstName"
                              name="firstName"
                              value={newShippingAddress.firstName || ""}
                              onChange={handleNewShippingAddressChange}
                              className={
                                formErrors.shipping_firstName
                                  ? "border-red-500"
                                  : ""
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="shipping_lastName">
                              Last name *
                            </Label>
                            <Input
                              id="shipping_lastName"
                              name="lastName"
                              value={newShippingAddress.lastName || ""}
                              onChange={handleNewShippingAddressChange}
                              className={
                                formErrors.shipping_lastName
                                  ? "border-red-500"
                                  : ""
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="shipping_company">
                            Company name (optional)
                          </Label>
                          <Input
                            id="shipping_company"
                            name="company"
                            value={newShippingAddress.company || ""}
                            onChange={handleNewShippingAddressChange}
                          />
                        </div>

                        <div>
                          <Label htmlFor="shipping_address1">
                            Address line 1 *
                          </Label>
                          <Input
                            id="shipping_address1"
                            name="address1"
                            value={newShippingAddress.address1 || ""}
                            onChange={handleNewShippingAddressChange}
                            className={
                              formErrors.shipping_address1
                                ? "border-red-500"
                                : ""
                            }
                            required
                          />
                        </div>

                        <div>
                          <Label htmlFor="shipping_apartment">
                            Apartment, suite, etc. (optional)
                          </Label>
                          <Input
                            id="shipping_apartment"
                            name="apartment"
                            value={newShippingAddress.apartment || ""}
                            onChange={handleNewShippingAddressChange}
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor="shipping_city">City *</Label>
                            <Input
                              id="shipping_city"
                              name="city"
                              value={newShippingAddress.city || ""}
                              onChange={handleNewShippingAddressChange}
                              className={
                                formErrors.shipping_city ? "border-red-500" : ""
                              }
                              required
                            />
                          </div>
                          <div>
                            <Label htmlFor="shipping_state">State *</Label>
                            <Select
                              value={newShippingAddress.state || ""}
                              onValueChange={handleShippingStateChange}
                            >
                              <SelectTrigger
                                id="shipping_state"
                                className={
                                  formErrors.shipping_state
                                    ? "border-red-500"
                                    : ""
                                }
                              >
                                <SelectValue placeholder="Select state" />
                              </SelectTrigger>
                              <SelectContent>
                                {indianStates.map((state) => (
                                  <SelectItem key={state} value={state}>
                                    {state}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="shipping_postcode">
                              PIN code *
                            </Label>
                            <Input
                              id="shipping_postcode"
                              name="postcode"
                              value={newShippingAddress.postcode || ""}
                              onChange={handleNewShippingAddressChange}
                              className={
                                formErrors.shipping_postcode
                                  ? "border-red-500"
                                  : ""
                              }
                              required
                            />
                          </div>
                        </div>

                        <div>
                          <Label htmlFor="shipping_phone">Phone *</Label>
                          <Input
                            id="shipping_phone"
                            name="phone"
                            value={newShippingAddress.phone || ""}
                            onChange={handleNewShippingAddressChange}
                            className={
                              formErrors.shipping_phone ? "border-red-500" : ""
                            }
                            required
                          />
                        </div>

                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="saveShippingAddress"
                            checked={saveNewShippingAddress}
                            onCheckedChange={(checked) =>
                              setSaveNewShippingAddress(!!checked)
                            }
                          />
                          <Label
                            htmlFor="saveShippingAddress"
                            className="text-sm font-normal"
                          >
                            Save this address for future orders
                          </Label>
                        </div>

                        <div className="flex justify-between mt-4">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowNewShippingForm(false);
                              if (
                                savedAddresses.filter(
                                  (a) => a.type === "shipping"
                                ).length > 0
                              ) {
                                setShowAddressSelection(true);
                              }
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            onClick={async () => {
                              // Validate form
                              const requiredFields = [
                                "firstName",
                                "lastName",
                                "address1",
                                "city",
                                "state",
                                "postcode",
                                "phone",
                              ];
                              const missingFields = requiredFields.filter(
                                (field) => !newShippingAddress[field]
                              );

                              if (missingFields.length > 0) {
                                const errors: FormErrors = {};
                                missingFields.forEach((field) => {
                                  errors[`shipping_${field}`] = true;
                                });
                                setFormErrors(errors);
                                return;
                              }

                              try {
                                setIsLoadingShipping(true);

                                // If user wants to save the address, add it to their account
                                if (saveNewShippingAddress) {
                                  // Prepare address object for API
                                  const addressData = {
                                    ...newShippingAddress,
                                    type: "shipping" as const,
                                    isDefault: true, // Make this the default shipping address
                                  };

                                  // Add the address to user's account
                                  const savedAddress = await addUserAddress(
                                    addressData
                                  );

                                  // Update the addresses list
                                  setSavedAddresses((prev) => [
                                    ...prev,
                                    savedAddress,
                                  ]);

                                  // Set as selected address
                                  setSelectedShippingAddressId(savedAddress.id);

                                  // Update default shipping address
                                  setDefaultShippingAddress(savedAddress);

                                  toast({
                                    title: "Address Saved",
                                    description:
                                      "Your new shipping address has been saved.",
                                  });
                                } else {
                                  // Just use this address for current checkout without saving
                                  // Generate a temporary ID for the address
                                  const tempAddress = {
                                    ...newShippingAddress,
                                    id: `temp-${Date.now()}`,
                                    type: "shipping" as const,
                                    isDefault: false,
                                  };

                                  // Set as selected address
                                  setSelectedShippingAddressId(tempAddress.id);

                                  // Add to temporary list
                                  setSavedAddresses((prev) => [
                                    ...prev,
                                    tempAddress,
                                  ]);
                                }

                                // Close the form
                                setShowNewShippingForm(false);
                              } catch (error) {
                                console.error("Error saving address:", error);
                                toast({
                                  title: "Error",
                                  description:
                                    "Failed to save your address. Please try again.",
                                  variant: "destructive",
                                });
                              } finally {
                                setIsLoadingShipping(false);
                              }
                            }}
                          >
                            Use This Address
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Proceed to Payment Button */}
                {!showPaymentOptions && (
                  <Button
                    onClick={handleProceedToPayment}
                    className="w-full"
                    disabled={undeliverableAddress}
                  >
                    {undeliverableAddress
                      ? "Pincode is not deliverable. Please try again later."
                      : "Proceed to Payment"}
                  </Button>
                )}

                {/* Payment Section */}
                {showPaymentOptions && (
                  <div>
                    <h2 className="text-xl font-semibold mb-4">Payment</h2>
                    <p className="text-sm text-gray-600 mb-4">
                      All transactions are secure and encrypted.
                    </p>
                    <RadioGroup
                      value={paymentMethod}
                      onValueChange={(value: "phonepe" | "cod") =>
                        setPaymentMethod(value)
                      }
                    >
                      <div className="space-y-4">
                        <Label className="flex items-center space-x-3 border rounded-lg p-4">
                          <RadioGroupItem value="phonepe" />
                          <span>PhonePe Payment Solutions</span>
                          <img
                            src={phonepe || "/placeholder.svg"}
                            alt="PhonePe"
                            width={50}
                            height={24}
                            className="ml-auto"
                          />
                        </Label>
                        <Label className="flex items-center space-x-3 border rounded-lg p-4">
                          <RadioGroupItem value="cod" />
                          <span>Cash on delivery</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {/* Billing Address Section */}
                {showPaymentOptions && (
                  <div>
                    <h2 className="text-xl font-semibold mb-2">
                      Billing address
                    </h2>
                    <p className="text-sm text-gray-600 mb-4">
                      Select the address that matches your card or payment
                      method.
                    </p>
                    <RadioGroup
                      value={useSameAddress ? "same" : "different"}
                      onValueChange={(value) => {
                        setUseSameAddress(value === "same");
                        if (value === "same") {
                          setShowBillingAddressSelection(false);
                          setShowNewBillingForm(false);
                        }
                      }}
                    >
                      <div className="space-y-4">
                        <Label className="flex items-center space-x-3 border rounded-lg p-4">
                          <RadioGroupItem value="same" />
                          <span>Same as shipping address</span>
                        </Label>
                        <div className="border rounded-lg">
                          <Label className="flex items-center space-x-3 p-4">
                            <RadioGroupItem value="different" />
                            <span>Use a different billing address</span>
                          </Label>

                          {!useSameAddress && (
                            <div className="border-t p-4">
                              {!showBillingAddressSelection &&
                                !showNewBillingForm && (
                                  <>
                                    {selectedBillingAddress ? (
                                      <div className="border rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="font-medium">
                                              {selectedBillingAddress.firstName}{" "}
                                              {selectedBillingAddress.lastName}
                                            </p>
                                            <p>
                                              {selectedBillingAddress.address1}
                                            </p>
                                            {selectedBillingAddress.apartment && (
                                              <p>
                                                {
                                                  selectedBillingAddress.apartment
                                                }
                                              </p>
                                            )}
                                            <p>
                                              {selectedBillingAddress.city},{" "}
                                              {selectedBillingAddress.state}{" "}
                                              {selectedBillingAddress.postcode}
                                            </p>
                                            <p>
                                              {selectedBillingAddress.country}
                                            </p>
                                            <p>
                                              Phone:{" "}
                                              {selectedBillingAddress.phone}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600"
                                            onClick={() =>
                                              setShowBillingAddressSelection(
                                                true
                                              )
                                            }
                                          >
                                            Change
                                          </Button>
                                        </div>
                                      </div>
                                    ) : defaultBillingAddress ? (
                                      <div className="border rounded-lg p-4 mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <p className="font-medium">
                                              {defaultBillingAddress.firstName}{" "}
                                              {defaultBillingAddress.lastName}
                                            </p>
                                            <p>
                                              {defaultBillingAddress.address1}
                                            </p>
                                            {defaultBillingAddress.apartment && (
                                              <p>
                                                {
                                                  defaultBillingAddress.apartment
                                                }
                                              </p>
                                            )}
                                            <p>
                                              {defaultBillingAddress.city},{" "}
                                              {defaultBillingAddress.state}{" "}
                                              {defaultBillingAddress.postcode}
                                            </p>
                                            <p>
                                              {defaultBillingAddress.country}
                                            </p>
                                            <p>
                                              Phone:{" "}
                                              {defaultBillingAddress.phone}
                                            </p>
                                          </div>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600"
                                            onClick={() =>
                                              setShowBillingAddressSelection(
                                                true
                                              )
                                            }
                                          >
                                            Change
                                          </Button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div className="text-center py-4">
                                        <p className="text-gray-500 mb-4">
                                          You don't have any saved billing
                                          addresses.
                                        </p>
                                        <Button
                                          onClick={() =>
                                            setShowNewBillingForm(true)
                                          }
                                        >
                                          Add New Address
                                        </Button>
                                      </div>
                                    )}

                                    {(selectedBillingAddress ||
                                      defaultBillingAddress) && (
                                      <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() =>
                                          setShowNewBillingForm(true)
                                        }
                                      >
                                        <Plus className="h-4 w-4" />
                                        Use New Address
                                      </Button>
                                    )}
                                  </>
                                )}

                              {/* Billing Address Selection List */}
                              {showBillingAddressSelection && (
                                <div className="space-y-4">
                                  <h3 className="font-medium mb-4">
                                    Your billing addresses
                                  </h3>
                                  <RadioGroup
                                    value={selectedBillingAddressId}
                                    onValueChange={handleBillingAddressSelect}
                                  >
                                    <div className="space-y-4">
                                      {savedAddresses
                                        .filter(
                                          (addr) => addr.type === "billing"
                                        )
                                        .map((address) => (
                                          <div
                                            key={address.id}
                                            className={`border rounded-lg p-4 ${
                                              selectedBillingAddressId ===
                                              address.id
                                                ? "bg-amber-50"
                                                : ""
                                            }`}
                                          >
                                            <div className="flex items-start gap-3">
                                              <RadioGroupItem
                                                value={address.id}
                                                id={`billing-address-${address.id}`}
                                                className="mt-1"
                                              />
                                              <div className="flex-1">
                                                <Label
                                                  htmlFor={`billing-address-${address.id}`}
                                                  className="font-medium"
                                                >
                                                  {address.firstName}{" "}
                                                  {address.lastName}
                                                </Label>
                                                <p className="text-sm text-gray-600">
                                                  {address.address1}
                                                </p>
                                                {address.apartment && (
                                                  <p className="text-sm text-gray-600">
                                                    {address.apartment}
                                                  </p>
                                                )}
                                                <p className="text-sm text-gray-600">
                                                  {address.city},{" "}
                                                  {address.state}{" "}
                                                  {address.postcode},{" "}
                                                  {address.country}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                  Phone: {address.phone}
                                                </p>
                                                <div className="mt-2 text-sm">
                                                  <Link
                                                    to={`/account?tab=addresses&edit=${address.id}`}
                                                    className="text-blue-600 hover:underline"
                                                  >
                                                    Edit address
                                                  </Link>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}

                                      <Button
                                        variant="outline"
                                        className="w-full flex items-center justify-center gap-2"
                                        onClick={() => {
                                          setShowBillingAddressSelection(false);
                                          setShowNewBillingForm(true);
                                        }}
                                      >
                                        <Plus className="h-4 w-4" />
                                        Add New Address
                                      </Button>
                                    </div>
                                  </RadioGroup>

                                  <div className="flex justify-between mt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setShowBillingAddressSelection(false)
                                      }
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={() =>
                                        setShowBillingAddressSelection(false)
                                      }
                                      disabled={!selectedBillingAddressId}
                                    >
                                      Use This Address
                                    </Button>
                                  </div>
                                </div>
                              )}

                              {/* New Billing Address Form */}
                              {showNewBillingForm && (
                                <div className="space-y-4">
                                  <h3 className="font-medium mb-4">
                                    Add a new billing address
                                  </h3>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                      <Label htmlFor="billing_firstName">
                                        First name *
                                      </Label>
                                      <Input
                                        id="billing_firstName"
                                        name="firstName"
                                        value={
                                          newBillingAddress.firstName || ""
                                        }
                                        onChange={handleNewBillingAddressChange}
                                        className={
                                          formErrors.billing_firstName
                                            ? "border-red-500"
                                            : ""
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="billing_lastName">
                                        Last name *
                                      </Label>
                                      <Input
                                        id="billing_lastName"
                                        name="lastName"
                                        value={newBillingAddress.lastName || ""}
                                        onChange={handleNewBillingAddressChange}
                                        className={
                                          formErrors.billing_lastName
                                            ? "border-red-500"
                                            : ""
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="billing_company">
                                      Company name (optional)
                                    </Label>
                                    <Input
                                      id="billing_company"
                                      name="company"
                                      value={newBillingAddress.company || ""}
                                      onChange={handleNewBillingAddressChange}
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="billing_address1">
                                      Address line 1 *
                                    </Label>
                                    <Input
                                      id="billing_address1"
                                      name="address1"
                                      value={newBillingAddress.address1 || ""}
                                      onChange={handleNewBillingAddressChange}
                                      className={
                                        formErrors.billing_address1
                                          ? "border-red-500"
                                          : ""
                                      }
                                      required
                                    />
                                  </div>

                                  <div>
                                    <Label htmlFor="billing_apartment">
                                      Apartment, suite, etc. (optional)
                                    </Label>
                                    <Input
                                      id="billing_apartment"
                                      name="apartment"
                                      value={newBillingAddress.apartment || ""}
                                      onChange={handleNewBillingAddressChange}
                                    />
                                  </div>

                                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                      <Label htmlFor="billing_city">
                                        City *
                                      </Label>
                                      <Input
                                        id="billing_city"
                                        name="city"
                                        value={newBillingAddress.city || ""}
                                        onChange={handleNewBillingAddressChange}
                                        className={
                                          formErrors.billing_city
                                            ? "border-red-500"
                                            : ""
                                        }
                                        required
                                      />
                                    </div>
                                    <div>
                                      <Label htmlFor="billing_state">
                                        State *
                                      </Label>
                                      <Select
                                        value={newBillingAddress.state || ""}
                                        onValueChange={handleBillingStateChange}
                                      >
                                        <SelectTrigger
                                          id="billing_state"
                                          className={
                                            formErrors.billing_state
                                              ? "border-red-500"
                                              : ""
                                          }
                                        >
                                          <SelectValue placeholder="Select state" />
                                        </SelectTrigger>
                                        <SelectContent>
                                          {indianStates.map((state) => (
                                            <SelectItem
                                              key={state}
                                              value={state}
                                            >
                                              {state}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                    </div>
                                    <div>
                                      <Label htmlFor="billing_postcode">
                                        PIN code *
                                      </Label>
                                      <Input
                                        id="billing_postcode"
                                        name="postcode"
                                        value={newBillingAddress.postcode || ""}
                                        onChange={handleNewBillingAddressChange}
                                        className={
                                          formErrors.billing_postcode
                                            ? "border-red-500"
                                            : ""
                                        }
                                        required
                                      />
                                    </div>
                                  </div>

                                  <div>
                                    <Label htmlFor="billing_phone">
                                      Phone *
                                    </Label>
                                    <Input
                                      id="billing_phone"
                                      name="phone"
                                      value={newBillingAddress.phone || ""}
                                      onChange={handleNewBillingAddressChange}
                                      className={
                                        formErrors.billing_phone
                                          ? "border-red-500"
                                          : ""
                                      }
                                      required
                                    />
                                  </div>

                                  <div className="flex items-center space-x-2">
                                    <Checkbox
                                      id="saveBillingAddress"
                                      checked={saveNewBillingAddress}
                                      onCheckedChange={(checked) =>
                                        setSaveNewBillingAddress(!!checked)
                                      }
                                    />
                                    <Label
                                      htmlFor="saveBillingAddress"
                                      className="text-sm font-normal"
                                    >
                                      Save this address for future orders
                                    </Label>
                                  </div>

                                  <div className="flex justify-between mt-4">
                                    <Button
                                      variant="outline"
                                      onClick={() => {
                                        setShowNewBillingForm(false);
                                        if (
                                          savedAddresses.filter(
                                            (a) => a.type === "billing"
                                          ).length > 0
                                        ) {
                                          setShowBillingAddressSelection(true);
                                        }
                                      }}
                                    >
                                      Cancel
                                    </Button>
                                    <Button
                                      onClick={async () => {
                                        // Validate form
                                        const requiredFields = [
                                          "firstName",
                                          "lastName",
                                          "address1",
                                          "city",
                                          "state",
                                          "postcode",
                                          "phone",
                                        ];
                                        const missingFields =
                                          requiredFields.filter(
                                            (field) => !newBillingAddress[field]
                                          );

                                        if (missingFields.length > 0) {
                                          const errors: FormErrors = {};
                                          missingFields.forEach((field) => {
                                            errors[`billing_${field}`] = true;
                                          });
                                          setFormErrors(errors);
                                          return;
                                        }

                                        try {
                                          setIsSubmitting(true);

                                          // If user wants to save the address, add it to their account
                                          if (saveNewBillingAddress) {
                                            // Prepare address object for API
                                            const addressData = {
                                              ...newBillingAddress,
                                              type: "billing" as const,
                                              isDefault: true, // Make this the default billing address
                                            };

                                            // Add the address to user's account
                                            const savedAddress =
                                              await addUserAddress(addressData);

                                            // Update the addresses list
                                            setSavedAddresses((prev) => [
                                              ...prev,
                                              savedAddress,
                                            ]);

                                            // Set as selected address
                                            setSelectedBillingAddressId(
                                              savedAddress.id
                                            );

                                            // Update default billing address
                                            setDefaultBillingAddress(
                                              savedAddress
                                            );

                                            toast({
                                              title: "Address Saved",
                                              description:
                                                "Your new billing address has been saved.",
                                            });
                                          } else {
                                            // Just use this address for current checkout without saving
                                            // Generate a temporary ID for the address
                                            const tempAddress = {
                                              ...newBillingAddress,
                                              id: `temp-${Date.now()}`,
                                              type: "billing" as const,
                                              isDefault: false,
                                            };

                                            // Set as selected address
                                            setSelectedBillingAddressId(
                                              tempAddress.id
                                            );

                                            // Add to temporary list
                                            setSavedAddresses((prev) => [
                                              ...prev,
                                              tempAddress,
                                            ]);
                                          }

                                          // Close the form
                                          setShowNewBillingForm(false);
                                        } catch (error) {
                                          console.error(
                                            "Error saving address:",
                                            error
                                          );
                                          toast({
                                            title: "Error",
                                            description:
                                              "Failed to save your address. Please try again.",
                                            variant: "destructive",
                                          });
                                        } finally {
                                          setIsSubmitting(false);
                                        }
                                      }}
                                    >
                                      Use This Address
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                {showPaymentOptions && (
                  <>
                    <div className="flex items-center space-x-2 mt-4">
                      <Checkbox
                        id="includeGst"
                        checked={includeGST}
                        onCheckedChange={(checked) =>
                          setIncludeGST(checked as boolean)
                        }
                      />
                      <Label htmlFor="includeGst" className="text-sm">
                        Do you want to enter your GST details for invoice?
                      </Label>
                    </div>

                    {includeGST && (
                      <div className="mt-2">
                        <Label htmlFor="gstNumber">GST Number</Label>
                        <Input
                          id="gstNumber"
                          name="gstNumber"
                          value={gstNumber}
                          onChange={(e) => setGstNumber(e.target.value)}
                          placeholder="Enter GST Number"
                          className={
                            formErrors.gstNumber ? "border-red-500" : ""
                          }
                        />
                      </div>
                    )}
                  </>
                )}

                {showPaymentOptions && (
                  <div className="space-y-4">
                    <Label className="flex items-center space-x-3">
                      <Checkbox
                        checked={acceptTerms}
                        onCheckedChange={(checked) =>
                          setAcceptTerms(checked as boolean)
                        }
                        required
                      />
                      <span className="text-sm">
                        I have read and agree to the website{" "}
                        <Link
                          to="/terms-and-conditions"
                          className="text-blue-600 hover:underline"
                        >
                          terms and conditions
                        </Link>
                      </span>
                    </Label>

                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!acceptTerms}
                      onClick={handleSubmit}
                    >
                      Complete Order
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center">
                <p className="mb-4">
                  Please log in to continue with your purchase.
                </p>
                <Button onClick={() => setIsLoginModalOpen(true)}>
                  Login now to continue buying
                </Button>
              </div>
            )}
          </div>

          {/* Order Summary */}
          <div className="bg-gray-50 p-6 rounded-lg h-fit">
            <h2 className="text-xl font-semibold mb-6">Order Summary</h2>
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      width={80}
                      height={80}
                      className="rounded-lg object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{product.title}</h3>
                    {product.sku && (
                      <p className="text-xs text-gray-500">
                        SKU: {product.sku}
                      </p>
                    )}
                    {product.weight && (
                      <p className="text-xs text-gray-500">
                        Weight: {product.weight} kg
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(product.id, -1)}
                      >
                        -
                      </Button>
                      <span>{product.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => handleQuantityChange(product.id, 1)}
                      >
                        +
                      </Button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">
                      ₹{(product.price * product.quantity).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t mt-6 pt-6 space-y-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                <span>
                  {isLoadingShipping ? (
                    <span className="text-sm text-gray-500">
                      Calculating...
                    </span>
                  ) : (
                    <>
                      ₹{calculatedShipping.toFixed(2)}
                      {shippingError && (
                        <span className="block text-xs text-red-500">
                          {shippingError}
                        </span>
                      )}
                    </>
                  )}
                </span>
              </div>
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>₹{(subtotal + calculatedShipping).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={() => {
          handleLoginSuccess();
          // Trigger storage event to update header
          window.dispatchEvent(new Event("storage"));
        }}
      />
    </MainLayout>
  );
}
