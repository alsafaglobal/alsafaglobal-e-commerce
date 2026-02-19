'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { createClient } from '@/lib/supabase/client';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';

interface Product {
  id: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  alt: string;
  scentType: string;
}

const FeaturedProducts: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const title = useSiteContent('featured_title', 'Featured Collection');
  const subtitle = useSiteContent('featured_subtitle', 'Handpicked luxury fragrances that define elegance and sophistication');
  const visible = useSectionVisible('featured_products');

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('id, name, brand, price, image_url, image_alt, scent_type')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(6);

      if (data) {
        setFeaturedProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            brand: p.brand || '',
            price: p.price,
            image: p.image_url || '',
            alt: p.image_alt || p.name,
            scentType: p.scent_type || '',
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  if (!visible) return null;

  if (loading) {
    return (
      <section className="w-full bg-background py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-72 animate-pulse rounded bg-muted" />
            <div className="mx-auto h-6 w-96 animate-pulse rounded bg-muted" />
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="w-full bg-background py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            {title}
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) =>
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              brand={product.brand}
              price={product.price}
              image={product.image}
              alt={product.alt}
              scentType={product.scentType}
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
