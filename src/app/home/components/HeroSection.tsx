'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';

const HeroSection: React.FC = () => {
  const heroTitle = useSiteContent('hero_title', 'Discover Your Signature Scent');
  const heroSubtitle = useSiteContent('hero_subtitle', 'Explore our curated collection of luxury perfumes crafted by master perfumers from around the world');
  const heroButton = useSiteContent('hero_button_text', 'Explore Collection');
  const visible = useSectionVisible('hero');

  if (!visible) return null;

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-gradient-to-br from-secondary/30 to-background">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920')] bg-cover bg-center opacity-20" />

      <div className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-4 text-center md:px-6 lg:px-8">
        <h1 className="mb-6 font-heading text-5xl font-bold text-text-primary md:text-6xl lg:text-7xl">
          {heroTitle}
        </h1>

        <p className="mb-8 max-w-2xl font-body text-lg text-text-secondary md:text-xl">
          {heroSubtitle}
        </p>

        <Link
          href="/shop-catalog"
          className="rounded-lg bg-primary px-8 py-4 font-body text-base font-medium text-primary-foreground shadow-luxury transition-luxury hover:bg-primary/90 hover:shadow-luxury-md"
        >
          {heroButton}
        </Link>
      </div>
    </section>
  );
};

export default HeroSection;
