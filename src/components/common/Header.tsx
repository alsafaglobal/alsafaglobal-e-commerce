'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface NavigationItem {
  label: string;
  path: string;
  icon?: string;
}

interface HeaderProps {
  cartItemCount?: number;
}

const Header: React.FC<HeaderProps> = ({ cartItemCount = 0 }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();
  const navHome = useSiteContent('nav_home', 'Home');
  const navShop = useSiteContent('nav_shop', 'Shop');
  const navAbout = useSiteContent('nav_about', 'About');
  const navContact = useSiteContent('nav_contact', 'Contact');

  const navigationItems: NavigationItem[] = [
    { label: navHome, path: '/home', icon: 'HomeIcon' },
    { label: navShop, path: '/shop-catalog', icon: 'ShoppingBagIcon' },
    { label: navAbout, path: '/about', icon: 'InformationCircleIcon' },
    { label: navContact, path: '/contact', icon: 'EnvelopeIcon' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full bg-card transition-luxury ${
          isScrolled ? 'shadow-luxury' : ''
        }`}
      >
        <nav className="mx-auto flex h-[60px] max-w-[1440px] items-center justify-between px-4 md:px-6 lg:px-8">
          <Link
            href="/home"
            className="flex items-center transition-luxury hover:opacity-80"
          >
            <span className="font-heading text-xl font-semibold tracking-wide text-primary">
              Al Safa <span className="text-accent">Global</span>
            </span>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`relative px-4 py-2 font-body text-sm font-medium transition-luxury hover:text-primary ${
                  isActivePath(item.path)
                    ? 'text-primary' :'text-text-secondary'
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full bg-accent" />
                )}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/shopping-cart"
              className="relative transition-luxury hover:scale-105"
            >
              <Icon
                name="ShoppingCartIcon"
                size={24}
                className="text-text-primary"
              />
              {cartItemCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-accent font-data text-xs font-medium text-accent-foreground">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center transition-luxury hover:text-primary md:hidden"
              aria-label="Toggle mobile menu"
            >
              <Icon
                name={isMobileMenuOpen ? 'XMarkIcon' : 'Bars3Icon'}
                size={24}
                className="text-text-primary"
              />
            </button>
          </div>
        </nav>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 bg-background md:hidden"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex h-[60px] items-center justify-between px-4">
            <Link
              href="/home"
              className="flex items-center transition-luxury hover:opacity-80"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <svg
                width="140"
                height="32"
                viewBox="0 0 140 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-auto"
              >
                <path
                  d="M8 4h4v20H8V4zm8 0h12v4H16v4h10v4H16v8h-4V4zm20 0h4v20h-4V4zm8 0h12v4H44v4h10v4H44v4h12v4H40V4zm20 0h4l8 14V4h4v20h-4l-8-14v14h-4V4zm20 0h12v4H80v4h10v4H80v8h-4V4z"
                  fill="var(--color-primary)"
                />
                <circle cx="126" cy="14" r="2" fill="var(--color-accent)" />
              </svg>
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="flex items-center justify-center transition-luxury hover:text-primary"
              aria-label="Close mobile menu"
            >
              <Icon name="XMarkIcon" size={24} className="text-text-primary" />
            </button>
          </div>

          <nav className="flex flex-col gap-2 px-4 py-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`flex items-center gap-3 rounded-md px-4 py-3 font-body text-base font-medium transition-luxury hover:bg-muted ${
                  isActivePath(item.path)
                    ? 'bg-muted text-primary' :'text-text-secondary'
                }`}
              >
                {item.icon && (
                  <Icon
                    name={item.icon as any}
                    size={20}
                    className={
                      isActivePath(item.path)
                        ? 'text-primary' :'text-text-secondary'
                    }
                  />
                )}
                {item.label}
              </Link>
            ))}

            <div className="mt-6 border-t border-border pt-6">
              <Link
                href="/shopping-cart"
                className="flex items-center justify-between rounded-md bg-primary px-4 py-3 font-body text-base font-medium text-primary-foreground transition-luxury hover:opacity-90"
              >
                <span className="flex items-center gap-3">
                  <Icon
                    name="ShoppingCartIcon"
                    size={20}
                    className="text-primary-foreground"
                  />
                  Shopping Cart
                </span>
                {cartItemCount > 0 && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent font-data text-sm font-medium text-accent-foreground">
                    {cartItemCount > 9 ? '9+' : cartItemCount}
                  </span>
                )}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;