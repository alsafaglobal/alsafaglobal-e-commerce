import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import CheckoutInteractive from './components/CheckoutInteractive';

export const metadata: Metadata = {
  title: 'Checkout - LuxuryPerfumeShop',
  description:
    'Complete your luxury perfume purchase with secure checkout. Enter shipping details and payment information to finalize your order.',
};

export default function CheckoutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-background">
        <CheckoutInteractive />
      </main>
    </>
  );
}