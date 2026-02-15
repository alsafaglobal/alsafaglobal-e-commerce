import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';

const EmptyCart: React.FC = () => {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16">
      <div className="flex h-24 w-24 items-center justify-center rounded-full bg-muted">
        <Icon
          name="ShoppingCartIcon"
          size={48}
          className="text-text-secondary"
        />
      </div>

      <h2 className="mt-6 font-heading text-3xl font-medium text-text-primary">
        Your Cart is Empty
      </h2>

      <p className="mt-3 max-w-md text-center text-base text-text-secondary">
        Discover our exquisite collection of luxury perfumes and add your
        favorites to begin your fragrance journey.
      </p>

      <Link
        href="/shop-catalog"
        className="mt-8 flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-body text-base font-medium text-primary-foreground shadow-luxury-sm transition-luxury hover:opacity-90"
      >
        <Icon name="SparklesIcon" size={20} className="text-primary-foreground" />
        Explore Collection
      </Link>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="flex flex-col items-center text-center">
          <Icon name="TruckIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">
            Free shipping over $150
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Icon name="ShieldCheckIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">
            Authentic luxury fragrances
          </p>
        </div>
        <div className="flex flex-col items-center text-center">
          <Icon name="GiftIcon" size={32} className="text-accent" />
          <p className="mt-2 caption text-text-secondary">
            Elegant gift packaging
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmptyCart;