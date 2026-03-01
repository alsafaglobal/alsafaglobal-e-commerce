import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/common/Header';
import ProductDetailInteractive from './components/ProductDetailInteractive';

export const metadata: Metadata = {
  title: 'Luxury Perfume — Al Safa Global',
  description: 'Discover the full scent profile, sizes, and pricing of our premium fragrances. Crafted by master perfumers — shop Al Safa Global.',
  openGraph: {
    title: 'Premium Fragrance — Al Safa Global',
    description: 'Explore scent notes, sizes, and pricing for our luxury perfumes.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Al Safa Global Luxury Fragrance' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Fragrance — Al Safa Global',
    description: 'Explore scent notes, sizes, and pricing for our luxury perfumes.',
    images: ['/og-image.jpg'],
  },
};

export default function ProductDetailPage() {
  return (
    <>
      <Header />
      <Suspense fallback={
        <div className="min-h-screen bg-background">
          <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
            <div className="h-6 w-64 animate-pulse rounded bg-muted" />
            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <div className="h-96 animate-pulse rounded-lg bg-muted" />
              <div className="space-y-4">
                <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
                <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
                <div className="h-24 animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        </div>
      }>
        <ProductDetailInteractive />
      </Suspense>
    </>
  );
}
