'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';

const FALLBACK = 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=1920';
const SLIDE_DURATION = 6000;

const HeroSection: React.FC = () => {
  const heroTitle    = useSiteContent('hero_title',       'Discover Your Signature Scent');
  const heroSubtitle = useSiteContent('hero_subtitle',    'Explore our curated collection of luxury perfumes crafted by master perfumers from around the world');
  const heroButton   = useSiteContent('hero_button_text', 'Explore Collection');
  const visible      = useSectionVisible('hero');

  const [images, setImages]             = useState<string[]>([]);
  const [loaded, setLoaded]             = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Per-slide activation counter.
  // Increments ONLY for the slide that just became active.
  // → that slide's inner div remounts (restarting kenburns from scale 1.08).
  // → every OTHER slide's key stays the same → no remount → no snap.
  const [activeCounts, setActiveCounts] = useState<number[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data: products } = await supabase
        .from('products')
        .select('id, image_url')
        .eq('is_active', true)
        .eq('is_featured', true)
        .limit(8);

      if (!products?.length) return;

      const ids = products.map((p) => p.id);
      const { data: media } = await supabase
        .from('product_media')
        .select('product_id, url')
        .in('product_id', ids)
        .eq('type', 'image')
        .order('sort_order', { ascending: true });

      const mediaMap: Record<string, string> = {};
      for (const m of media ?? []) {
        if (!mediaMap[m.product_id]) mediaMap[m.product_id] = m.url;
      }

      const urls = products
        .map((p) => mediaMap[p.id] || p.image_url)
        .filter(Boolean) as string[];

      if (urls.length) setImages(urls);
    }
    load().finally(() => setLoaded(true));
  }, []);

  // Only the newly active slide gets its counter incremented
  useEffect(() => {
    setActiveCounts((prev) => {
      const next = [...prev];
      next[currentIndex] = (next[currentIndex] || 0) + 1;
      return next;
    });
  }, [currentIndex]);

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % images.length);
    }, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [images.length]);

  if (!visible) return null;

  // Don't show any image (not even the fallback) until fetch completes — prevents
  // the 1-second flash of the old placeholder image on every page load/refresh.
  const slides = loaded ? (images.length > 0 ? images : [FALLBACK]) : [];

  return (
    <section className="relative h-[600px] w-full overflow-hidden bg-black">

      {slides.map((img, i) => {
        const isActive = i === currentIndex;
        return (
          <div
            key={i}
            className="absolute inset-0"
            style={{
              opacity: isActive ? 1 : 0,
              transition: 'opacity 1.8s ease-in-out',
              zIndex: isActive ? 1 : 0,
              animation: i === 0 ? 'fadeIn 0.8s ease-in forwards' : undefined,
            }}
          >
            {/*
              key = activeCounts[i]: changes only when slide i becomes active.
              Inactive slides keep the same key → no remount → no scale snap.
              animationPlayState: inactive slides PAUSE the kenburns right where
              they are → they freeze at their current scale while fading out,
              with zero visual glitch.
            */}
            <div
              key={activeCounts[i] || 0}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${img})`,
                animation: 'kenburns 9s ease-out forwards',
                animationPlayState: isActive ? 'running' : 'paused',
                willChange: 'transform',
              }}
            />
          </div>
        );
      })}

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" style={{ zIndex: 2 }} />

      {/* Text */}
      <div
        className="relative mx-auto flex h-full max-w-[1440px] flex-col items-center justify-center px-4 text-center md:px-6 lg:px-8"
        style={{ zIndex: 3 }}
      >
        <h1 className="mb-6 font-heading text-5xl font-bold text-white md:text-6xl lg:text-7xl">
          {heroTitle}
        </h1>
        <p className="mb-8 max-w-2xl font-body text-lg text-white/80 md:text-xl">
          {heroSubtitle}
        </p>
        <Link
          href="/shop-catalog"
          className="rounded-lg bg-primary px-8 py-4 font-body text-base font-medium text-primary-foreground shadow-luxury transition-luxury hover:bg-primary/90 hover:shadow-luxury-md"
        >
          {heroButton}
        </Link>
      </div>

      {/* Dot indicators */}
      {slides.length > 1 && (
        <div
          className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-2"
          style={{ zIndex: 3 }}
        >
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === currentIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default HeroSection;
