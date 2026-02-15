import type { Metadata } from 'next';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Shopping Cart - LuxuryPerfumeShop',
  description:
    'Review your selected luxury perfumes, adjust quantities, and proceed to secure checkout for your fragrance collection.',
};

export default function ShoppingCartPage() {
  return (
    <main className="min-h-screen bg-background">
      <ShoppingCartInteractive />
    </main>
  );
}
