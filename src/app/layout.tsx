import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { SiteContentProvider } from '@/lib/content/SiteContentContext';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  title: 'Al Safa Global - Premium Fragrances',
  description: 'Discover luxury perfumes crafted by master perfumers. Shop our exclusive collection of premium fragrances from Al Safa Global.',
  icons: {
    icon: [
      { url: '/favicon.ico', type: 'image/x-icon' }
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SiteContentProvider>{children}</SiteContentProvider>
      </body>
    </html>
  );
}
