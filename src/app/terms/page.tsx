import React from 'react';
import Header from '@/components/common/Header';
import TermsContent from './components/TermsContent';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <TermsContent />
    </main>
  );
}
