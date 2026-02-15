import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/app/home/components/Footer';
import ContactContent from './components/ContactContent';

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ContactContent />
      <Footer />
    </main>
  );
}
