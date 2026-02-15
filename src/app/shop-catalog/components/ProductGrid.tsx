import React from 'react';
import ProductCard from './ProductCard';

interface Product {
  id: number;
  name: string;
  price: number;
  scentType: string;
  image: string;
  alt: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizes: number[];
  description: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: React.FC<ProductGridProps> = ({ products }) => {
  if (products.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg bg-muted p-12 text-center">
        <p className="mb-2 font-heading text-2xl font-semibold text-text-primary">
          No perfumes found
        </p>
        <p className="font-body text-base text-text-secondary">
          Try adjusting your search or filters to find what you're looking for
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          id={product.id}
          name={product.name}
          price={product.price}
          scentType={product.scentType}
          image={product.image}
          alt={product.alt}
          topNotes={product.topNotes}
        />
      ))}
    </div>
  );
};

export default ProductGrid;