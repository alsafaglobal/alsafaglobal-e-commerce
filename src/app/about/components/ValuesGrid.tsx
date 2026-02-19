'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface ValuesGridProps {
  values: Value[];
}

const ValuesGrid: React.FC<ValuesGridProps> = ({ values }) => {
  const heading = useSiteContent('about_values_heading', 'Our Core Values');
  const subtitle = useSiteContent('about_values_subtitle', 'The principles that guide every fragrance we create and every experience we deliver');

  return (
    <section className="py-12 md:py-16">
      <div className="text-center">
        <h2 className="font-heading text-3xl font-semibold text-text-primary md:text-4xl">
          {heading}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base text-text-secondary md:text-lg">
          {subtitle}
        </p>
      </div>

      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {values.map((value, index) => (
          <div
            key={index}
            className="group rounded-lg bg-card p-6 shadow-luxury-sm transition-luxury hover:shadow-luxury"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Icon
                name={value.icon as any}
                size={24}
                className="text-primary transition-luxury group-hover:scale-110"
              />
            </div>
            <h3 className="font-heading text-xl font-semibold text-text-primary">
              {value.title}
            </h3>
            <p className="mt-3 font-body text-sm leading-relaxed text-text-secondary">
              {value.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ValuesGrid;