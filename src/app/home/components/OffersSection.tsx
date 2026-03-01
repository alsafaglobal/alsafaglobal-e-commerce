'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';
import { useCurrency } from '@/lib/currency/CurrencyContext';

interface LinkedProduct {
  id: string;
  product_id: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    image_alt: string;
  };
}

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  discount_percent: number | null;
  offer_type: 'banner' | 'product' | 'combo';
  badge: string;
  link: string;
  valid_until: string;
  is_active: boolean;
  bg_color: string;
  offer_products: LinkedProduct[];
}

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const { formatPrice } = useCurrency();
  const sectionTitle = useSiteContent('offers_section_title', 'Exclusive Offers');
  const sectionSubtitle = useSiteContent('offers_section_subtitle', 'Limited time deals on our finest fragrances');
  const visible = useSectionVisible('offers');

  useEffect(() => {
    fetch('/api/offers')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          const now = new Date();
          setOffers(
            data.filter((o: Offer) => o.is_active && (!o.valid_until || new Date(o.valid_until) >= now))
          );
        }
      });
  }, []);

  if (!visible || offers.length === 0) return null;

  return (
    <section className="bg-background py-16">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-semibold text-text-primary lg:text-4xl">
            {sectionTitle}
          </h2>
          <p className="mt-3 font-body text-text-secondary">{sectionSubtitle}</p>
        </div>

        {/* Offer Cards */}
        <div
          className={`grid gap-6 ${
            offers.length === 1
              ? 'mx-auto max-w-2xl grid-cols-1'
              : offers.length === 2
              ? 'grid-cols-1 sm:grid-cols-2'
              : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
          }`}
        >
          {offers.map((offer) => {
            const linked = offer.offer_products || [];
            const origTotal = linked.reduce((s, lp) => s + (lp.products?.price || 0), 0);
            const discTotal =
              offer.discount_percent && origTotal
                ? origTotal * (1 - offer.discount_percent / 100)
                : null;

            const daysLeft = offer.valid_until
              ? Math.ceil((new Date(offer.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            const isProductOffer = offer.offer_type === 'product' || offer.offer_type === 'combo';
            const productLink =
              linked.length === 1
                ? `/product-detail/${linked[0].product_id}`
                : offer.link || '/shop-catalog';

            return (
              <div
                key={offer.id}
                className="offer-card-bg group relative overflow-hidden rounded-2xl shadow-luxury transition-luxury hover:-translate-y-1 hover:shadow-luxury-lg"
                style={{ background: offer.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)' }}
              >
                {/* Discount % badge */}
                {offer.discount_percent ? (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-background">
                    {offer.discount_percent}% OFF
                  </div>
                ) : offer.badge ? (
                  <div className="absolute right-4 top-4 z-10 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-background">
                    {offer.badge}
                  </div>
                ) : null}

                {/* Product images for product / combo offers */}
                {isProductOffer && linked.length > 0 && (
                  <div className="flex h-44 items-center justify-center gap-3 overflow-hidden bg-black/20 px-4 pt-4">
                    {linked.slice(0, 3).map((lp) => (
                      <div
                        key={lp.id}
                        className={`overflow-hidden rounded-xl shadow-luxury ${
                          linked.length === 1 ? 'h-36 w-36' : linked.length === 2 ? 'h-28 w-28' : 'h-24 w-24'
                        }`}
                      >
                        <AppImage
                          src={lp.products?.image_url || ''}
                          alt={lp.products?.name || ''}
                          className="h-full w-full object-cover transition-luxury group-hover:scale-105"
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="p-6">
                  {/* Product names for combo */}
                  {offer.offer_type === 'combo' && linked.length > 1 && (
                    <p className="mb-1 font-body text-xs text-white/60">
                      {linked.map((lp) => lp.products?.name).filter(Boolean).join(' + ')}
                    </p>
                  )}

                  {/* Title */}
                  <h3 className="mb-2 font-heading text-xl font-semibold text-white">{offer.title}</h3>

                  {/* Description */}
                  {offer.description && (
                    <p className="mb-4 font-body text-sm text-white/70">{offer.description}</p>
                  )}

                  {/* Pricing — product / combo */}
                  {isProductOffer && origTotal > 0 && (
                    <div className="mb-4 flex items-baseline gap-3">
                      <span className="font-body text-sm text-white/50 line-through">
                        {formatPrice(origTotal)}
                      </span>
                      <span className="font-heading text-3xl font-bold text-accent">
                        {formatPrice(discTotal ?? origTotal)}
                      </span>
                    </div>
                  )}

                  {/* Banner discount label */}
                  {!isProductOffer && offer.discount && (
                    <div className="mb-3 font-heading text-5xl font-bold text-accent">{offer.discount}</div>
                  )}

                  {/* Countdown */}
                  {daysLeft !== null && (
                    <p className="mb-4 font-body text-xs text-white/60">
                      {daysLeft <= 0 ? 'Ends today!' : `Ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
                    </p>
                  )}

                  {/* CTA */}
                  <Link
                    href={productLink}
                    className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-medium text-background transition-luxury hover:bg-accent/90"
                  >
                    {offer.offer_type === 'combo' ? 'Shop Bundle' : 'Shop Now'}
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
