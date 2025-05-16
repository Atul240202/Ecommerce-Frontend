import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Brand {
  name: string;
  image: string;
  keyword: string;
}

export const BrandSubheader = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    fetch("/tempData/homeBrand.json")
      .then((res) => res.json())
      .then((data: Brand[]) => {
        setBrands(data);
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
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
  }, [brands]);

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
          className="flex justify-between gap-4 overflow-x-auto scrollbar-hide scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {brands.map((brand, index) => (
            <Link
              key={index}
              href={`/brand/${brand.keyword}`}
              className="flex flex-col justify-center items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
            >
              <div
                className={`flex items-center justify-center overflow-hidden ${
                  isMobile ? "w-10 h-10" : "w-18 h-18"
                }`}
              >
                <img
                  src={brand.image || "/placeholder.svg"}
                  alt={brand.name}
                  width={80}
                  height={80}
                  className="object-contain"
                />
              </div>

              {/* <span>{brand.name}</span> */}
            </Link>
          ))}
          <Link
            href={`/brand/`}
            className="flex flex-col justify-center items-center px-4 py-2 text-sm text-gray-700 hover:text-blue-600 whitespace-nowrap"
          >
            <div className="text-md-center font-bold">Explore All Brand's</div>
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

export default BrandSubheader;
