import React from 'react';
import Header from '@/components/common/Header';
import OrderConfirmationContent from './components/OrderConfirmationContent';

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <OrderConfirmationContent />

    </main>
  );
}
