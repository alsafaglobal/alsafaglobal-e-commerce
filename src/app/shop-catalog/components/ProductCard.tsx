'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useCurrency } from '@/lib/currency/CurrencyContext';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  scentType: string;
  image: string;
  alt: string;
  topNotes: string[];
  badge?: 'fast_moving' | 'best_selling';
  stock?: number | null;
  offerDiscount?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  scentType,
  image,
  alt,
  topNotes,
  badge,
  stock,
  offerDiscount,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { formatPrice } = useCurrency();

  return (
    <Link
      href={`/product-detail?id=${id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="overflow-hidden rounded-lg bg-card shadow-luxury transition-luxury hover:shadow-luxury-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <div className="absolute left-2 top-2 z-10 flex flex-col gap-1">
            {badge === 'fast_moving' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-500 px-2.5 py-1 font-body text-xs font-bold text-white shadow">
                ⚡ Fast Moving
              </span>
            )}
            {badge === 'best_selling' && (
              <span className="inline-flex items-center gap-1 rounded-full bg-success px-2.5 py-1 font-body text-xs font-bold text-white shadow">
                🏆 Best Selling
              </span>
            )}
            {offerDiscount && (
              <span className="inline-flex items-center rounded-full bg-red-500 px-2.5 py-1 font-body text-xs font-bold text-white shadow">
                {offerDiscount}% OFF
              </span>
            )}
          </div>
          <AppImage
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-luxury ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-secondary px-3 py-1 caption text-secondary-foreground">
              {scentType}
            </span>
          </div>

          <h3 className="mb-1 font-heading text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-luxury">
            {name}
          </h3>

          {topNotes.length > 0 && (
            <div className="mb-2 flex flex-wrap items-center gap-1">
              <span className="font-body text-xs font-semibold uppercase tracking-wider text-accent">Top Notes</span>
              <span className="text-xs text-text-secondary">—</span>
              <span className="font-body text-xs text-text-secondary line-clamp-1">{topNotes.join(' · ')}</span>
            </div>
          )}

          {offerDiscount ? (
            <div className="flex items-baseline gap-2">
              <p className="font-data text-xl font-semibold text-primary">
                {formatPrice(price * (1 - offerDiscount / 100))}
              </p>
              <p className="font-data text-sm text-text-secondary line-through">
                {formatPrice(price)}
              </p>
            </div>
          ) : (
            <p className="font-data text-xl font-semibold text-primary">
              {formatPrice(price)}
            </p>
          )}
          {stock !== null && stock !== undefined && stock <= 5 && stock > 0 && (
            <p className="mt-1 font-body text-xs font-medium text-error">
              Only {stock} left!
            </p>
          )}
          {stock === 0 && (
            <p className="mt-1 font-body text-xs font-medium text-muted-foreground">
              Out of stock
            </p>
          )}
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;