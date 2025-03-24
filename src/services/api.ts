// Base API URL - will use the environment variable
const API_URL = import.meta.env.VITE_API_URL;

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
  categories: ProductCategory[];
}

export interface ProductImage {
  id: number;
  src: string;
  name: string;
  alt: string;
}

export interface ProductCategory {
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

// Fetch all product categories
export const fetchProductCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories`);
    if (!response.ok) {
      throw new Error('Failed to fetch product categories');
    }
    const data = await response.json();

    // Add debug logging

    return data;
  } catch (error) {
    console.error('Error fetching product categories:', error);
    // Return empty array instead of throwing to prevent component crashes
    return [];
  }
};

// API functions
export const fetchProducts = async (
  page = 1,
  keyword = ''
): Promise<ProductResponse> => {
  try {
    const response = await fetch(
      `${API_URL}/products?pageNumber=${page}&keyword=${keyword}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const fetchProductById = async (
  id: number | string
): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}/products/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch product');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
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
      throw new Error('Failed to fetch products by category');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
};

export const fetchFeaturedProducts = async (limit = 8): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}/products/featured?limit=${limit}`);
    if (!response.ok) {
      throw new Error('Failed to fetch featured products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

export const fetchBestSellerProducts = async (
  limit = 8
): Promise<Product[]> => {
  try {
    const response = await fetch(
      `${API_URL}/products/bestsellers?limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch bestseller products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching bestseller products:', error);
    throw error;
  }
};

export const fetchRelatedProducts = async (
  categorySlug: string,
  currentProductId: number,
  limit = 5
) => {
  try {
    const response = await fetch(
      `${API_URL}/products/related?category=${categorySlug}&exclude=${currentProductId}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to fetch related products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching related products:', error);
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

export const submitProductReview = async (
  productId: number,
  reviewData: { name: string; comment: string; rating: number }
) => {
  try {
    const response = await fetch(`${API_URL}/products/${productId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit review');
    }

    return await response.json();
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

// Search products by keyword
export const searchProducts = async (keyword: string, limit = 10) => {
  if (!keyword || keyword.trim() === '') {
    return { products: [], total: 0 };
  }

  try {
    const response = await fetch(
      `${API_URL}/products/search?keyword=${encodeURIComponent(
        keyword
      )}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to search products');
    }
    return await response.json();
  } catch (error) {
    console.error('Error searching products:', error);
    // Return empty array instead of throwing to prevent component crashes
    return { products: [], total: 0 };
  }
};
