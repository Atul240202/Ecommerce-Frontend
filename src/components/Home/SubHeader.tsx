import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { fetchProductCategories, type ProductCategory } from '@/services/api';

// Define interfaces for our category structure
interface CategoryGroup {
  name: string;
  slug: string;
  subcategories: {
    name: string;
    slug: string;
  }[];
}

export function SubHeader() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(data);

        // Process categories into groups
        const mainCategories = data.filter((cat) => cat.parent === 0);
        const groups: CategoryGroup[] = [];

        mainCategories.forEach((mainCat) => {
          const subcategories = data
            .filter((subCat) => subCat.parent === mainCat.id)
            .map((subCat) => ({
              name: subCat.name,
              slug: subCat.slug,
            }));

          groups.push({
            name: mainCat.name,
            slug: mainCat.slug,
            subcategories,
          });
        });

        setCategoryGroups(groups);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  // Function to chunk the category groups into columns
  const chunkCategoryGroups = (groups: CategoryGroup[], size: number) => {
    const chunkedGroups = [];
    for (let i = 0; i < groups.length; i += size) {
      chunkedGroups.push(groups.slice(i, i + size));
    }
    return chunkedGroups;
  };

  // Split category groups into columns
  const columnGroups = chunkCategoryGroups(
    categoryGroups,
    Math.ceil(categoryGroups.length / 6)
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className='border-b bg-white'>
      <div className='container mx-auto px-4'>
        {isMobile ? (
          <div></div>
        ) : (
          <div className='flex items-center gap-6 text-sm'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' className='h-12 gap-2'>
                  Shop By Categories
                  <ChevronDown className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className='w-[70vw] p-4 max-h-[70vh] overflow-y-auto'
                sideOffset={0}
                align='start'
                alignOffset={0}
                side='bottom'
              >
                {loading ? (
                  <div className='text-center py-4'>Loading categories...</div>
                ) : (
                  <div className='grid grid-cols-6 gap-6'>
                    {columnGroups.map((column, colIndex) => (
                      <div key={colIndex} className='space-y-4'>
                        {column.map((group, groupIndex) => (
                          <div key={groupIndex} className='mb-4'>
                            <DropdownMenuItem asChild>
                              <Link
                                to={`/categories/${group.slug}`}
                                className='font-bold text-base uppercase'
                              >
                                {group.name}
                              </Link>
                            </DropdownMenuItem>
                            <div className='space-y-2 pl-2 mt-2'>
                              {group.subcategories.map(
                                (subcat, subcatIndex) => (
                                  <DropdownMenuItem key={subcatIndex} asChild>
                                    <Link to={`/categories/${subcat.slug}`}>
                                      {subcat.name}
                                    </Link>
                                  </DropdownMenuItem>
                                )
                              )}
                              <DropdownMenuItem
                                asChild
                                className='flex items-center text-[#4280ef]'
                              >
                                <Link
                                  to={`/categories/${group.slug}`}
                                  className='flex items-center'
                                >
                                  View All{' '}
                                  <ChevronRight className='h-4 w-4 ml-1' />
                                </Link>
                              </DropdownMenuItem>
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to='/'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              Home
            </Link>
            <Link
              to='/categories'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              Shop by Department
            </Link>
            <Link
              to='/bestseller'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              Best Sellers
            </Link>
            <Link
              to='/blog'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              Blog
            </Link>
            <Link
              to='/about-us'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              About us
            </Link>
            <Link
              to='/contact'
              className='h-12 flex items-center hover:text-[#4280ef]'
            >
              Contact us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
