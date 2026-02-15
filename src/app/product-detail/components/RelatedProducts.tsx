import React from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';

interface RelatedProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  alt: string;
  rating: number;
}

interface RelatedProductsProps {
  products: RelatedProduct[];
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ products }) => {
  return (
    <div className="space-y-6">
      <h2 className="font-heading text-2xl font-semibold text-text-primary lg:text-3xl">
        You May Also Like
      </h2>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product-detail?id=${product.id}`}
            className="group overflow-hidden rounded-lg bg-card shadow-luxury-sm transition-luxury hover:shadow-luxury"
          >
            <div className="aspect-square overflow-hidden">
              <AppImage
                src={product.image}
                alt={product.alt}
                className="h-full w-full object-cover transition-luxury group-hover:scale-105"
              />
            </div>
            <div className="p-4">
              <p className="caption text-text-secondary">{product.brand}</p>
              <h3 className="mt-1 font-body font-medium text-text-primary line-clamp-2">
                {product.name}
              </h3>
              <div className="mt-2 flex items-center justify-between">
                <p className="font-body font-semibold text-primary">
                  ${product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-1">
                  <Icon
                    name="StarIcon"
                    variant="solid"
                    size={16}
                    className="text-accent"
                  />
                  <span className="caption text-text-secondary">
                    {product.rating}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;