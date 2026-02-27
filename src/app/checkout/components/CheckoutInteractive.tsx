'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import { useCart } from '@/lib/cart/CartContext';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const CheckoutInteractive: React.FC = () => {
  const router = useRouter();
  const { items, clearCart, subtotal } = useCart();
  const [clientSecret, setClientSecret] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [paymentError, setPaymentError] = useState('');

  const shipping = 0;
  const tax = 0;
  const total = subtotal;

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated || items.length === 0) return;

    fetch('/api/checkout/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: total }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        if (data.error) setPaymentError(data.error);
      })
      .catch(() => setPaymentError('Failed to initialize payment. Please refresh.'));
  }, [isHydrated, items.length]);

  const handleOrderComplete = async (formData: FormData, paymentIntentId: string) => {
    const orderNumber = `ORD-${Date.now()}`;
    const orderData = {
      orderNumber,
      items,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country,
      },
      payment: {
        method: 'stripe',
        paymentIntentId,
      },
      totals: { subtotal, shipping, tax, total },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    }

    // Save order to Supabase
    try {
      await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customer: orderData.customer,
          shipping: orderData.shipping,
          items,
          totals: orderData.totals,
          paymentIntentId,
        }),
      });
    } catch (e) {
      console.error('Order save failed:', e);
    }

    // Send order email to info@alsafaglobal.com
    try {
      await fetch('/api/checkout/send-order-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderNumber,
          customer: orderData.customer,
          shipping: orderData.shipping,
          items,
          totals: orderData.totals,
          paymentIntentId,
        }),
      });
    } catch (e) {
      // Email failure should not block order completion
      console.error('Order email failed:', e);
    }

    clearCart();
    router.push('/order-confirmation');
  };

  if (!isHydrated) {
    return (
      <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8 h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="h-[600px] animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="lg:col-span-1">
            <div className="h-[500px] animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-16 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <svg className="mb-6 h-24 w-24 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mb-4 font-heading text-2xl font-semibold text-text-primary">Your Cart is Empty</h2>
          <p className="mb-8 font-body text-text-secondary">Add some luxury perfumes to your cart before checking out.</p>
          <button
            onClick={() => router.push('/shop-catalog')}
            className="rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  const stripeAppearance = {
    theme: 'night' as const,
    variables: {
      colorPrimary: '#c9a96e',
      colorBackground: '#1c1c1c',
      colorText: '#f5f0ea',
      colorDanger: '#ef4444',
      colorTextSecondary: '#a89880',
      borderRadius: '6px',
      fontFamily: 'inherit',
    },
    rules: {
      '.Input': {
        border: '1px solid #3a3028',
        backgroundColor: '#141414',
      },
      '.Input:focus': {
        border: '1px solid #c9a96e',
        boxShadow: '0 0 0 2px rgba(201,169,110,0.2)',
      },
      '.Label': {
        color: '#a89880',
        fontSize: '13px',
        marginBottom: '6px',
      },
    },
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">Checkout</h1>

      {paymentError && (
        <div className="mb-6 rounded-md bg-error/10 p-4 text-error">
          {paymentError}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
              <CheckoutForm onOrderComplete={handleOrderComplete} />
            </Elements>
          ) : (
            <div className="h-[600px] animate-pulse rounded-lg bg-muted" />
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              cartItems={items}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInteractive;
