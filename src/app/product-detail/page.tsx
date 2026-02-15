import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import ProductDetailInteractive from './components/ProductDetailInteractive';

export const metadata: Metadata = {
  title: 'Velvet Noir Eau de Parfum - LuxuryPerfumeShop',
  description:
    'Discover Velvet Noir, a sophisticated oriental floral fragrance with notes of bergamot, rose, jasmine, vanilla, and sandalwood. Available in 50ml and 100ml sizes.',
};

export default function ProductDetailPage() {
  return (
    <>
      <Header cartItemCount={0} />
      <ProductDetailInteractive />
    </>
  );
}