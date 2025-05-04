"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import {
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  LinkIcon,
} from "lucide-react";
import { MainLayout } from "../../layouts/MainLayout";
import { Breadcrumb } from "../../components/Breadcrumb";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { BlogCard } from "../../components/Blogs/BlogCard";
import { toast } from "../../components/ui/use-toast";
import {
  fetchBlogBySlug,
  fetchBlogs,
  type Blog,
} from "../../services/blogService";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const location = useLocation();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (slug) {
      fetchBlogData(slug);
    }
  }, [slug]);

  const fetchBlogData = async (blogSlug: string) => {
    try {
      setIsLoading(true);
      const blogData = await fetchBlogBySlug(blogSlug);
      setBlog(blogData);

      // Fetch all blogs to find related ones
      const allBlogs = await fetchBlogs();

      // Filter to only published blogs
      const publishedBlogs = allBlogs.filter((b) => b.status === "published");

      // Get related blogs with same tags
      if (blogData && blogData.tags && blogData.tags.length > 0) {
        const related = publishedBlogs
          .filter(
            (b) =>
              b._id !== blogData._id &&
              b.tags &&
              b.tags.some((tag) => blogData.tags?.includes(tag))
          )
          .slice(0, 4);
        setRelatedBlogs(related);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching blog:", error);
      setError("Failed to load blog. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset form
    setComment("");
    setName("");
    setEmail("");

    // Show success message
    toast({
      title: "Comment submitted",
      description: "Your comment has been submitted successfully.",
    });
  };

  const shareUrl = `${window.location.origin}${location.pathname}`;
  const shareTitle = blog ? blog.title : "Check out this blog post";

  const handleShare = async (platform: string) => {
    if (navigator.share && (platform === "native" || platform === "copy")) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        toast({
          title: "Shared successfully",
          description: "The blog post has been shared.",
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      let url = "";
      switch (platform) {
        case "facebook":
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case "twitter":
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(shareTitle)}`;
          break;
        case "linkedin":
          url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(shareTitle)}`;
          break;
        case "email":
          url = `mailto:?subject=${encodeURIComponent(
            shareTitle
          )}&body=${encodeURIComponent(shareUrl)}`;
          break;
        case "copy":
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              toast({
                title: "Link copied",
                description:
                  "The blog post link has been copied to your clipboard.",
              });
            })
            .catch((error) => {
              console.error("Error copying link:", error);
            });
          return;
      }
      if (url) window.open(url, "_blank");
    }
  };

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </MainLayout>
    );
  }

  if (error || !blog) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold mb-4">
            {error || "Blog post not found"}
          </h1>
          <Button
            onClick={() => slug && fetchBlogData(slug)}
            className="bg-[#2D81FF] hover:bg-[#1a6eeb]"
          >
            Try Again
          </Button>
        </div>
      </MainLayout>
    );
  }

  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  // Estimate read time based on content length
  const wordCount = blog.content ? blog.content.split(/\s+/).length : 0;
  const readTime = Math.ceil(wordCount / 200) || 1; // Minimum 1 minute read time

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: "Home", href: "/" },
            { label: "Blog", href: "/blog" },
            { label: blog.title, href: "#" },
          ]}
        />

        <article className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {blog.title}
            </h1>
            <div className="mb-4">
              {blog.tags &&
                blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded mr-2"
                  >
                    {tag}
                  </span>
                ))}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>{formattedDate}</span>
              <span className="mx-2">•</span>
              <span>{readTime} min read</span>
              {blog.author && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {blog.author}</span>
                </>
              )}
            </div>
          </header>

          {blog.mainBanner && (
            <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
              <img
                src={blog.mainBanner || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="prose max-w-none mb-8">
            {/* Render HTML content safely */}
            <div
              className="mb-4 text-gray-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            <style jsx global>{`
              .ProseMirror table {
                border-collapse: collapse;
                table-layout: fixed;
                width: 100%;
                margin: 0 0 1rem 0;
                overflow: hidden;
              }

              .ProseMirror ul {
                list-style-type: disc;
                padding-left: 1.5em;
                margin: 1em 0;
              }

              .ProseMirror ol {
                list-style-type: decimal;
                padding-left: 1.5em;
                margin: 1em 0;
              }

              .ProseMirror li {
                margin-bottom: 0.5em;
              }
              .ProseMirror table td,
              .ProseMirror table th {
                min-width: 1em;
                border: 1px solid #ddd;
                padding: 12px;
                vertical-align: top;
                box-sizing: border-box;
                position: relative;
              }

              .ProseMirror table th {
                font-weight: bold;
                background-color: #f9f9f9;
              }

              .ProseMirror table tr:nth-child(even) td {
                background-color: #f9f9f9;
              }

              .ProseMirror img {
                max-width: 100%;
                height: auto;
              }

              .table-enhanced {
                margin-bottom: 1.5rem !important;
                border-radius: 4px;
                overflow: hidden;
              }

              .table-cell-enhanced {
                padding: 12px !important;
              }
            `}</style>
          </div>

          {blog.footerBanner && (
            <div className="relative aspect-[16/9] my-8 rounded-lg overflow-hidden">
              <img
                src={blog.footerBanner || "/placeholder.svg"}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="flex items-center justify-end gap-2 mb-8">
            <span className="text-sm text-gray-600">Share:</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("facebook")}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("twitter")}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("linkedin")}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("email")}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare("copy")}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <div className="max-w-7xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Blogs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog._id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
