'use client';

import React from 'react';
import { useSiteContent } from '@/lib/content/SiteContentContext';

const Section: React.FC<{ title: string; body: string }> = ({ title, body }) => {
  if (!title && !body) return null;
  const lines = body.split('\n').map((l) => l.trim()).filter(Boolean);
  return (
    <div className="mb-8">
      <h2 className="mb-3 font-heading text-lg font-semibold text-text-primary">{title}</h2>
      <ul className="space-y-2">
        {lines.map((line, i) => (
          <li key={i} className="flex items-start gap-2 font-body text-sm text-text-secondary">
            <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

const TermsContent: React.FC = () => {
  const title   = useSiteContent('terms_page_title', 'Terms & Conditions');
  const intro   = useSiteContent('terms_intro', 'Welcome to Shop at ASG (Al Safa Global). By using our website, you agree to the following terms:');

  const s1t = useSiteContent('terms_s1_title', '1. General');
  const s1b = useSiteContent('terms_s1_body', 'These terms apply to all users of this website.\nAl Safa Global reserves the right to update or change these terms at any time without prior notice.');

  const s2t = useSiteContent('terms_s2_title', '2. Orders & Payments');
  const s2b = useSiteContent('terms_s2_body', 'All orders are subject to availability and confirmation.\nPrices are listed in AED and may change without notice.\nOrders are processed only after successful payment.');

  const s3t = useSiteContent('terms_s3_title', '3. Shipping & Delivery');
  const s3b = useSiteContent('terms_s3_body', 'Orders are processed and shipped within 3–4 working days.\nDelivery timelines may vary depending on location and courier services.\nAl Safa Global is not liable for delays caused by third-party logistics providers.');

  const s4t = useSiteContent('terms_s4_title', '4. No Return / No Refund');
  const s4b = useSiteContent('terms_s4_body', 'All sales are final.\nNo returns, exchanges, or refunds will be accepted once the product is sold.\nPlease review product details carefully before placing an order.');

  const s5t = useSiteContent('terms_s5_title', '5. Damaged / Wrong Items');
  const s5b = useSiteContent('terms_s5_body', 'If you receive a damaged or incorrect item, notify us within 24 hours of delivery.\nClaims must include photo/video proof.\nRequests after 24 hours will not be accepted.');

  const s6t = useSiteContent('terms_s6_title', '6. Order Cancellation');
  const s6b = useSiteContent('terms_s6_body', 'Orders cannot be cancelled once processed or shipped.\nWe reserve the right to cancel any order due to stock issues, payment failure, or suspected fraud.');

  const s7t = useSiteContent('terms_s7_title', '7. Liability');
  const s7b = useSiteContent('terms_s7_body', 'Al Safa Global is not responsible for indirect or consequential damages.\nLiability is limited to the value of the purchased product.');

  const s8t = useSiteContent('terms_s8_title', '8. Intellectual Property');
  const s8b = useSiteContent('terms_s8_body', 'All website content (images, logos, text) belongs to Al Safa Global and cannot be used without permission.');

  const s9t = useSiteContent('terms_s9_title', '9. Governing Law');
  const s9b = useSiteContent('terms_s9_body', 'These terms are governed by the laws of the United Arab Emirates.\nAny disputes shall fall under UAE jurisdiction.');

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <h1 className="mb-4 font-heading text-4xl font-bold text-text-primary">{title}</h1>
      <p className="mb-10 font-body text-sm text-text-secondary border-b border-border pb-8">{intro}</p>

      <Section title={s1t} body={s1b} />
      <Section title={s2t} body={s2b} />
      <Section title={s3t} body={s3b} />
      <Section title={s4t} body={s4b} />
      <Section title={s5t} body={s5b} />
      <Section title={s6t} body={s6b} />
      <Section title={s7t} body={s7b} />
      <Section title={s8t} body={s8b} />
      <Section title={s9t} body={s9b} />
    </div>
  );
};

export default TermsContent;
