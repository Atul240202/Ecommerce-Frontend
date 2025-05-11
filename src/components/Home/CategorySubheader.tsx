import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight, ChevronLeft } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

interface Subcategory {
  name: string;
  href: string;
}

interface Category {
  name: string;
  href: string;
  icon: string;
  subcategories: Subcategory[];
}

export const CategorySubheader = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [openDropdown, setOpenDropdown] = useState<number | null>(null); // Track which dropdown is open
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch("/tempData/categories.json")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data.categories);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const checkScroll = () => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } =
          scrollContainerRef.current;
        setShowLeftScroll(scrollLeft > 0);
        setShowRightScroll(scrollLeft < scrollWidth - clientWidth - 10);
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", checkScroll);
      checkScroll();
    }

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", checkScroll);
      }
    };
  }, [categories]);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  return (
    <nav className="relative bg-white border-b border-gray-200 z-40">
      <div className="container mx-auto relative">
        <div
          ref={scrollContainerRef}
          className="flex justify-between gap-4 overflow-x-auto border-0 scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              className="flex-shrink-0 relative"
              onMouseEnter={() => setOpenDropdown(index)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {category.subcategories.length > 0 ? (
                <>
                  <DropdownMenu open={openDropdown === index}>
                    <DropdownMenuTrigger asChild>
                      <button
                        className={`flex flex-col items-center px-4 py-2 ${
                          isMobile
                            ? "h-20 w-20 text-[0.75rem]"
                            : "h-auto w-28 text-sm"
                        } text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap bg-transparent border-0 cursor-pointer`}
                      >
                        <div
                          className={`mb-1 overflow-hidden  ${
                            isMobile ? "gap-2 w-10 h-10" : "w-18 h-18"
                          }`}
                        >
                          <img
                            src={category.icon || "/placeholder.svg"}
                            alt={category.name}
                            width={80}
                            height={80}
                            className="object-cover"
                          />
                        </div>
                        <div className="flex items-center">
                          <span>{category.name}</span>
                          <ChevronDown
                            className={`ml-1 h-3 w-3 transition-transform ${
                              openDropdown === index ? "rotate-180" : ""
                            }`}
                          />
                        </div>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56 z-50">
                      {/* Parent Category Link */}
                      <DropdownMenuItem asChild>
                        <Link
                          href={category.href}
                          className="font-semibold text-blue-600"
                        >
                          {category.name} →
                        </Link>
                      </DropdownMenuItem>

                      {/* Subcategories */}
                      {category.subcategories.map((subcategory, subIndex) => (
                        <DropdownMenuItem key={subIndex} asChild>
                          <Link
                            href={subcategory.href}
                            className="w-full cursor-pointer"
                          >
                            {subcategory.name}
                          </Link>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Link
                  href={category.href}
                  className="flex flex-col items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
                >
                  <div
                    className={`mb-1 overflow-hidden ${
                      isMobile ? "gap-2 w-10 h-10" : "w-18 h-18"
                    }`}
                  >
                    <img
                      src={category.icon || "/placeholder.svg"}
                      alt={category.name}
                      width={80}
                      height={80}
                      className="object-cover"
                    />
                  </div>
                  <span>{category.name}</span>
                </Link>
              )}
            </div>
          ))}
          <Link
            href={`/categories/`}
            className="flex flex-col justify-center items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
          >
            <div className="text-md-center font-bold">All Categories</div>
          </Link>
        </div>

        {showLeftScroll && (
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1 md:p-2"
            aria-label="Scroll left"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
        )}
        {showRightScroll && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 rounded-full shadow-md p-1 md:p-2"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        )}
      </div>
    </nav>
  );
};

export default CategorySubheader;
