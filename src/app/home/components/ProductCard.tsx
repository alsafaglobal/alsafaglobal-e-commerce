'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface ProductCardProps {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  alt: string;
  scentType: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  brand,
  price,
  image,
  alt,
  scentType,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-card shadow-luxury transition-luxury hover:shadow-luxury-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/product-detail?id=${id}`} className="block">
        <div className="relative h-80 w-full overflow-hidden bg-muted">
          <AppImage
            src={image}
            alt={alt}
            className="h-full w-full object-cover transition-spring group-hover:scale-105"
          />
          
          {isHovered && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 transition-luxury">
              <button className="rounded-lg bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground shadow-luxury transition-luxury hover:bg-primary/90">
                View Details
              </button>
            </div>
          )}
        </div>
        
        <div className="p-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="caption text-accent">{scentType}</span>
            <Icon
              name="HeartIcon"
              size={20}
              className="text-text-secondary transition-luxury hover:text-accent"
            />
          </div>
          
          <h3 className="mb-1 font-heading text-xl font-semibold text-text-primary">
            {name}
          </h3>
          
          <p className="mb-3 font-body text-sm text-text-secondary">{brand}</p>
          
          <div className="flex items-center justify-between">
            <span className="data-text text-lg font-medium text-primary">
              ${price.toFixed(2)}
            </span>
            
            <button
              className="flex items-center gap-2 rounded-lg bg-secondary px-4 py-2 font-body text-sm font-medium text-secondary-foreground transition-luxury hover:bg-secondary/80"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality would go here
              }}
            >
              <Icon name="ShoppingCartIcon" size={16} />
              Add
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;