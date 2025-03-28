import { useEffect, useState } from 'react';
import Link from 'next/link';
import { MainLayout } from '../layouts/MainLayout';
import { HeroSlider } from '../components/Home/HeroSlider';
import { ProductGrid } from '../components/Home/ProductGrid';
import { FeaturedProducts } from '../components/Home/FeaturedProducts';
import { FeaturedSection } from '../components/Home/FeaturedSection';
import { BlogCard } from '../components/Blogs/BlogCard';
import {
  fetchFeaturedProducts,
  fetchBestSellerProducts,
} from '../services/api';

interface Product {
  id: number;
  title: string;
  brand: string;
  thumbnail: string;
  price: number;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  rating: number;
}

interface Blog {
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

export default function HomePage() {
  const [promotions, setPromotions] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [bestSellerProducts, setBestSellerProducts] = useState<Product[]>([]);
  const [latestBlogs, setLatestBlogs] = useState<Blog[]>([]);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {
    // Fetch promotions
    fetch('/tempData/promotion.json')
      .then((res) => res.json())
      .then((data) => setPromotions(data.promotion));

    // Fetch categories
    fetch('/tempData/categories.json')
      .then((res) => res.json())
      .then((data) => setCategories(data.categories));
    // Fetch products
    // fetch('https://dummyjson.com/products?limit=20')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     // Randomly assign products to featured and bestseller for now
    //     const shuffled = [...data.products].sort(() => 0.5 - Math.random());
    //     setFeaturedProducts(shuffled.slice(0, 10));
    //     setBestSellerProducts(shuffled.slice(10, 20));
    //   });

    const fetchProducts = async () => {
      try {
        const featured = await fetchFeaturedProducts(10);
        setFeaturedProducts(featured);

        const bestsellers = await fetchBestSellerProducts(10);
        setBestSellerProducts(bestsellers);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    // Fetch blogs
    fetch('/tempData/blog.json')
      .then((res) => res.json())
      .then((data) => {
        // Sort blogs by createdDateTime, newest first
        const sortedBlogs = data.blogs.sort(
          (a: Blog, b: Blog) =>
            new Date(b.createdDateTime).getTime() -
            new Date(a.createdDateTime).getTime()
        );
        // Get the 5 latest blogs
        setLatestBlogs(sortedBlogs.slice(0, 5));
      });
  }, []);

  if (!promotions || !categories.length || !featuredProducts.length) {
    return <div></div>;
  }

  return (
    <MainLayout>
      <div className='mx-auto'>
        {/* <CategorySubheader /> */}

        <HeroSlider slides={promotions.slider} />
        <div className='container mx-auto'>
          <ProductGrid
            featuredProducts={featuredProducts}
            bestSellerProducts={bestSellerProducts}
          />

          {promotions.mid_banner && promotions.mid_banner.length > 0 && (
            <div
              className={`flex gap-4 justify-center  ${
                isMobile ? 'my-2' : 'my-8'
              }`}
            >
              {promotions.mid_banner.map((banner: any, index: number) => (
                <Link key={index} href={banner.href}>
                  <img
                    src={banner.image || '/placeholder.svg'}
                    alt={`Mid Banner ${index + 1}`}
                    className='max-w-[45vw] max-h-[30vh]'
                  />
                </Link>
              ))}
            </div>
          )}

          <FeaturedProducts />

          {promotions.mini_banner && (
            <Link
              href={promotions.mini_banner.href}
              className='flex justify-center my-8'
            >
              <img
                src={promotions.mini_banner.image || '/placeholder.svg'}
                alt='Promotional banner'
                className='w-full max-w-[70vw] max-h-[20vh]'
              />
            </Link>
          )}

          <FeaturedSection />

          {promotions.footer_banner && promotions.footer_banner.length > 0 && (
            <div className='my-2 flex gap-4 justify-center'>
              {promotions.footer_banner.map((banner: any, index: number) => (
                <Link key={index} href={banner.href}>
                  <img
                    src={banner.image || '/placeholder.svg'}
                    alt={`Footer Banner ${index + 1}`}
                    className='max-w-[35vw] max-h-[30vh] h-fit'
                  />
                </Link>
              ))}
            </div>
          )}

          {/* Latest Blogs Section */}
          <section className='container my-12 px-4'>
            <h2 className='text-2xl font-bold mb-6'>Latest from Our Blog</h2>
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-6'>
              {latestBlogs.map((blog) => (
                <BlogCard key={blog.id} blog={blog} />
              ))}
            </div>
            <div className='text-center mt-8'>
              <Link
                href='/blog'
                className='text-blue-600 hover:text-blue-800 font-semibold'
              >
                View All Blog Posts
              </Link>
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  );
}
