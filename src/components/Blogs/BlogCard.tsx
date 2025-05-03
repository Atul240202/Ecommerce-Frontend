import { Link } from "react-router-dom";
import type { Blog } from "../../services/blogService";

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const formattedDate = new Date(blog.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="group">
      <Link to={`/blog/${blog.slug}`} className="block">
        <div className="relative aspect-[4/3] mb-4 rounded-lg overflow-hidden">
          <img
            src={
              blog.thumbnail ||
              "https://dummyimage.com/600x400/000/bfb8bf&text=Alt+Image"
            }
            alt={blog.title}
            className="
              w-full h-full 
              object-cover 
              group-hover:scale-105 
              transition-transform 
              duration-300
            "
          />
        </div>
        <div>
          <div className="mb-2">
            {blog.tags &&
              blog.tags.slice(0, 1).map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded"
                >
                  {tag}
                </span>
              ))}
          </div>
          <h3 className="font-semibold text-lg mb-2 group-hover:text-[#4280ef] transition-colors">
            {blog.title}
          </h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>{formattedDate}</span>
          </div>
        </div>
      </Link>
    </div>
  );
}
