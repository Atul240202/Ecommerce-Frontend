import { useState, useEffect } from 'react';

interface Brand {
  name: string;
  image: string;
  keyword: string;
}

export function BrandSlider() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    const fetchBrands = async () => {
      try {
        const response = await fetch('/tempData/brand.json');
        if (!response.ok) throw new Error('Failed to fetch brands');
        const data: Brand[] = await response.json();
        setBrands(data);
      } catch (error) {
        console.error('Error fetching brands:', error);
      }
    };

    fetchBrands();
  }, []);

  return (
    <div className="relative w-full overflow-hidden">
      <div className="flex w-max animate-marquee whitespace-nowrap">
        {/* Original List */}
        {brands.concat(brands).map((brand, index) => (
          <div
            key={`${brand.name}-${index}`}
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
