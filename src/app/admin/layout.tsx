'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import Icon from '@/components/ui/AppIcon';

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: 'Squares2X2Icon' },
  { label: 'Products', href: '/admin/products', icon: 'ShoppingBagIcon' },
  { label: 'Categories', href: '/admin/categories', icon: 'TagIcon' },
  { label: 'Site Content', href: '/admin/content', icon: 'PencilSquareIcon' },
  { label: 'Subscribers', href: '/admin/subscribers', icon: 'EnvelopeIcon' },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Don't show admin layout on login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="fixed left-4 top-4 z-50 rounded-md bg-primary p-2 text-primary-foreground md:hidden"
      >
        <Icon name={sidebarOpen ? 'XMarkIcon' : 'Bars3Icon'} size={20} />
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-card shadow-luxury transition-transform md:relative md:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="border-b border-border px-6 py-5">
            <Link href="/admin" className="block">
              <span className="font-heading text-lg font-semibold text-primary">
                Al Safa <span className="text-accent">Admin</span>
              </span>
            </Link>
            <p className="mt-1 font-body text-xs text-text-secondary">
              Content Management
            </p>
          </div>

          {/* Nav */}
          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 rounded-md px-3 py-2.5 font-body text-sm transition-luxury ${
                    isActive
                      ? 'bg-primary/10 font-medium text-primary'
                      : 'text-text-secondary hover:bg-muted hover:text-text-primary'
                  }`}
                >
                  <Icon name={item.icon} size={18} />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="border-t border-border p-4">
            <Link
              href="/home"
              className="mb-2 flex items-center gap-2 rounded-md px-3 py-2 font-body text-sm text-text-secondary transition-luxury hover:bg-muted hover:text-text-primary"
            >
              <Icon name="GlobeAltIcon" size={18} />
              View Live Site
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-md px-3 py-2 font-body text-sm text-error transition-luxury hover:bg-error/10"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-8 md:py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
