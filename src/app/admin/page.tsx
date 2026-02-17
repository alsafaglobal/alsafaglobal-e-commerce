'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';

interface Stats {
  totalProducts: number;
  activeProducts: number;
  disabledProducts: number;
  featuredProducts: number;
  categories: number;
  subscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    async function fetchStats() {
      const supabase = createClient();

      const [productsRes, categoriesRes, subscribersRes] = await Promise.all([
        supabase.from('products').select('is_active, is_featured'),
        supabase.from('categories').select('id', { count: 'exact', head: true }),
        supabase.from('newsletter_subscribers').select('id', { count: 'exact', head: true }),
      ]);

      const products = productsRes.data || [];
      setStats({
        totalProducts: products.length,
        activeProducts: products.filter((p) => p.is_active).length,
        disabledProducts: products.filter((p) => !p.is_active).length,
        featuredProducts: products.filter((p) => p.is_featured).length,
        categories: categoriesRes.count || 0,
        subscribers: subscribersRes.count || 0,
      });
    }
    fetchStats();
  }, []);

  const statCards = stats
    ? [
        { label: 'Total Products', value: stats.totalProducts, icon: 'ShoppingBagIcon', color: 'text-primary', href: '/admin/products' },
        { label: 'Active Products', value: stats.activeProducts, icon: 'CheckCircleIcon', color: 'text-success', href: '/admin/products' },
        { label: 'Disabled', value: stats.disabledProducts, icon: 'XCircleIcon', color: 'text-error', href: '/admin/products' },
        { label: 'Featured', value: stats.featuredProducts, icon: 'StarIcon', color: 'text-warning', href: '/admin/products' },
        { label: 'Categories', value: stats.categories, icon: 'TagIcon', color: 'text-accent', href: '/admin/categories' },
        { label: 'Subscribers', value: stats.subscribers, icon: 'EnvelopeIcon', color: 'text-primary', href: '/admin/subscribers' },
      ]
    : [];

  return (
    <div>
      <h1 className="font-heading text-2xl font-semibold text-text-primary md:text-3xl">
        Dashboard
      </h1>
      <p className="mt-1 font-body text-sm text-text-secondary">
        Welcome back. Here&apos;s an overview of your store.
      </p>

      {!stats ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-lg bg-muted" />
          ))}
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="flex items-center gap-4 rounded-lg bg-card p-5 shadow-luxury-sm transition-luxury hover:shadow-luxury"
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-muted ${card.color}`}>
                <Icon name={card.icon} size={24} />
              </div>
              <div>
                <p className="font-data text-2xl font-semibold text-text-primary">
                  {card.value}
                </p>
                <p className="font-body text-sm text-text-secondary">
                  {card.label}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-8">
        <h2 className="font-heading text-lg font-semibold text-text-primary">
          Quick Actions
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
          >
            <Icon name="PlusIcon" size={16} />
            Add Product
          </Link>
          <Link
            href="/admin/content"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
          >
            <Icon name="PencilSquareIcon" size={16} />
            Edit Site Content
          </Link>
          <Link
            href="/home"
            className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2.5 font-body text-sm font-medium text-text-primary transition-luxury hover:bg-muted"
          >
            <Icon name="GlobeAltIcon" size={16} />
            View Live Site
          </Link>
        </div>
      </div>
    </div>
  );
}
