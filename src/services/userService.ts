import axios from "axios";
import Cookies from "js-cookie";

// Use environment variable for API URL
const API_BASE_URL = `${import.meta.env.VITE_API_URL}/users`;

// Add auth token to all requests
axios.interceptors.request.use(
  (config) => {
    const authToken = Cookies.get("authToken");
    // const token = localStorage.getItem('token');
    if (authToken) {
      config.headers["Authorization"] = `Bearer ${authToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

interface Address {
  id: string;
  type: "shipping" | "billing";
  isDefault: boolean;
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
  companyName?: string;
  phone?: string;
}

interface UserProfile {
  fullName: string;
  email: string;
  phone: string;
  username?: string;
  userGST?: string;
  subscribeToNewsletter?: boolean;
}

/**
 * Get user profile information
 */
export const getUserProfile = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/profile`);
    return response.data.user;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile. Please try again.");
  }
};

/**
 * Get user gst information
 */
export const getUserGst = async (): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/usergst`);
    return response.data.userGST;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw new Error("Failed to fetch profile. Please try again.");
  }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (
  profileData: UserProfile
): Promise<any> => {
  try {
    const response = await axios.put(`${API_BASE_URL}/profile`, profileData);
    return response.data.user;
  } catch (error: any) {
    console.error("Error updating user profile:", error);

    // Handle specific error for duplicate email/phone
    if (error.response && error.response.status === 400) {
      if (error.response.data.message.includes("email")) {
        throw new Error(
          "This email is already registered with another account."
        );
      }
      if (error.response.data.message.includes("phone")) {
        throw new Error(
          "This phone number is already registered with another account."
        );
      }
    }

    throw new Error("Failed to update profile. Please try again.");
  }
};

/**
 * Get user addresses
 */
export const getUserAddresses = async (): Promise<Address[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/addresses`);
    return response.data.addresses;
  } catch (error) {
    console.error("Error fetching user addresses:", error);
    throw new Error("Failed to fetch addresses. Please try again.");
  }
};

/**
 * Add a new address to user's address book
 */
export const addUserAddress = async (
  address: Omit<Address, "id">
): Promise<Address> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/addresses`, address);
    return response.data.address;
  } catch (error) {
    console.error("Error adding user address:", error);
    throw new Error("Failed to add address. Please try again.");
  }
};

/**
 * Get user's default addresses (shipping and billing)
 */
export const getDefaultAddresses = async (): Promise<{
  shipping: Address | null;
  billing: Address | null;
}> => {
  try {
    const addresses = await getUserAddresses();

    const defaultShipping =
      addresses.find((addr) => addr.type === "shipping" && addr.isDefault) ||
      null;
    const defaultBilling =
      addresses.find((addr) => addr.type === "billing" && addr.isDefault) ||
      null;

    return { shipping: defaultShipping, billing: defaultBilling };
  } catch (error) {
    console.error("Error fetching default addresses:", error);
    return { shipping: null, billing: null };
  }
};

/**
 * Update an existing address
 */
export const updateUserAddress = async (
  addressId: string,
  address: Omit<Address, "id">
): Promise<Address> => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/addresses/${addressId}`,
      address
    );
    return response.data.address;
  } catch (error) {
    console.error("Error updating user address:", error);
    throw new Error("Failed to update address. Please try again.");
  }
};

/**
 * Delete an address from user's address book
 */
export const deleteUserAddress = async (addressId: string): Promise<void> => {
  try {
    await axios.delete(`${API_BASE_URL}/addresses/${addressId}`);
  } catch (error) {
    console.error("Error deleting user address:", error);
    throw new Error("Failed to delete address. Please try again.");
  }
};

/**
 * Set an address as the default for its type
 */
export const setDefaultAddress = async (addressId: string): Promise<void> => {
  try {
    await axios.put(`${API_BASE_URL}/addresses/${addressId}/default`);
  } catch (error) {
    console.error("Error setting default address:", error);
    throw new Error("Failed to set default address. Please try again.");
  }
};
