import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, ChevronRight, Menu, X } from 'lucide-react';
import { Button } from '../../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../components/ui/dropdown-menu';
import {
  fetchProductCategories,
  type ProductCategory,
} from '../../services/api';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();
        setCategories(data);

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

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className='border-b bg-white'>
      <div className='container mx-auto px-4 flex items-center justify-between'>
        {/** 📌 Mobile: Hamburger Menu **/}
        {isMobile ? (
          <>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className='p-2'
            >
              {mobileMenuOpen ? (
                <X className='h-6 w-6' />
              ) : (
                <Menu className='h-6 w-6' />
              )}
            </button>

            {/** 📌 Mobile Menu Drawer **/}
            {mobileMenuOpen && (
              <div className='absolute top-28 left-0 w-full bg-white border-r shadow-md z-50 p-6 overflow-y-auto'>
                {/** Close Button for Mobile Menu **/}
                <div className='flex justify-between items-center pb-4 border-b'>
                  <span className='text-lg font-semibold'>Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className='h-6 w-6 text-gray-600' />
                  </button>
                </div>

                <div className='flex flex-col gap-4 mt-4'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant='ghost'
                        className='w-full flex justify-between'
                      >
                        Shop By Categories
                        <ChevronDown className='h-4 w-4' />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className='w-full p-4 max-h-[60vh] overflow-y-auto'>
                      {loading ? (
                        <div className='text-center py-4'>
                          Loading categories...
                        </div>
                      ) : (
                        <div className='grid grid-cols-1 gap-x-4 gap-y-2'>
                          {categoryGroups.map((group, groupIndex) => (
                            <div key={groupIndex} className=''>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/categories/${group.slug}`}
                                  className='font-bold text-base uppercase'
                                >
                                  {group.name}
                                </Link>
                              </DropdownMenuItem>
                              <div className='pl-2 mt-2 space-y-1'>
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
                                  className='text-[#4280ef]'
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
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <Link to='/' className='py-2 hover:text-[#4280ef]'>
                    Home
                  </Link>
                  <Link to='/categories' className='py-2 hover:text-[#4280ef]'>
                    Shop by Department
                  </Link>
                  <Link to='/bestseller' className='py-2 hover:text-[#4280ef]'>
                    Best Sellers
                  </Link>
                  <Link to='/blog' className='py-2 hover:text-[#4280ef]'>
                    Blog
                  </Link>
                  <Link to='/about-us' className='py-2 hover:text-[#4280ef]'>
                    About Us
                  </Link>
                  <Link to='/contact' className='py-2 hover:text-[#4280ef]'>
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /** 📌 Desktop Navigation **/
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
                  <div className='grid grid-cols-6 gap-x-4 gap-y-3'>
                    {categoryGroups.map((group, groupIndex) => (
                      <div key={groupIndex} className=''>
                        <DropdownMenuItem asChild>
                          <Link
                            to={`/categories/${group.slug}`}
                            className='font-bold text-base uppercase'
                          >
                            {group.name}
                          </Link>
                        </DropdownMenuItem>
                        <div className='pl-2 mt-2 space-y-1'>
                          {group.subcategories.map((subcat, subcatIndex) => (
                            <DropdownMenuItem key={subcatIndex} asChild>
                              <Link to={`/categories/${subcat.slug}`}>
                                {subcat.name}
                              </Link>
                            </DropdownMenuItem>
                          ))}
                          <DropdownMenuItem asChild className='text-[#4280ef]'>
                            <Link
                              to={`/categories/${group.slug}`}
                              className='flex items-center'
                            >
                              View All <ChevronRight className='h-4 w-4 ml-1' />
                            </Link>
                          </DropdownMenuItem>
                        </div>
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
