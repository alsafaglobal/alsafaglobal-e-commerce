'use client';

import React from 'react';
import { useSiteContent } from '@/lib/content/SiteContentContext';
import { useCurrency } from '@/lib/currency/CurrencyContext';

interface ProductInfoProps {
  name: string;
  brand: string;
  price: number;
  offerDiscount?: number;
  description: string;
  fragranceFamily: string;
  longevity: string;
  gender?: string;
  occasions: string[];
}

const ProductInfo: React.FC<ProductInfoProps> = ({
  name,
  brand,
  price,
  offerDiscount = 0,
  description,
  fragranceFamily,
  longevity,
  gender,
  occasions,
}) => {
  const { formatPrice } = useCurrency();
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

      <div className="border-t border-border pt-6">
        {offerDiscount > 0 ? (
          <div className="flex items-baseline gap-3">
            <p className="font-heading text-3xl font-semibold text-primary">
              {formatPrice(Math.round(price * (1 - offerDiscount / 100)))}
            </p>
            <p className="font-data text-lg text-text-secondary line-through">{formatPrice(price)}</p>
            <span className="rounded-full bg-primary/10 px-2 py-0.5 font-body text-sm font-semibold text-primary">{offerDiscount}% OFF</span>
          </div>
        ) : (
          <p className="font-heading text-3xl font-semibold text-primary">
            {formatPrice(price)}
          </p>
        )}
      </div>

      <div className="space-y-4 border-t border-border pt-6">
        <p className="font-body leading-relaxed text-text-secondary">
          {description}
        </p>
      </div>

      <div className={`grid gap-4 border-t border-border pt-6 ${gender ? 'sm:grid-cols-3' : 'sm:grid-cols-2'}`}>
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
        {gender && (
          <div>
            <p className="caption font-medium text-text-secondary">Preferences</p>
            <p className="mt-1 font-body text-text-primary">{gender}</p>
          </div>
        )}
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