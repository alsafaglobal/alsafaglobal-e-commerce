import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/common/Header';
import ShopCatalogInteractive from './components/ShopCatalogInteractive';
import LoadingSkeleton from './components/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Shop Perfumes — Luxury Fragrance Collection',
  description: 'Browse Al Safa Global\'s luxury perfume collection. Filter by floral, woody, oriental, and fresh scents. Premium fragrances with UAE delivery.',
  openGraph: {
    title: 'Shop Luxury Perfumes — Al Safa Global',
    description: 'Browse our luxury perfume collection. Filter by floral, woody, oriental, and fresh scents.',
    url: '/shop-catalog',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Al Safa Global Perfume Collection' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Shop Luxury Perfumes — Al Safa Global',
    description: 'Browse our curated collection of premium fragrances. Floral, woody, oriental, and fresh scents.',
    images: ['/og-image.jpg'],
  },
};

export default function ShopCatalogPage() {
  return (
    <>
      <Header />
      <main>
        <Suspense fallback={
          <div className="min-h-screen bg-background">
            <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
              <div className="mb-8">
                <div className="mb-6 h-12 w-full animate-pulse rounded-lg bg-muted" />
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-muted" />
                  ))}
                </div>
              </div>
              <LoadingSkeleton />
            </div>
          </div>
        }>
          <ShopCatalogInteractive />
        </Suspense>
      </main>
    </>
  );
}