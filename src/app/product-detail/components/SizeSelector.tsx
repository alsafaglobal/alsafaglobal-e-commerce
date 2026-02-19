'use client';

import React, { useState, useEffect } from 'react';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface Size {
  volume: string;
  price: number;
}

interface SizeSelectorProps {
  sizes: Size[];
  onSizeChange: (size: Size) => void;
}

const SizeSelector: React.FC<SizeSelectorProps> = ({
  sizes,
  onSizeChange,
}) => {
  const [selectedSize, setSelectedSize] = useState<Size>(sizes[0]);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onSizeChange(selectedSize);
    }
  }, [selectedSize, onSizeChange, isHydrated]);

  if (!isHydrated) {
    return (
      <div className="space-y-3">
        <p className="caption font-medium text-text-secondary">{useSiteContent('product_label_select_size', 'Select Size')}</p>
        <div className="grid grid-cols-2 gap-3">
          {sizes.map((size, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-md bg-muted"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="caption font-medium text-text-secondary">Select Size</p>
      <div className="grid grid-cols-2 gap-3">
        {sizes.map((size, index) => (
          <button
            key={index}
            onClick={() => setSelectedSize(size)}
            className={`rounded-md border-2 p-4 text-center transition-luxury ${
              selectedSize.volume === size.volume
                ? 'border-accent bg-accent/10' :'border-border bg-card hover:border-primary'
            }`}
          >
            <p className="font-body font-medium text-text-primary">
              {size.volume}
            </p>
            <p className="caption mt-1 text-text-secondary">
              ${size.price.toFixed(2)}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SizeSelector;