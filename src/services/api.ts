// Base API URL - will use the environment variable
const API_URL = import.meta.env.VITE_API_URL;
import Cookies from "js-cookie";

// Product interfaces
export interface ProductResponse {
  products: Product[];
  page: number;
  pages: number;
  total: number;
  category?: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  regular_price: string;
  sale_price: string;
  on_sale: boolean;
  average_rating: string;
  stock_status: string;
  images: ProductImage[];
  categories: InnerProductCategory[];
  slug: string;
  sku: string;
  type: string;
  variations: number[];
  status: string;
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface InnerProductCategory {
  id: number;
  name: string;
  slug: string;
}

export interface ProductCategory {
  _id: string;
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  display: string;
  image: any;
  menu_order: number;
  count: number;
}

export interface JobListing {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  postedDate: string;
}

export interface JobApplicationFormData {
  jobId: number;
  jobTitle: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  resume: File | null;
  coverLetter: string;
}

// Fetch all product categories
export const fetchProductCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error("Failed to fetch product categories");
    }
    const data = await response.json();

    // Add debug logging

    return data;
  } catch (error) {
    console.error("Error fetching product categories:", error);
    // Return empty array instead of throwing to prevent component crashes
    return [];
  }
};

// API functions
export const fetchProducts = async (page = 1, limit = 10, query = "") => {
  try {
    let url = `${API_URL}/products?page=${page}&limit=${limit}`;
    if (query) {
      url += `&keyword=${encodeURIComponent(query)}`;
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error("Failed to fetch products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};
export const fetchProductById = async (
  id: number | string
): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductBySlug = async (slug: string): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/slug/${slug}`);
    if (!response.ok) {
      throw new Error("Failed to fetch product");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchProductsByCategory = async (
  slug: string,
  page = 1
): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/products/category/${slug}?pageNumber=${page}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch products by category");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

export const fetchFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/featured?limit=${limit}`);
    if (!response.ok) {
      throw new Error("Failed to fetch featured products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching featured products:", error);
    throw error;
  }
};

// export const fetchBestSellerProducts = async (
//   limit = 8
// ): Promise<Product[]> => {
//   try {
//     const response = await fetch(
//       `${API_URL}/products/bestsellers?limit=${limit}`
//     );
//     if (!response.ok) {
//       throw new Error("Failed to fetch bestseller products");
//     }
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching bestseller products:", error);
//     throw error;
//   }
// };

export const fetchBestSellerProducts = async (
  limit = 20
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_URL}/products/bestsellers-range?range=lifetime&limit=${limit}`
    );
    console.log("response", response);
    if (!response.ok) {
      throw new Error("Failed to fetch bestseller products");
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    throw error;
  }
};

export const fetchWeeklyBestSellerProducts = async (
  limit = 20
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_URL}/products/bestsellers-range?range=week&limit=${limit}`
    );
    console.log("response", response);
    if (!response.ok) {
      throw new Error("Failed to fetch bestseller products");
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    throw error;
  }
};

export const fetchMonthlyBestSellerProducts = async (
  limit = 20
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_URL}/products/bestsellers-range?range=month&limit=${limit}`
    );
    console.log("response", response);
    if (!response.ok) {
      throw new Error("Failed to fetch bestseller products");
    }

    const data = await response.json();
    return data.products || [];
  } catch (error) {
    console.error("Error fetching bestseller products:", error);
    throw error;
  }
};

export const fetchVariableProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/type/variable`);
    if (!response.ok) {
      throw new Error("Failed to fetch bestseller products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching variable products:", error);
    throw error;
  }
};

export const fetchRelatedProducts = async (
  categorySlug: string
  // currentProductId: number,
  // limit = 5
) => {
  try {
    const response = await fetch(
      `${API_URL}/products/category/${categorySlug}`
    );
    if (!response.ok) {
      throw new Error("Failed to fetch related products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching related products:", error);
    throw error;
  }
};

// export const fetchProductCategories = async (): Promise<ProductCategory[]> => {
//   try {
//     const response = await fetch(`${API_URL}/products/categories`);
//     if (!response.ok) {
//       throw new Error('Failed to fetch categories');
//     }
//     return await response.json();
//   } catch (error) {
//     console.error('Error fetching categories:', error);
//     throw error;
//   }
// };

// Search products by keyword

// Fetch reviews for a product with pagination
export const fetchProductReviews = async (
  productId: number,
  page = 1,
  limit = 10
) => {
  try {
    const response = await fetch(
      `${API_URL}/products/${productId}/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching product reviews:", error);
    throw error;
  }
};

// Check if user has purchased the product
export const verifyProductPurchase = async (productId: number) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      return { verified: false };
    }

    const response = await fetch(
      `${API_URL}/products/${productId}/purchase-verification`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to verify purchase");
    }

    return await response.json();
  } catch (error) {
    console.error("Error verifying product purchase:", error);
    return { verified: false };
  }
};

// Submit a review for a product
export const submitProductReview = async (
  productId: number,
  reviewData: { rating: number; comment: string }
) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to submit review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error submitting product review:", error);
    throw error;
  }
};

// Update an existing review
export const updateProductReview = async (
  reviewId: string,
  reviewData: { rating?: number; comment?: string }
) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating product review:", error);
    throw error;
  }
};

// Delete a review
export const deleteProductReview = async (reviewId: string) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(`${API_URL}/reviews/${reviewId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete review");
    }

    return await response.json();
  } catch (error) {
    console.error("Error deleting product review:", error);
    throw error;
  }
};

// Get user's reviews
export const fetchUserReviews = async (page = 1, limit = 10) => {
  try {
    const token = Cookies.get("authToken");
    if (!token) {
      throw new Error("User not authenticated");
    }

    const response = await fetch(
      `${API_URL}/users/reviews?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch user reviews");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
};

export const searchBrandedProducts = async (
  keyword: string,
  page = 1,
  limit = 10
) => {
  try {
    const response = await fetch(
      `${API_URL}/products/searchbybrand?keyword=${encodeURIComponent(
        keyword
      )}&page=${page}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return await response.json();
  } catch (error) {
    console.error(`Error searching products with keyword ${keyword}:`, error);
    // Return empty array instead of throwing to prevent component crashes
    return { products: [], total: 0 };
  }
};

export const searchProducts = async (keyword: string, limit = 10) => {
  if (!keyword || keyword.trim() === "") {
    return { products: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${API_URL}/products/search?keyword=${encodeURIComponent(
        keyword
      )}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error("Failed to search products");
    }
    return await response.json();
  } catch (error) {
    console.error("Error searching products:", error);
    // Return empty array instead of throwing to prevent component crashes
    return { products: [], total: 0 };
  }
};

export const checkDeliveryAvailability = async (
  pincode: string,
  weight?: number,
  length?: string | number,
  breadth?: string | number,
  height?: string | number,
  declared_value?: string | number
) => {
  try {
    const response = await fetch(`${API_URL}/shiprocket/check-delivery`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        deliveryPostcode: pincode,
        weight: weight || 0.5, // Default weight if not provided
        length: length || "",
        breadth: breadth || "",
        height: height || "",
        declared_value: declared_value || "",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData?.message || "Failed to check delivery availability"
      );
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error in checkDeliveryAvailability():", error.message);
    throw new Error(error.message || "Failed to check delivery availability");
  }
};

export const sendJobApplication = async (formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}/apply-job/apply`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Failed to send job application");
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    console.error("Error in sendJobApplication():", error.message);
    throw new Error(error.message || "Failed to send job application");
  }
};
