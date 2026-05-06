'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import AppImage from '@/components/ui/AppImage';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';
import { useCurrency } from '@/lib/currency/CurrencyContext';
import { useCart } from '@/lib/cart/CartContext';

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
  const [loaded, setLoaded] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState<Record<string, boolean>>({});
  const { formatPrice } = useCurrency();
  const { addItem } = useCart();
  const sectionTitle = useSiteContent('offers_section_title', 'Exclusive Offers');
  const sectionSubtitle = useSiteContent('offers_section_subtitle', 'Limited time deals on our finest fragrances');
  const visible = useSectionVisible('offers');

  const handleAddToCart = (offer: Offer) => {
    const linked = offer.offer_products || [];
    if (linked.length === 0) return;
    const multiplier = offer.discount_percent ? 1 - offer.discount_percent / 100 : 1;
    linked.forEach((lp) => {
      const p = lp.products;
      if (!p) return;
      addItem({
        id: lp.product_id,
        name: p.name,
        size: 'Default',
        price: Math.round(p.price * multiplier * 100) / 100,
        quantity: 1,
        image: p.image_url || '',
        alt: p.image_alt || p.name,
      });
    });
    setAddedFeedback((prev) => ({ ...prev, [offer.id]: true }));
    setTimeout(() => setAddedFeedback((prev) => ({ ...prev, [offer.id]: false })), 2000);
  };

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
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  // Hidden by admin toggle → never render
  if (!visible) return null;
  // Still fetching → render nothing yet (avoid flash)
  if (!loaded) return null;
  // Loaded but no active offers → hide cleanly
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
                ? `/product-detail?id=${linked[0].product_id}`
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
                  <div className="flex flex-wrap items-center gap-3">
                    {/* Add to Cart — product & combo offers */}
                    {isProductOffer && linked.length > 0 && (
                      <button
                        onClick={() => handleAddToCart(offer)}
                        className={`inline-flex items-center gap-2 rounded-lg px-5 py-2.5 font-body text-sm font-medium transition-luxury ${
                          addedFeedback[offer.id]
                            ? 'bg-green-600 text-white'
                            : 'bg-accent text-background hover:bg-accent/90'
                        }`}
                      >
                        {addedFeedback[offer.id] ? (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Added!
                          </>
                        ) : (
                          <>
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {offer.offer_type === 'combo' ? 'Add All to Cart' : 'Add to Cart'}
                          </>
                        )}
                      </button>
                    )}

                    {/* View Details link */}
                    <Link
                      href={productLink}
                      className="inline-flex items-center gap-1 font-body text-sm text-white/70 transition-luxury hover:text-white"
                    >
                      {isProductOffer ? 'View Details' : 'Shop Now'}
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
