import React, { Suspense } from 'react';
import Header from '@/components/common/Header';
import OrderConfirmationContent from './components/OrderConfirmationContent';

export default function OrderConfirmationPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Suspense fallback={<div className="mx-auto max-w-2xl px-4 py-16 space-y-4"><div className="h-10 w-64 animate-pulse rounded bg-muted mx-auto" /><div className="h-4 w-full animate-pulse rounded bg-muted" /><div className="h-64 animate-pulse rounded-lg bg-muted" /></div>}>
        <OrderConfirmationContent />
      </Suspense>
    </main>
  );
}
