import React from 'react';
import type { Metadata, Viewport } from 'next';
import '../styles/index.css';
import { SiteContentProvider } from '@/lib/content/SiteContentContext';
import { CartProvider } from '@/lib/cart/CartContext';
import { CurrencyProvider } from '@/lib/currency/CurrencyContext';
import WhatsAppButton from '@/components/common/WhatsAppButton';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://alsafaglobal.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Al Safa Global — Premium Luxury Fragrances',
    template: '%s | Al Safa Global',
  },
  description: 'Discover luxury perfumes crafted by master perfumers. Shop our exclusive collection of premium fragrances — floral, woody, oriental, and fresh scents — from Al Safa Global.',
  keywords: ['luxury perfumes', 'Al Safa Global', 'premium fragrances', 'UAE perfumes', 'oriental perfumes', 'buy perfume online', 'floral perfume', 'woody fragrance'],
  authors: [{ name: 'Al Safa Global' }],
  creator: 'Al Safa Global',
  publisher: 'Al Safa Global',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AE',
    url: siteUrl,
    siteName: 'Al Safa Global',
    title: 'Al Safa Global — Premium Luxury Fragrances',
    description: 'Discover luxury perfumes crafted by master perfumers. Shop our exclusive collection of premium fragrances from Al Safa Global.',
    images: [{ url: '/og-image.jpg', width: 1200, height: 630, alt: 'Al Safa Global — Premium Luxury Fragrances' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Al Safa Global — Premium Luxury Fragrances',
    description: 'Discover luxury perfumes crafted by master perfumers. Shop our exclusive collection of premium fragrances.',
    images: ['/og-image.jpg'],
  },
  icons: {
    icon: [{ url: '/favicon.ico', type: 'image/x-icon' }],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Al Safa Global',
    url: siteUrl,
    logo: `${siteUrl}/og-image.jpg`,
    description: 'Luxury perfumes and premium fragrances crafted by master perfumers.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'AE',
    },
    sameAs: [],
  };

  return (
    <html lang="en">
      <head>
        {/* Apply dark class before paint to prevent flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <SiteContentProvider>
          <CurrencyProvider>
            <CartProvider>
              {children}
              <WhatsAppButton />
            </CartProvider>
          </CurrencyProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
