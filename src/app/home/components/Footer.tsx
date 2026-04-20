'use client';

import React from 'react';
import Link from 'next/link';
import { useSiteContent, useSiteContentJSON, useSectionVisible } from '@/lib/content/SiteContentContext';

const defaultCompanyLinks = [
  { label: 'About Us', href: '/about', visible: true },
  { label: 'Contact', href: '/contact', visible: true },
  { label: 'Terms & Conditions', href: '/terms', visible: true },
  { label: 'Store Locator', href: '/contact', visible: true },
  { label: 'Careers', href: '/about', visible: true },
];
const defaultSupportLinks = [
  { label: 'Shipping Info', href: '/about', visible: true },
  { label: 'Returns', href: '/about', visible: true },
  { label: 'FAQ', href: '/about', visible: true },
  { label: 'Privacy Policy', href: '/about', visible: true },
];

const Footer: React.FC = () => {
  const footerVisible = useSectionVisible('footer');
  const currentYear = new Date().getFullYear();
  if (!footerVisible) return null;
  const footerTagline = useSiteContent('footer_tagline', 'Discover luxury fragrances crafted by master perfumers. Each scent tells a unique story of elegance and sophistication.');
  const copyrightText = useSiteContent('footer_copyright_text', 'Al Safa Global e-commerce');
  const headingCompany = useSiteContent('footer_heading_company', 'Company');
  const headingSupport = useSiteContent('footer_heading_support', 'Support');
  const companyLinksRaw = useSiteContentJSON<{ label: string; href: string; visible?: boolean }[]>('footer_links_company', defaultCompanyLinks);
  const supportLinksRaw = useSiteContentJSON<{ label: string; href: string; visible?: boolean }[]>('footer_links_support', defaultSupportLinks);
  const companyLinks = companyLinksRaw.filter((l) => l.visible !== false);
  const supportLinks = supportLinksRaw.filter((l) => l.visible !== false);
  const brandPrimary = useSiteContent('brand_name_primary', 'Al Safa');
  const brandAccent = useSiteContent('brand_name_accent', 'Global');
  const termsText = useSiteContent('footer_terms', 'Terms of Service');
  const privacyText = useSiteContent('footer_privacy', 'Privacy Policy');

  return (
    <footer className="w-full border-t border-border bg-card">
      <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <span className="mb-4 block font-heading text-xl font-semibold tracking-wide text-primary">
              {brandPrimary} <span className="text-accent">{brandAccent}</span>
            </span>

            <p className="max-w-sm font-body text-sm text-text-secondary">
              {footerTagline}
            </p>
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
