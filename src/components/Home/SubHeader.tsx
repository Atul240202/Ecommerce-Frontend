import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronRight, Menu, X } from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import {
  fetchProductCategories,
  type ProductCategory,
} from "../../services/api";

interface CategoryGroup {
  name: string;
  slug: string;
  subcategories: {
    name: string;
    slug: string;
  }[];
}

export function SubHeader() {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getCategories = async () => {
      try {
        const data = await fetchProductCategories();

        const mainCategories = data
          .filter((cat: ProductCategory) => cat.parent === 0)
          .slice(0, 15);
        const groups: CategoryGroup[] = [];

        mainCategories.forEach((mainCat: ProductCategory) => {
          const subcategories = data
            .filter((subCat: ProductCategory) => subCat.parent === mainCat.id)
            .slice(0, 5)
            .map((subCat: ProductCategory) => ({
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
        console.error("Failed to fetch categories:", error);
      } finally {
        setLoading(false);
      }
    };

    getCategories();
  }, []);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🔹 Split categories into 6 columns
  const columnCount = 7;
  const columnGroups: CategoryGroup[][] = [];
  categoryGroups.forEach((group, index) => {
    const columnIndex = index % columnCount;
    if (!columnGroups[columnIndex]) columnGroups[columnIndex] = [];
    columnGroups[columnIndex].push(group);
  });

  return (
    <nav className="border-b-2 bg-white ">
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/** 📌 Mobile Navigation **/}
        {isMobile ? (
          <>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>

            {/** 📌 Mobile Menu Drawer **/}
            {mobileMenuOpen && (
              <div className="absolute top-28 left-0 w-full bg-white border-r shadow-md z-50 p-6 overflow-y-auto">
                <div className="flex justify-between items-center pb-4 border-b">
                  <span className="text-lg font-semibold">Menu</span>
                  <button onClick={() => setMobileMenuOpen(false)}>
                    <X className="h-6 w-6 text-gray-600" />
                  </button>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                  <Link to="/categories" className="py-2 hover:text-[#4280ef]">
                    Shop by Categories
                  </Link>
                  <Link to="/" className="py-2 hover:text-[#4280ef]">
                    Home
                  </Link>
                  <Link to="/brand" className="py-2 hover:text-[#4280ef]">
                    Shop by Brand
                  </Link>
                  <Link to="/bestseller" className="py-2 hover:text-[#4280ef]">
                    Best Sellers
                  </Link>
                  <Link to="/blog" className="py-2 hover:text-[#4280ef]">
                    Blog
                  </Link>
                  <Link to="/about-us" className="py-2 hover:text-[#4280ef]">
                    About Us
                  </Link>
                  <Link to="/contact" className="py-2 hover:text-[#4280ef]">
                    Contact Us
                  </Link>
                </div>
              </div>
            )}
          </>
        ) : (
          /** 📌 Desktop Navigation **/
          <div className="flex items-center gap-6 text-sm py-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="h-12 gap-2 hover:bg-[#D2EEFF]"
                >
                  Shop By Categories
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[80vw] p-4 max-h-[70vh] overflow-y-auto"
                side="bottom"
                align="start"
              >
                {loading ? (
                  <div className="text-center py-4">Loading categories...</div>
                ) : (
                  <>
                    <div className="grid grid-cols-7 gap-6">
                      {columnGroups.map((column, colIndex) => (
                        <div key={colIndex} className="space-y-4">
                          {column.map((group, groupIndex) => (
                            <div key={groupIndex} className="mb-4">
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/categories/${group.slug}`}
                                  className="font-bold text-base uppercase"
                                >
                                  {group.name}
                                </Link>
                              </DropdownMenuItem>
                              <div className="space-y-2 pl-2 mt-2">
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
                                  className="text-[#4280ef]"
                                >
                                  <Link
                                    to={`/categories/${group.slug}`}
                                    className="flex items-center"
                                  >
                                    View All{" "}
                                    <ChevronRight className="h-4 w-4 ml-1" />
                                  </Link>
                                </DropdownMenuItem>
                              </div>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>

                    {/* View All Categories Button */}

                    <div className="border-t pt-4 mt-4 w-full text-center">
                      <Link
                        to="/categories"
                        className="block w-full py-3 bg-gray-100 text-gray-800 font-semibold hover:bg-gray-200"
                      >
                        View All Categories
                      </Link>
                    </div>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              to="/"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              Home
            </Link>
            <Link
              to="/brand"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              Shop by Brand
            </Link>
            <Link
              to="/bestseller"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              Best Sellers
            </Link>
            <Link
              to="/blog"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              Blog
            </Link>
            <Link
              to="/about-us"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              About us
            </Link>
            <Link
              to="/contact"
              className="h-12 flex items-center hover:text-[#4280ef]"
            >
              Contact us
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
