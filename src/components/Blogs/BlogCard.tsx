import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export interface Blog {
  id: number;
  title: string;
  thumbnail: string;
  subTitle: string;
  content: string[];
  tags: string[];
  priorityStatus: 'High' | 'Medium' | 'Low';
  createdDateTime: string;
  insidePageImage: string;
}

interface BlogCardProps {
  blog: Blog;
}

export function BlogCard({ blog }: BlogCardProps) {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const formattedDate = new Date(blog.createdDateTime).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }
  );
  const readTime = Math.ceil(blog.content.join(' ').split(' ').length / 200);

  return (
    <div className='group border container border-gray-200 shadow-md rounded-lg overflow-hidden transition-shadow hover:shadow-lg'>
      <Link to={`/blog/${blog.id}`} className='block'>
        <div className='relative aspect-[4/3] mb-4 overflow-hidden rounded-t-lg'>
          <img
            src={
              blog.thumbnail ||
              'https://dummyimage.com/600x400/000/bfb8bf&text=Alt+Image'
            }
            alt={blog.title}
            className='group-hover:scale-105 transition-transform duration-300 w-full h-full object-cover'
          />
        </div>
        <div className={` ${isMobile ? 'p-1' : 'p-4'}`}>
          <div className='mb-2'>
            {blog.tags.slice(0, 1).map((tag) => (
              <span
                key={tag}
                className='inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded'
              >
                {tag}
              </span>
            ))}
          </div>
          <h3
            className={`font-semibold group-hover:text-[#4280ef] transition-colors ${
              isMobile ? 'text-sm mb-1' : 'text-lg mb-2'
            }`}
          >
            {blog.title}
          </h3>
          {isMobile ? (
            <></>
          ) : (
            <div className='flex items-center text-sm text-gray-500'>
              <span>{formattedDate}</span>
              <span className='mx-2'>•</span>
              <span>{readTime} mins read</span>
            </div>
          )}
        </div>
      </Link>
    </div>
  );
}
