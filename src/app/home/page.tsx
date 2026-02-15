import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomeInteractive from './components/HomeInteractive';

export const metadata: Metadata = {
  title: 'Home - LuxuryPerfumeShop',
  description: 'Discover luxury fragrances crafted by master perfumers. Explore our curated collection of premium perfumes featuring floral, woody, fresh, and oriental scents.',
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <Header cartItemCount={0} />
      <HomeInteractive />
    </main>
  );
}