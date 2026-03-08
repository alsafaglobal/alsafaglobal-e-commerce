'use client';

import React from 'react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import OffersSection from './OffersSection';
import CategoryShowcase from './CategoryShowcase';
import NewsletterSection from './NewsletterSection';
const HomeInteractive: React.FC = () => {
  return (
    <>
      <HeroSection />
      <OffersSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <NewsletterSection />
    </>
  );
};

export default HomeInteractive;
