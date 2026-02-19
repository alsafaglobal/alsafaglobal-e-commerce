'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  alt: string;
}

interface OrderData {
  orderNumber: string;
  items: CartItem[];
  customer: { name: string; email: string; phone: string };
  shipping: { address: string; city: string; state: string; zipCode: string; country: string };
  payment: { cardLast4: string; cardName: string };
  totals: { subtotal: number; shipping: number; tax: number; total: number };
}

const OrderConfirmationContent: React.FC = () => {
  const [order, setOrder] = useState<OrderData | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  const confirmedTitle = useSiteContent('order_confirmed_title', 'Order Confirmed!');
  const confirmedMessage = useSiteContent('order_confirmed_message', 'Thank you, {name}. Your order has been received and is being prepared.');
  const summaryTitle = useSiteContent('order_summary_title', 'Order Summary');
  const labelSubtotal = useSiteContent('order_label_subtotal', 'Subtotal');
  const labelShipping = useSiteContent('order_label_shipping', 'Shipping');
  const labelTax = useSiteContent('order_label_tax', 'Tax');
  const labelTotal = useSiteContent('order_label_total', 'Total');
  const shippingTitle = useSiteContent('order_shipping_title', 'Shipping Address');
  const paymentTitle = useSiteContent('order_payment_title', 'Payment');
  const cardEnding = useSiteContent('order_card_ending', 'Card ending in');
  const emailConfirm = useSiteContent('order_confirmation_email', 'A confirmation email will be sent to');
  const btnContinue = useSiteContent('order_btn_continue', 'Continue Shopping');
  const btnHome = useSiteContent('order_btn_home', 'Back to Home');
  const noOrderTitle = useSiteContent('order_no_order_title', 'No Order Found');
  const noOrderMessage = useSiteContent('order_no_order_message', "We couldn't find a recent order. Please try placing an order first.");
  const noOrderButton = useSiteContent('order_no_order_button', 'Browse Products');

  useEffect(() => {
    setIsHydrated(true);
    const stored = localStorage.getItem('lastOrder');
    if (stored) {
      try { setOrder(JSON.parse(stored)); } catch { /* ignore */ }
    }
  }, []);

  if (!isHydrated) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl space-y-4">
          <div className="h-10 w-64 animate-pulse rounded bg-muted" />
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-64 animate-pulse rounded-lg bg-muted" />
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-[1440px] px-4 py-20 text-center md:px-6 lg:px-8">
        <Icon name="ShoppingBagIcon" size={64} className="mx-auto mb-6 text-muted-foreground" />
        <h1 className="font-heading text-3xl font-semibold text-text-primary">{noOrderTitle}</h1>
        <p className="mt-4 font-body text-text-secondary">{noOrderMessage}</p>
        <Link href="/shop-catalog"
          className="mt-8 inline-block rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
          {noOrderButton}
        </Link>
      </div>
    );
  }

  const personalizedMessage = confirmedMessage.replace('{name}', order.customer.name);

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <div className="mb-10 flex flex-col items-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-success/10">
            <Icon name="CheckCircleIcon" size={48} className="text-success" />
          </div>
          <h1 className="mt-6 font-heading text-3xl font-semibold text-text-primary md:text-4xl">{confirmedTitle}</h1>
          <p className="mt-3 font-body text-base text-text-secondary">{personalizedMessage}</p>
          <div className="mt-4 rounded-full bg-secondary px-6 py-2">
            <span className="font-data text-sm font-medium text-secondary-foreground">Order #{order.orderNumber}</span>
          </div>
        </div>

        <div className="rounded-lg bg-card shadow-luxury-sm">
          <div className="border-b border-border px-6 py-4">
            <h2 className="font-heading text-lg font-semibold text-text-primary">{summaryTitle}</h2>
          </div>
          <div className="divide-y divide-border">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 px-6 py-4">
                <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                  <AppImage src={item.image} alt={item.alt} className="h-full w-full object-cover" />
                </div>
                <div className="flex-1">
                  <p className="font-body text-sm font-medium text-text-primary">{item.name}</p>
                  <p className="mt-0.5 font-body text-xs text-text-secondary">{item.size} · Qty {item.quantity}</p>
                </div>
                <p className="font-data text-sm font-medium text-text-primary">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="space-y-2 border-t border-border px-6 py-4">
            <div className="flex justify-between font-body text-sm text-text-secondary">
              <span>{labelSubtotal}</span><span>${order.totals.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-text-secondary">
              <span>{labelShipping}</span><span>${order.totals.shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-body text-sm text-text-secondary">
              <span>{labelTax}</span><span>${order.totals.tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 font-body text-base font-semibold text-text-primary">
              <span>{labelTotal}</span><span>${order.totals.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
            <h3 className="mb-3 font-heading text-base font-semibold text-text-primary">{shippingTitle}</h3>
            <p className="font-body text-sm text-text-secondary">
              {order.shipping.address}<br />
              {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
              {order.shipping.country}
            </p>
          </div>
          <div className="rounded-lg bg-card p-6 shadow-luxury-sm">
            <h3 className="mb-3 font-heading text-base font-semibold text-text-primary">{paymentTitle}</h3>
            <p className="font-body text-sm text-text-secondary">
              {order.payment.cardName}<br />
              {cardEnding} {order.payment.cardLast4}
            </p>
            <p className="mt-2 font-body text-xs text-text-secondary">
              {emailConfirm} <span className="text-text-primary">{order.customer.email}</span>
            </p>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Link href="/shop-catalog"
            className="inline-flex items-center gap-2 rounded-md bg-primary px-8 py-3 font-body text-base font-medium text-primary-foreground transition-luxury hover:opacity-90">
            <Icon name="ShoppingBagIcon" size={18} className="text-primary-foreground" />
            {btnContinue}
          </Link>
          <Link href="/home"
            className="inline-flex items-center gap-2 rounded-md border border-border px-8 py-3 font-body text-base font-medium text-text-primary transition-luxury hover:bg-muted">
            <Icon name="HomeIcon" size={18} className="text-text-primary" />
            {btnHome}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationContent;
