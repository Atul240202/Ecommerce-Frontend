import { useState, useEffect } from 'react';

interface Brand {
  name: string;
  image: string;
  keyword: string;
}
export function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [sliderWidth, setSliderWidth] = useState(0);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/tempData/brand.json');
        if (!response.ok) {
          throw new Error('Failed to fetch brands');
        }
        const data: Brand[] = await response.json();
        setBrands(data);
        // Calculate slider width based on the number of brands
        setSliderWidth(data.length * 220); // Adjust 150px as needed for each brand
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex animate-brand-scroll"
        style={{
          width: `${sliderWidth}px`,
        }}
      >
        {brands.map((brand) => (
          <div
            key={brand.name}
            className="flex items-center justify-center w-[220px] px-4 py-2"
          >
            <img
              src={brand.image || '/placeholder.svg'}
              alt={brand.name}
              width={160}
              height={80}
              className="object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
