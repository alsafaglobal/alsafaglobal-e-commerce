'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [isHydrated, setIsHydrated] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [shipping, setShipping] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [deliveryCharges, setDeliveryCharges] = useState<Record<string, number>>({});
  const [taxRates, setTaxRates] = useState<Record<string, number>>({});

  // Delivery row is hidden — exclude shipping from displayed total and charge
  const total = subtotal + taxAmount;
  // Keep a ref to the latest total so the update callback always uses the right value
  const totalRef = useRef(total);
  useEffect(() => { totalRef.current = total; }, [total]);

  // Track selected country to apply charge when delivery charges load
  const [selectedCountry, setSelectedCountry] = useState('United Arab Emirates');
  const taxRate = taxRates[selectedCountry] ?? 0;

  useEffect(() => { setIsHydrated(true); }, []);

  // Fetch delivery charges and tax rates, then apply for the default country
  useEffect(() => {
    Promise.all([
      fetch('/api/delivery-charges').then((r) => r.json()),
      fetch('/api/tax-rates').then((r) => r.json()),
    ]).then(([deliveryData, taxData]) => {
      const deliveryMap: Record<string, number> = {};
      if (Array.isArray(deliveryData)) {
        deliveryData.forEach((d: { country_name: string; charge_aed: number }) => {
          deliveryMap[d.country_name] = Number(d.charge_aed);
        });
      }
      setDeliveryCharges(deliveryMap);

      const taxMap: Record<string, number> = {};
      if (Array.isArray(taxData)) {
        taxData.forEach((t: { country_name: string; tax_percent: number }) => {
          taxMap[t.country_name] = Number(t.tax_percent);
        });
      }
      setTaxRates(taxMap);

      // Apply for the default country
      const charge = deliveryMap[selectedCountry] ?? 0;
      const taxPercent = taxMap[selectedCountry] ?? 0;
      setShipping(charge);
      setTaxAmount((subtotal * taxPercent) / 100);
    }).catch(() => {});
  }, []);

  // Create payment intent once items are ready
  useEffect(() => {
    if (!isHydrated || items.length === 0) return;
    fetch('/api/checkout/payment-intent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: subtotal + taxAmount }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.clientSecret) setClientSecret(data.clientSecret);
        if (data.paymentIntentId) setPaymentIntentId(data.paymentIntentId);
        if (data.error) setPaymentError(data.error);
      })
      .catch(() => setPaymentError('Failed to initialize payment. Please refresh.'));
  }, [isHydrated, items.length]);

  // Called by CheckoutForm whenever the country dropdown changes
  const handleCountryChange = async (country: string) => {
    setSelectedCountry(country);
    const charge = deliveryCharges[country] ?? 0;
    const taxPercent = taxRates[country] ?? 0;
    const newTaxAmount = (subtotal * taxPercent) / 100;
    setShipping(charge);
    setTaxAmount(newTaxAmount);
    const newTotal = subtotal + charge + newTaxAmount;

    if (paymentIntentId) {
      await fetch('/api/checkout/payment-intent', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentIntentId, amount: newTotal }),
      }).catch(() => {});
    }
  };

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
      totals: { subtotal, shipping, tax: taxAmount, total: totalRef.current },
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    }

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
      console.error('Order email failed:', e);
    }

    router.push('/order-confirmation');
    clearCart();
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
      '.Input': { border: '1px solid #3a3028', backgroundColor: '#141414' },
      '.Input:focus': { border: '1px solid #c9a96e', boxShadow: '0 0 0 2px rgba(201,169,110,0.2)' },
      '.Label': { color: '#a89880', fontSize: '13px', marginBottom: '6px' },
    },
  };

  return (
    <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">Checkout</h1>

      {paymentError && (
        <div className="mb-6 rounded-md bg-error/10 p-4 text-error">{paymentError}</div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {clientSecret ? (
            <Elements stripe={stripePromise} options={{ clientSecret, appearance: stripeAppearance }}>
              <CheckoutForm
                onOrderComplete={handleOrderComplete}
                onCountryChange={handleCountryChange}
              />
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
              tax={taxAmount}
              taxRate={taxRate}
              total={total}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutInteractive;
