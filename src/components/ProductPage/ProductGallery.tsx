import { useState } from 'react';
import Image from 'next/image';

interface ProductGalleryProps {
  images: string[];
  thumbnail: string;
}

export function ProductGallery({ images, thumbnail }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const allImages = [thumbnail, ...images];

  return (
    <div className='flex gap-4'>
      {/* Thumbnails */}
      <div className='flex flex-col gap-2'>
        {allImages.map((image, index) => (
          <button
            key={index}
            className={`border-2 rounded-lg overflow-hidden w-20 h-20 ${
              selectedImage === index ? 'border-primary' : 'border-gray-200'
            }`}
            onClick={() => setSelectedImage(index)}
          >
            <img
              src={image || '/placeholder.svg'}
              alt={`Product view ${index + 1}`}
              width={80}
              height={80}
              className='object-cover w-full h-full'
            />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div className='flex-1 relative aspect-square rounded-lg overflow-hidden border border-gray-200'>
        <img
          src={allImages[selectedImage] || '/placeholder.svg'}
          alt='Product main view'
          // layout='fill'
          // objectFit='contain'
          className='w-full h-full'
        />
      </div>
    </div>
  );
}
