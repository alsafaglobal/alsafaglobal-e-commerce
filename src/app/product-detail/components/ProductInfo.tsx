'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface ProductInfoProps {
  name: string;
  brand: string;
  price: number;
  rating: number;
  reviewCount: number;
  description: string;
  fragranceFamily: string;
  longevity: string;
  occasions: string[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  brand,
  price,
  rating,
  reviewCount,
  description,
  fragranceFamily,
  longevity,
  occasions,
}) => {
  const labelFragrance = useSiteContent('product_label_fragrance_family', 'Fragrance Family');
  const labelLongevity = useSiteContent('product_label_longevity', 'Longevity');
  const labelOccasions = useSiteContent('product_label_occasions', 'Recommended Occasions');

  return (
    <div className="space-y-6">
      <div>
        <p className="caption text-text-secondary">{brand}</p>
        <h1 className="mt-1 font-heading text-3xl font-semibold text-text-primary lg:text-4xl">
          {name}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Icon
              key={star}
              name="StarIcon"
              variant={star <= Math.floor(rating) ? 'solid' : 'outline'}
              size={20}
              className={
                star <= Math.floor(rating) ? 'text-accent' : 'text-muted'
              }
            />
          ))}
        </div>
        <span className="caption text-text-secondary">
          {rating} ({reviewCount} reviews)
        </span>
      </div>

      <div className="border-t border-border pt-6">
        <p className="font-heading text-3xl font-semibold text-primary">
          ${price.toFixed(2)}
        </p>
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <p className="font-body leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      <div className="grid gap-4 border-t border-border pt-6 sm:grid-cols-2">
        <div>
          <p className="caption font-medium text-text-secondary">
            {labelFragrance}
          </p>
          <p className="mt-1 font-body text-text-primary">{fragranceFamily}</p>
        </div>
        <div>
          <p className="caption font-medium text-text-secondary">{labelLongevity}</p>
          <p className="mt-1 font-body text-text-primary">{longevity}</p>
        </div>
      </div>

      <div className="border-t border-border pt-6">
        <p className="caption font-medium text-text-secondary">
          {labelOccasions}
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {occasions.map((occasion, index) => (
            <span
              key={index}
              className="rounded-full bg-secondary px-3 py-1 caption text-secondary-foreground"
            >
              {occasion}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;