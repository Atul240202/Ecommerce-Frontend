import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumb } from '../../components/Breadcrumb';
import {
  fetchProductCategories,
  type ProductCategory,
} from '../../services/api';
import { MainLayout } from '../../layouts/MainLayout';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useMediaQuery } from '../../hooks/use-media-query';

interface CategoryGroup {
  id: number;
  name: string;
  slug: string;
  subcategories: {
    id: number;
    name: string;
    slug: string;
  }[];
}

export default function CategoriesPage() {
  const [loading, setLoading] = useState(true);
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [selectedCategory, setSelectedCategory] =
    useState<CategoryGroup | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null);
  const subcategoryRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 1023px)');

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();

        const mainCategories = data.filter(
          (cat: ProductCategory) => cat.parent === 0
        );
        const groups: CategoryGroup[] = [];

        mainCategories.forEach((mainCat: ProductCategory) => {
          const subcategories = data
            .filter((subCat: ProductCategory) => subCat.parent === mainCat.id)
            .map((subCat: ProductCategory) => ({
              id: subCat.id,
              name: subCat.name,
              slug: subCat.slug,
            }));

          groups.push({
            id: mainCat.id,
            name: mainCat.name,
            slug: mainCat.slug,
            subcategories,
          });
        });

        setCategoryGroups(groups);

        // Set the first category as selected by default
        if (groups.length > 0) {
          setSelectedCategory(groups[0]);
          if (isMobile) {
            setExpandedCategory(groups[0].id);
          }
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, [isMobile]);

  const handleCategorySelect = (category: CategoryGroup) => {
    setSelectedCategory(category);

    // On mobile, toggle the expanded state
    if (isMobile) {
      setExpandedCategory((prev) =>
        prev === category.id ? null : category.id
      );
    }

    // On desktop, scroll the subcategory section into view if needed
    if (!isMobile && subcategoryRef.current) {
      subcategoryRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
      });
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto py-10 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#4280ef]"></div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto py-6 px-4">
        <Breadcrumb
          items={[
            { label: 'Home', href: '/' },
            { label: 'All Categories', href: '/categories' },
          ]}
        />

        <h1 className="text-2xl font-bold mt-4 mb-6">Browse Categories</h1>

        {/* Desktop Layout */}
        {!isMobile && (
          <div className="hidden lg:grid lg:grid-cols-[280px_1fr] gap-6 mt-6">
            {/* Category Sidebar */}
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#1a3352] text-white p-4 font-medium text-lg">
                FILTER BY CATEGORY
              </div>
              <div className="divide-y max-h-[600px] overflow-y-auto">
                {categoryGroups.map((category) => (
                  <div key={category.slug} className="flex flex-col">
                    <button
                      onClick={() => handleCategorySelect(category)}
                      className={`w-full text-left p-4 hover:bg-gray-100 transition-colors flex justify-between items-center ${
                        selectedCategory?.slug === category.slug
                          ? 'bg-[#f0f8f4] font-medium'
                          : ''
                      }`}
                    >
                      {category.name}
                      {category.subcategories.length > 0 && (
                        <span className="text-xs text-gray-500">
                          ({category.subcategories.length})
                        </span>
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Sticky Subcategory Content */}
            <div
              ref={subcategoryRef}
              className="sticky top-4 self-start border rounded-lg overflow-hidden"
            >
              {selectedCategory && (
                <div className="bg-[#4280ef] text-white p-4 font-medium">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg">{selectedCategory.name}</h2>
                    <Link
                      to={`/categories/${selectedCategory.slug}`}
                      className="text-sm bg-white text-[#4280ef] px-3 py-1 rounded hover:bg-gray-100"
                    >
                      View All Products
                    </Link>
                  </div>
                </div>
              )}

              <div className="p-4 max-h-[calc(100vh-200px)] overflow-y-auto">
                {selectedCategory &&
                selectedCategory.subcategories.length > 0 ? (
                  <div>
                    <h3 className="text-lg font-semibold mb-4 text-[#4280ef] border-b pb-2">
                      {selectedCategory.name} Subcategories
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3">
                      {selectedCategory.subcategories.map((subcategory) => (
                        <Link
                          key={subcategory.slug}
                          to={`/categories/${subcategory.slug}`}
                          className="py-2 px-3 border rounded-md hover:bg-gray-50 transition-colors text-sm hover:text-[#4280ef] hover:border-[#4280ef]"
                        >
                          {subcategory.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  selectedCategory && (
                    <div className="text-center py-8">
                      <p className="text-gray-500">
                        No subcategories found for {selectedCategory.name}.
                      </p>
                      <Link
                        to={`/categories/${selectedCategory.slug}`}
                        className="mt-4 inline-block bg-[#4280ef] text-white px-4 py-2 rounded hover:bg-[#3270df]"
                      >
                        Browse {selectedCategory.name} Products
                      </Link>
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile Layout */}
        {isMobile && (
          <div className="lg:hidden mt-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="bg-[#1a3352] text-white p-4 font-medium text-lg">
                CATEGORIES
              </div>
              <div className="divide-y">
                {categoryGroups.map((category) => (
                  <div key={category.slug} className="flex flex-col">
                    <div className="border-b">
                      <button
                        onClick={() => handleCategorySelect(category)}
                        className={`w-full text-left p-4 hover:bg-gray-100 transition-colors flex justify-between items-center ${
                          expandedCategory === category.id
                            ? 'bg-[#f0f8f4] font-medium'
                            : ''
                        }`}
                      >
                        <div className="flex items-center justify-between w-full">
                          <Link
                            to={`/categories/${category.slug}`}
                            className="hover:text-[#4280ef]"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {category.name}
                          </Link>
                          <div className="flex items-center">
                            {category.subcategories.length > 0 && (
                              <span className="text-xs text-gray-500 mr-2">
                                ({category.subcategories.length})
                              </span>
                            )}
                            {category.subcategories.length > 0 &&
                              (expandedCategory === category.id ? (
                                <ChevronUp className="h-4 w-4 text-gray-500" />
                              ) : (
                                <ChevronDown className="h-4 w-4 text-gray-500" />
                              ))}
                          </div>
                        </div>
                      </button>
                    </div>

                    {/* Expandable Subcategories Section */}
                    {category.subcategories.length > 0 &&
                      expandedCategory === category.id && (
                        <div className="bg-gray-50 p-3 overflow-y-auto max-h-[500px]">
                          <div className="grid grid-cols-2 gap-2">
                            {category.subcategories.map((subcategory) => (
                              <Link
                                key={subcategory.slug}
                                to={`/categories/${subcategory.slug}`}
                                className="py-2 px-3 bg-white border rounded-md hover:bg-gray-50 transition-colors text-sm hover:text-[#4280ef] hover:border-[#4280ef]"
                              >
                                {subcategory.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
