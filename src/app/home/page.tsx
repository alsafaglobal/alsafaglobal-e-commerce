import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomeInteractive from './components/HomeInteractive';

export const metadata: Metadata = {
  title: 'Luxury Perfumes Online — Al Safa Global',
  description: 'Explore Al Safa Global\'s exclusive luxury fragrance collection. Floral, woody, oriental, and fresh perfumes crafted by master perfumers. Shop online with UAE delivery.',
  openGraph: {
    title: 'Al Safa Global — Luxury Perfumes Online',
    description: 'Shop exclusive luxury fragrances. Floral, woody, oriental & fresh scents from master perfumers.',
    url: '/home',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Al Safa Global Luxury Perfumes' }],
  },
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HomeInteractive />
    </main>
  );
}