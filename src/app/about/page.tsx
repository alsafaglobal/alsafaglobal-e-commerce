import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import AboutContent from './components/AboutContent';

export const metadata: Metadata = {
  title: 'About Us - LuxuryPerfumeShop',
  description:
    'Discover the heritage and craftsmanship behind LuxuryPerfumeShop. Learn about our commitment to excellence, sustainability, and the art of creating timeless fragrances since 1985.',
};

export default function AboutPage() {
  return (
    <>
      <Header cartItemCount={0} />
      <AboutContent />
    </>
  );
}