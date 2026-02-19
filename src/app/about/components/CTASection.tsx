'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

const CTASection: React.FC = () => {
  const ctaTitle = useSiteContent('about_cta_title', 'Experience Luxury Perfumery');
  const ctaSubtitle = useSiteContent('about_cta_subtitle', 'Discover our curated collection of exquisite fragrances, each crafted with passion and precision');
  const btn1 = useSiteContent('about_cta_button1_text', 'Explore Collection');
  const btn2 = useSiteContent('about_cta_button2_text', 'Contact Us');

  return (
    <section className="py-12 md:py-16">
      <div className="rounded-lg bg-gradient-to-r from-primary to-accent p-8 text-center shadow-luxury-lg md:p-12">
        <h2 className="font-heading text-3xl font-semibold text-primary-foreground md:text-4xl">
          {ctaTitle}
        </h2>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base text-primary-foreground/90 md:text-lg">
          {ctaSubtitle}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Link
            href="/shop-catalog"
            className="inline-flex items-center justify-center gap-2 rounded-md bg-background px-8 py-3 font-body text-base font-medium text-text-primary shadow-luxury transition-luxury hover:scale-105 hover:shadow-luxury-md"
          >
            {btn1}
            <Icon
              name="ArrowRightIcon"
              size={20}
              className="text-text-primary"
            />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center gap-2 rounded-md border-2 border-primary-foreground/30 bg-transparent px-8 py-3 font-body text-base font-medium text-primary-foreground transition-luxury hover:border-primary-foreground hover:bg-primary-foreground/10"
          >
            {btn2}
            <Icon
              name="EnvelopeIcon"
              size={20}
              className="text-primary-foreground"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CTASection;