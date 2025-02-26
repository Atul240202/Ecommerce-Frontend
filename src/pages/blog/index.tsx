import { useState, useEffect } from 'react';
import { MainLayout } from '@/layouts/MainLayout';
import { BlogCard } from '@/components/Blogs/BlogCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

const ITEMS_PER_PAGE = 12;

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

export default function BlogPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const res = await fetch('/tempData/blog.json');
      const data = await res.json();
      // Sort blogs by date, newest first
      const sortedBlogs = data.blogs.sort(
        (a: Blog, b: Blog) =>
          new Date(b.createdDateTime).getTime() -
          new Date(a.createdDateTime).getTime()
      );
      setBlogs(sortedBlogs);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    }
    setIsLoading(false);
  };

  const totalPages = Math.ceil(blogs.length / ITEMS_PER_PAGE);
  const currentBlogs = blogs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  if (isLoading) {
    return (
      <MainLayout>
        <div className='container mx-auto px-4 py-16'>
          <div className='flex justify-center'>
            <Loader2 className='h-8 w-8 animate-spin' />
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className='container mx-auto px-24 py-8'>
        <div className='flex items-center justify-between mb-8'>
          <h1 className='text-4xl font-bold'>BLOGS</h1>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'>
          {currentBlogs.map((blog) => (
            <BlogCard key={blog.id} blog={blog} />
          ))}
        </div>

        {totalPages > 1 && (
          <div className='flex justify-center gap-2 mt-8'>
            <Button
              variant='outline'
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={currentPage === i + 1 ? 'default' : 'outline'}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
            <Button
              variant='outline'
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
