'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface CraftsmanshipStep {
  number: string;
  title: string;
  description: string;
}

interface CraftsmanshipSectionProps {
  steps: CraftsmanshipStep[];
  imageSrc: string;
  imageAlt: string;
}

const CraftsmanshipSection: React.FC<CraftsmanshipSectionProps> = ({
  steps,
  imageSrc,
  imageAlt,
}) => {
  const heading = useSiteContent('about_craftsmanship_heading', 'The Art of Perfumery');
  const subtitle = useSiteContent('about_craftsmanship_subtitle', 'Every fragrance is a masterpiece, crafted through meticulous attention to detail and time-honored techniques');

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

      <div className="mt-12 flex flex-col gap-12 lg:flex-row lg:items-center">
        <div className="w-full lg:w-1/2">
          <div className="space-y-8">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-accent text-accent-foreground">
                  <span className="font-data text-lg font-semibold">
                    {step.number}
                  </span>
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold text-text-primary">
                    {step.title}
                  </h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-text-secondary">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <div className="overflow-hidden rounded-lg shadow-luxury">
            <AppImage
              src={imageSrc}
              alt={imageAlt}
              className="h-[400px] w-full object-cover md:h-[600px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CraftsmanshipSection;