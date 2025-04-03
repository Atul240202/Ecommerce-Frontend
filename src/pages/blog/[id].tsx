import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import {
  Loader2,
  Facebook,
  Twitter,
  Linkedin,
  Mail,
  LinkIcon,
} from 'lucide-react';
import { MainLayout } from '../../layouts/MainLayout';
import { Breadcrumb } from '../../components/Breadcrumb';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { BlogCard } from '../../components/Blogs/BlogCard';
import { toast } from '../../components/ui/use-toast';

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

export default function BlogPostPage() {
  const { id } = useParams();
  const location = useLocation();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  useEffect(() => {
    fetchBlog();
  }, []);

  const fetchBlog = async () => {
    try {
      const res = await fetch('/tempData/blog.json');
      const data = await res.json();
      const foundBlog = data.blogs.find((b: Blog) => b.id === Number(id));
      setBlog(foundBlog || null);

      // Get related blogs with same tags
      if (foundBlog) {
        const related = data.blogs
          .filter(
            (b: Blog) =>
              b.id !== Number(id) &&
              b.tags.some((tag: string) => foundBlog.tags.includes(tag))
          )
          .slice(0, 4);
        setRelatedBlogs(related);
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
    }
    setIsLoading(false);
  };

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this to your backend
    // Reset form
    setComment('');
    setName('');
    setEmail('');
    // Show success message
    alert('Comment submitted successfully!');
  };

  const shareUrl = `${window.location.origin}${location.pathname}`;
  const shareTitle = blog ? blog.title : 'Check out this blog post';

  const handleShare = async (platform: string) => {
    if (navigator.share && (platform === 'native' || platform === 'copy')) {
      try {
        await navigator.share({
          title: shareTitle,
          url: shareUrl,
        });
        toast({
          title: 'Shared successfully',
          description: 'The blog post has been shared.',
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      let url = '';
      switch (platform) {
        case 'facebook':
          url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            shareUrl
          )}`;
          break;
        case 'twitter':
          url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            shareUrl
          )}&text=${encodeURIComponent(shareTitle)}`;
          break;
        case 'linkedin':
          url = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
            shareUrl
          )}&title=${encodeURIComponent(shareTitle)}`;
          break;
        case 'email':
          url = `mailto:?subject=${encodeURIComponent(
            shareTitle
          )}&body=${encodeURIComponent(shareUrl)}`;
          break;
        case 'copy':
          navigator.clipboard
            .writeText(shareUrl)
            .then(() => {
              toast({
                title: 'Link copied',
                description:
                  'The blog post link has been copied to your clipboard.',
              });
            })
            .catch((error) => {
              console.error('Error copying link:', error);
            });
          return;
      }
      if (url) window.open(url, '_blank');
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

  if (!blog) {
    return (
      <MainLayout>
        <div className="container mx-auto px-4 py-16">
          <h1 className="text-2xl font-bold">Blog post not found</h1>
        </div>
      </MainLayout>
    );
  }

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
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'Blog', href: '/blog' },
            { label: blog.title, href: '#' },
          ]}
        />

        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <div className="mb-4">
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-2 py-1 text-xs font-medium bg-blue-50 text-blue-600 rounded"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h1 className="text-3xl font-bold mb-6 text-gray-800">
              {blog.title}
            </h1>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src="/placeholder.svg?height=40&width=40"
                  alt="Author"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">By Sugar Rosie</span>
                  <span className="text-sm text-gray-500">{formattedDate}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {readTime} Mins read
                </div>
              </div>
            </div>
          </header>

          <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <img
              src={
                blog.insidePageImage ||
                blog.thumbnail ||
                'https://dummyimage.com/600x400/000/bfb8bf&text=Alt+Image'
              }
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="prose max-w-none mb-8">
            {blog.content.map((paragraph, index) => (
              <p key={index} className="mb-4 text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="flex items-center justify-end gap-2 mb-8">
            <span className="text-sm text-gray-600">Share:</span>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('facebook')}
            >
              <Facebook className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('twitter')}
            >
              <Twitter className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('linkedin')}
            >
              <Linkedin className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('email')}
            >
              <Mail className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full"
              onClick={() => handleShare('copy')}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>

          <div className="border-t pt-8 mb-12">
            <h3 className="text-xl font-semibold mb-4">Leave a comment</h3>
            <form onSubmit={handleSubmitComment}>
              <Textarea
                placeholder="Write comment"
                className="mb-4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <Input
                  placeholder="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="bg-[#4280ef] hover:bg-[#425a8b]">
                Post Comment
              </Button>
            </form>
          </div>
        </article>

        {relatedBlogs.length > 0 && (
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-6">Related Blogs</h2>
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedBlogs.map((relatedBlog) => (
                <BlogCard key={relatedBlog.id} blog={relatedBlog} />
              ))}
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
