'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  alt: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({
  cartItems,
  subtotal,
  shipping,
  tax,
  total,
}) => {
  const summaryTitle = useSiteContent('checkout_summary_title', 'Order Summary');
  const labelSize = useSiteContent('checkout_label_size', 'Size');
  const labelQty = useSiteContent('checkout_label_qty', 'Qty');
  const labelSubtotal = useSiteContent('checkout_label_subtotal', 'Subtotal');
  const labelShipping = useSiteContent('checkout_label_shipping', 'Shipping');
  const labelTax = useSiteContent('checkout_label_tax', 'Tax');
  const labelTotal = useSiteContent('checkout_label_total', 'Total');
  const secureText = useSiteContent('checkout_secure_badge', 'Secure SSL Encrypted Payment');

  return (
    <div className="rounded-lg bg-card p-6 shadow-luxury">
      <h2 className="mb-6 font-heading text-2xl font-semibold text-text-primary">
        {summaryTitle}
      </h2>

      <div className="mb-6 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <AppImage src={item.image} alt={item.alt} className="h-full w-full object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-body text-sm font-medium text-text-primary">{item.name}</h3>
                <p className="mt-1 font-data text-xs text-text-secondary">{labelSize}: {item.size}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-data text-sm text-text-secondary">{labelQty}: {item.quantity}</span>
                <span className="font-data text-sm font-medium text-text-primary">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">{labelSubtotal}</span>
          <span className="font-data text-sm text-text-primary">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">{labelShipping}</span>
          <span className="font-data text-sm text-text-primary">${shipping.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">{labelTax}</span>
          <span className="font-data text-sm text-text-primary">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-heading text-lg font-semibold text-text-primary">{labelTotal}</span>
        <span className="font-data text-xl font-bold text-primary">${total.toFixed(2)}</span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-md bg-muted p-3">
        <svg className="h-5 w-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
        <span className="caption text-text-secondary">{secureText}</span>
      </div>
    </div>
  );
};

export default OrderSummary;
