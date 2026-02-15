'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';

interface ProductCardProps {
  id: number;
  name: string;
  price: number;
  scentType: string;
  image: string;
  alt: string;
  topNotes: string[];
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  scentType,
  image,
  alt,
  topNotes,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link
      href={`/product-detail?id=${id}`}
      className="group block"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <article className="overflow-hidden rounded-lg bg-card shadow-luxury transition-luxury hover:shadow-luxury-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-muted">
          <AppImage
            src={image}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-luxury ${
              isHovered ? 'scale-105' : 'scale-100'
            }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-t from-background/80 to-transparent transition-luxury ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="caption text-card-foreground">Top Notes:</p>
              <p className="font-body text-sm font-medium text-card-foreground">
                {topNotes.join(', ')}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="mb-2 flex items-center justify-between">
            <span className="rounded-full bg-secondary px-3 py-1 caption text-secondary-foreground">
              {scentType}
            </span>
          </div>

          <h3 className="mb-2 font-heading text-lg font-semibold text-text-primary line-clamp-2 group-hover:text-primary transition-luxury">
            {name}
          </h3>

          <p className="font-data text-xl font-semibold text-primary">
            ${price.toFixed(2)}
          </p>
        </div>
      </article>
    </Link>
  );
};

export default ProductCard;