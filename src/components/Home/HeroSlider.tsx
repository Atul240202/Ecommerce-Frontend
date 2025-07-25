import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";

interface SliderItem {
  image: string;
  href: string;
}

interface HeroSliderProps {
  slides: SliderItem[];
}

export function HeroSlider({ slides }: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative w-full aspect-[3/1] sm:aspect-[4/1] md:aspect-[5/2] lg:aspect-[16/5] overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 w-full h-full transition-opacity duration-500 ${
            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
          }`}
        >
          <Link href={slide.href}>
            <img
              src={slide.image || "/placeholder.svg"}
              alt="Promotional banner"
              className="w-full h-full object-cover"
            />
          </Link>
        </div>
      ))}

      <Button
        variant="ghost"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-20 p-1 sm:p-2"
        onClick={prevSlide}
      >
        <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>
      <Button
        variant="ghost"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white z-20 p-1 sm:p-2"
        onClick={nextSlide}
      >
        <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
      </Button>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentSlide ? "bg-primary" : "bg-gray-300"
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}
