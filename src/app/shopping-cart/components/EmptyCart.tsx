'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

const EmptyCart: React.FC = () => {
  const emptyTitle = useSiteContent('cart_empty_title', 'Your Cart is Empty');
  const emptyDesc = useSiteContent('cart_empty_description', 'Discover our exquisite collection of luxury perfumes and add your favorites to begin your fragrance journey.');
  const emptyButton = useSiteContent('cart_empty_button', 'Explore Collection');
  const benefit1 = useSiteContent('cart_benefit_1', 'Free shipping over $150');
  const benefit2 = useSiteContent('cart_benefit_2', 'Authentic luxury fragrances');
  const benefit3 = useSiteContent('cart_benefit_3', 'Elegant gift packaging');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Icon name="ShoppingCartIcon" size={48} className="text-text-secondary" />
      </div>

      <h2 className="mt-6 font-heading text-3xl font-medium text-text-primary">{emptyTitle}</h2>
      <p className="mt-3 max-w-md text-center text-base text-text-secondary">{emptyDesc}</p>

      <Link href="/shop-catalog"
        className="mt-8 flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-body text-base font-medium text-primary-foreground shadow-luxury-sm transition-luxury hover:opacity-90">
        <Icon name="SparklesIcon" size={20} className="text-primary-foreground" />
        {emptyButton}
      </Link>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <Icon name="TruckIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">{benefit1}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Icon name="ShieldCheckIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">{benefit2}</p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Icon name="GiftIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">{benefit3}</p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;
