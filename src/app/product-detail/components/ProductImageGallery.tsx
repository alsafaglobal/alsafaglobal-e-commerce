'use client';

import React, { useState, useEffect } from 'react';
import AppImage from '@/components/ui/AppImage';

interface ProductImageGalleryProps {
  images: Array<{ url: string; alt: string }>;
  productName: string;
}

const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  productName,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  if (!isHydrated) {
    return (
      <div className="w-full">
        <div className="aspect-square w-full overflow-hidden rounded-lg bg-muted">
          <div className="h-full w-full animate-pulse bg-muted" />
        </div>
        <div className="mt-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="aspect-square overflow-hidden rounded-md bg-muted"
            >
              <div className="h-full w-full animate-pulse bg-muted" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="aspect-square w-full overflow-hidden rounded-lg bg-card shadow-luxury">
        <AppImage
          src={images[selectedImageIndex].url}
          alt={images[selectedImageIndex].alt}
          className="h-full w-full object-cover transition-luxury hover:scale-105"
        />
      </div>

      <div className="mt-4 grid grid-cols-4 gap-2">
        {images.map((image, index) => (
          <button
            key={index}
            onClick={() => setSelectedImageIndex(index)}
            className={`aspect-square overflow-hidden rounded-md transition-luxury ${
              selectedImageIndex === index
                ? 'ring-2 ring-accent' :'ring-1 ring-border hover:ring-2 hover:ring-primary'
            }`}
          >
            <AppImage
              src={image.url}
              alt={image.alt}
              className="h-full w-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductImageGallery;