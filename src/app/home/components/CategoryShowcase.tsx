'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { createClient } from '@/lib/supabase/client';

interface Category {
  name: string;
  description: string;
  image: string;
  alt: string;
  filterParam: string;
}

const CategoryShowcase: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('categories')
        .select('*')
        .order('sort_order');

      if (data) {
        setCategories(
          data.map((c) => ({
            name: c.name,
            description: c.description || '',
            image: c.image_url || '',
            alt: c.image_alt || c.name,
            filterParam: c.filter_param || c.name,
          }))
        );
      }
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <section className="w-full bg-muted py-16 md:py-24">
        <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <div className="mx-auto mb-4 h-10 w-64 animate-pulse rounded bg-background" />
            <div className="mx-auto h-6 w-80 animate-pulse rounded bg-background" />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 animate-pulse rounded-xl bg-background" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (categories.length === 0) return null;

  return (
    <section className="w-full bg-muted py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 font-heading text-4xl font-bold text-text-primary md:text-5xl">
            Explore by Scent
          </h2>
          <p className="mx-auto max-w-2xl font-body text-lg text-text-secondary">
            Find your perfect fragrance family
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((category) =>
            <Link
              key={category.name}
              href={`/shop-catalog?filters=${category.filterParam}`}
              className="group overflow-hidden rounded-xl bg-card shadow-luxury transition-luxury hover:shadow-luxury-lg">
                <div className="relative h-64 w-full overflow-hidden">
                  <AppImage
                    src={category.image}
                    alt={category.alt}
                    className="h-full w-full object-cover transition-spring group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="mb-2 font-heading text-2xl font-semibold text-text-primary">
                      {category.name}
                    </h3>
                    <p className="font-body text-sm text-text-secondary">
                      {category.description}
                    </p>
                  </div>
                </div>
            </Link>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
