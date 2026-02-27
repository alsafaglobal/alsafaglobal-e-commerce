'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  badge: string;
  link: string;
  valid_until: string;
  is_active: boolean;
  bg_color: string;
}

export default function OffersSection() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const sectionTitle = useSiteContent('offers_section_title', 'Exclusive Offers');
  const sectionSubtitle = useSiteContent('offers_section_subtitle', 'Limited time deals on our finest fragrances');

  useEffect(() => {
    fetch('/api/offers')
      .then((r) => r.json())
      .then((data) => setOffers(Array.isArray(data) ? data.filter((o: Offer) => o.is_active) : []));
  }, []);

  if (offers.length === 0) return null;

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
        <div className={`grid gap-6 ${offers.length === 1 ? 'grid-cols-1 max-w-2xl mx-auto' : offers.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
          {offers.map((offer) => {
            const isExpired = offer.valid_until && new Date(offer.valid_until) < new Date();
            const daysLeft = offer.valid_until
              ? Math.ceil((new Date(offer.valid_until).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
              : null;

            return (
              <div
                key={offer.id}
                className="relative overflow-hidden rounded-2xl shadow-luxury transition-luxury hover:shadow-luxury-lg hover:-translate-y-1"
                style={{ background: offer.bg_color || 'linear-gradient(135deg, #1a1a2e 0%, #2d1b4e 100%)' }}
              >
                {/* Badge */}
                {offer.badge && (
                  <div className="absolute right-4 top-4 rounded-full bg-accent px-3 py-1 font-body text-xs font-bold text-background">
                    {offer.badge}
                  </div>
                )}

                <div className="p-8">
                  {/* Discount */}
                  {offer.discount && (
                    <div className="mb-3 font-heading text-5xl font-bold text-accent">
                      {offer.discount}
                    </div>
                  )}

                  {/* Title */}
                  <h3 className="mb-2 font-heading text-xl font-semibold text-white">
                    {offer.title}
                  </h3>

                  {/* Description */}
                  <p className="mb-6 font-body text-sm text-white/70">{offer.description}</p>

                  {/* Countdown */}
                  {daysLeft !== null && !isExpired && (
                    <p className="mb-4 font-body text-xs text-white/60">
                      {daysLeft <= 0 ? 'Ends today!' : `Ends in ${daysLeft} day${daysLeft === 1 ? '' : 's'}`}
                    </p>
                  )}
                  {isExpired && (
                    <p className="mb-4 font-body text-xs text-red-400">Offer expired</p>
                  )}

                  {/* CTA */}
                  {offer.link && !isExpired && (
                    <Link
                      href={offer.link}
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 font-body text-sm font-medium text-background transition-luxury hover:bg-accent/90"
                    >
                      Shop Now
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
