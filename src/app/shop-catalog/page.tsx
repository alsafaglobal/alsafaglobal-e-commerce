import type { Metadata } from 'next';
import { Suspense } from 'react';
import Header from '@/components/common/Header';
import ShopCatalogInteractive from './components/ShopCatalogInteractive';
import LoadingSkeleton from './components/LoadingSkeleton';

export const metadata: Metadata = {
  title: 'Shop Catalog - LuxuryPerfumeShop',
  description: 'Discover our exquisite collection of luxury perfumes with sophisticated filtering and search capabilities. Browse floral, woody, fresh, and oriental fragrances from premium brands.',
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