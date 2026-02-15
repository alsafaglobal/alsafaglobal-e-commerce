'use client';

import React from 'react';
import Link from 'next/link';

interface CartSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

const CartSummary: React.FC<CartSummaryProps> = ({ subtotal, tax, total }) => {
  return (
    <div className="rounded-lg border border-border bg-card p-6 shadow-luxury-sm lg:sticky lg:top-24">
      <h2 className="mb-6 font-heading text-2xl font-medium text-text-primary">
        Order Summary
      </h2>

      <div className="space-y-4 border-b border-border pb-4">
        <div className="flex items-center justify-between">
          <span className="text-base text-text-secondary">Subtotal</span>
          <span className="font-data text-base font-medium text-text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-base text-text-secondary">
            Estimated Tax (8%)
          </span>
          <span className="font-data text-base font-medium text-text-primary">
            ${tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="font-heading text-xl font-medium text-text-primary">
          Total
        </span>
        <span className="font-data text-2xl font-medium text-primary">
          ${total.toFixed(2)}
        </span>
      </div>

      <Link
        href="/checkout"
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-base font-medium text-primary-foreground shadow-luxury-sm transition-luxury hover:opacity-90"
      >
        Proceed to Checkout
      </Link>

      <Link
        href="/shop-catalog"
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-md border border-border bg-card px-6 py-3 font-body text-base font-medium text-text-primary transition-luxury hover:bg-muted"
      >
        Continue Shopping
      </Link>

      <div className="mt-6 space-y-2 border-t border-border pt-6">
        <p className="caption text-center text-text-secondary">
          Secure checkout powered by SSL encryption
        </p>
        <p className="caption text-center text-text-secondary">
          Free shipping on orders over $150
        </p>
      </div>
    </div>
  );
};

export default CartSummary;