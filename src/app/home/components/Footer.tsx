'use client';

import React from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent, useSiteContentJSON } from '@/lib/content/SiteContentContext';

const defaultShopLinks = [
  { label: 'All Products', href: '/shop-catalog' },
  { label: 'New Arrivals', href: '/shop-catalog?sort=newest' },
  { label: 'Best Sellers', href: '/shop-catalog?sort=popular' },
  { label: 'Gift Sets', href: '/shop-catalog?category=gifts' },
];
const defaultCompanyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Store Locator', href: '/contact' },
  { label: 'Careers', href: '/about' },
];
const defaultSupportLinks = [
  { label: 'Shipping Info', href: '/about' },
  { label: 'Returns', href: '/about' },
  { label: 'FAQ', href: '/about' },
  { label: 'Privacy Policy', href: '/about' },
];

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const footerTagline = useSiteContent('footer_tagline', 'Discover luxury fragrances crafted by master perfumers. Each scent tells a unique story of elegance and sophistication.');
  const copyrightText = useSiteContent('footer_copyright_text', 'Al Safa Global e-commerce');
  const headingShop = useSiteContent('footer_heading_shop', 'Shop');
  const headingCompany = useSiteContent('footer_heading_company', 'Company');
  const headingSupport = useSiteContent('footer_heading_support', 'Support');
  const shopLinks = useSiteContentJSON<{ label: string; href: string }[]>('footer_links_shop', defaultShopLinks);
  const companyLinks = useSiteContentJSON<{ label: string; href: string }[]>('footer_links_company', defaultCompanyLinks);
  const supportLinks = useSiteContentJSON<{ label: string; href: string }[]>('footer_links_support', defaultSupportLinks);
  const brandPrimary = useSiteContent('brand_name_primary', 'Al Safa');
  const brandAccent = useSiteContent('brand_name_accent', 'Global');
  const termsText = useSiteContent('footer_terms', 'Terms of Service');
  const privacyText = useSiteContent('footer_privacy', 'Privacy Policy');

  const socialLinks = [
    { name: 'Facebook', icon: 'ShareIcon', href: '#' },
    { name: 'Instagram', icon: 'CameraIcon', href: '#' },
    { name: 'Twitter', icon: 'ChatBubbleLeftIcon', href: '#' },
    { name: 'Pinterest', icon: 'PhotoIcon', href: '#' }
  ];

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="mb-4 block font-heading text-xl font-semibold tracking-wide text-primary">
              {brandPrimary} <span className="text-accent">{brandAccent}</span>
            </span>

            <p className="mb-6 max-w-sm font-body text-sm text-text-secondary">
              {footerTagline}
            </p>

            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted transition-luxury hover:bg-primary hover:text-primary-foreground"
                  aria-label={social.name}
                >
                  <Icon name={social.icon as any} size={20} />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {headingShop}
            </h3>
            <ul className="space-y-3">
              {shopLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-text-secondary transition-luxury hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {headingCompany}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-text-secondary transition-luxury hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {headingSupport}
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-text-secondary transition-luxury hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <p className="caption text-text-secondary">
              &copy; {currentYear} {copyrightText}
            </p>

            <div className="flex gap-6">
              <Link
                href="/about"
                className="caption text-text-secondary transition-luxury hover:text-primary"
              >
                {termsText}
              </Link>
              <Link
                href="/about"
                className="caption text-text-secondary transition-luxury hover:text-primary"
              >
                {privacyText}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
