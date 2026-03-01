import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import AboutContent from './components/AboutContent';

export const metadata: Metadata = {
  title: 'About Us — Al Safa Global',
  description: 'Discover the heritage and craftsmanship behind Al Safa Global. Learn about our commitment to excellence and the art of creating timeless luxury fragrances.',
  openGraph: {
    title: 'About Al Safa Global — Luxury Fragrance House',
    description: 'Our commitment to excellence and the art of creating timeless luxury fragrances.',
    url: '/about',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'About Al Safa Global' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Al Safa Global — Luxury Fragrance House',
    description: 'Discover our heritage and commitment to crafting timeless luxury fragrances.',
    images: ['/og-image.jpg'],
  },
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <AboutContent />
    </>
  );
}