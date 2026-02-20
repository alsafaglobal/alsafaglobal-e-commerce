import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/common/Header';
import ProductDetailInteractive from './components/ProductDetailInteractive';

export const metadata: Metadata = {
  title: 'Product Detail - Al Safa Global',
  description:
    'Discover luxury fragrances with detailed scent profiles, sizes, and pricing. Shop premium perfumes from Al Safa Global.',
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
