'use client';

import React from 'react';
import HeroSection from './HeroSection';
import FeaturedProducts from './FeaturedProducts';
import CategoryShowcase from './CategoryShowcase';
import NewsletterSection from './NewsletterSection';
import Footer from './Footer';

const HomeInteractive: React.FC = () => {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryShowcase />
      <NewsletterSection />
      <Footer />
    </>
  );
};

export default HomeInteractive;