import Cookies from "js-cookie";
const API_URL = import.meta.env.VITE_API_URL;

// Blog interface to match the backend model
export interface Blog {
  _id: string;
  title: string;
  slug: string;
  shortDescription: string;
  content: string;
  author: string;
  thumbnail?: string;
  mainBanner?: string;
  footerBanner?: string;
  status?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

// Fetch all blogs
export const fetchBlogs = async (): Promise<Blog[]> => {
  try {
    const response = await fetch(`${API_URL}/blogs`);

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blogs:", error);
    throw error;
  }
};

// Fetch blog by ID
export const fetchBlogById = async (id: string): Promise<Blog> => {
  try {
    const response = await fetch(`${API_URL}/blogs/${id}`);

    if (!response.ok) {
      throw new Error("Failed to fetch blog");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog:", error);
    throw error;
  }
};

// Fetch blog by slug
export const fetchBlogBySlug = async (slug: string): Promise<Blog> => {
  try {
    const response = await fetch(`${API_URL}/blogs/slug/${slug}`);

    if (!response.ok) {
      throw new Error("Failed to fetch blog by slug");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching blog by slug:", error);
    throw error;
  }
};
