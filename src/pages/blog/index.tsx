"use client";

import { useState, useEffect } from "react";
import { MainLayout } from "../../layouts/MainLayout";
import { BlogCard } from "../../components/Blogs/BlogCard";
import { Button } from "../../components/ui/button";
import { Loader2 } from "lucide-react";
import { fetchBlogs, type Blog } from "../../services/blogService";

const ITEMS_PER_PAGE = 12;

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogsData();
  }, []);

  const fetchBlogsData = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBlogs();

      // Filter blogs to only show published ones
      const publishedBlogs = data.filter((blog) => blog.status === "published");

      // Sort blogs by date, newest first
      const sortedBlogs = publishedBlogs.sort(
        (a: Blog, b: Blog) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      setBlogs(sortedBlogs);
      setError(null);
    } catch (error) {
      console.error("Error fetching blogs:", error);
      setError("Failed to load blogs. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        </div>
      </MainLayout>
    );
  }

  if (error) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error</h2>
            <p>{error}</p>
            <Button
              onClick={fetchBlogsData}
              className="mt-4 bg-[#2D81FF] hover:bg-[#1a6eeb]"
            >
              Try Again
            </Button>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 md:px-24 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold">BLOGS</h1>
        </div>

        {blogs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No blogs found.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentBlogs.map((blog) => (
                <BlogCard key={blog._id} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <Button
                  className="text-[#2D81FF] bg-[#D2EEFF] hover:bg-[#9cd9ff]"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {[...Array(totalPages)].map((_, i) => (
                  <Button
                    key={i}
                    className={` ${
                      currentPage === i + 1
                        ? "bg-[#2D81FF] text-white hover:bg-[#2D81FF]"
                        : "text-[#2D81FF] bg-white hover:bg-[#D2EEFF]"
                    }`}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  className="text-[#2D81FF] bg-[#D2EEFF] hover:bg-[#9cd9ff]"
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
}
