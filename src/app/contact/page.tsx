import type { Metadata } from 'next';
import React from 'react';
import Header from '@/components/common/Header';
import Footer from '@/app/home/components/Footer';
import ContactContent from './components/ContactContent';

export const metadata: Metadata = {
  title: 'Contact Us — Al Safa Global',
  description: 'Get in touch with Al Safa Global. We\'d love to hear from you — inquiries, orders, and fragrance consultations welcome.',
  openGraph: {
    title: 'Contact Al Safa Global',
    description: 'Get in touch for inquiries, orders, and fragrance consultations.',
    url: '/contact',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Contact Al Safa Global' }],
  },
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <ContactContent />
      <Footer />
    </main>
  );
}
