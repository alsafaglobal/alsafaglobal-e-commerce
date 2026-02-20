'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from './CheckoutForm';
import OrderSummary from './OrderSummary';
import { useCart } from '@/lib/cart/CartContext';

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
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutInteractive: React.FC = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, clearCart } = useCart();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const calculateSubtotal = (): number => {
    return items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const calculateShipping = (): number => {
    return 15.0;
  };

  const calculateTax = (): number => {
    return calculateSubtotal() * 0.08;
  };

  const calculateTotal = (): number => {
    return calculateSubtotal() + calculateShipping() + calculateTax();
  };

  const handleSubmit = async (formData: FormData) => {
    setIsProcessing(true);

    await new Promise((resolve) => setTimeout(resolve, 2000));

    const orderNumber = `ORD-${Date.now()}`;
    const orderData = {
      orderNumber,
      items,
      customer: {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone
      },
      shipping: {
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zipCode: formData.zipCode,
        country: formData.country
      },
      payment: {
        cardLast4: formData.cardNumber.slice(-4),
        cardName: formData.cardName
      },
      totals: {
        subtotal: calculateSubtotal(),
        shipping: calculateShipping(),
        tax: calculateTax(),
        total: calculateTotal()
      }
    };

    if (typeof window !== 'undefined') {
      localStorage.setItem('lastOrder', JSON.stringify(orderData));
    }

    clearCart();
    setIsProcessing(false);
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
      </div>);
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-16 md:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center text-center">
          <svg
            className="mb-6 h-24 w-24 text-muted-foreground"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
          <h2 className="mb-4 font-heading text-2xl font-semibold text-text-primary">
            Your Cart is Empty
          </h2>
          <p className="mb-8 font-body text-text-secondary">
            Add some luxury perfumes to your cart before checking out.
          </p>
          <button
            onClick={() => router.push('/shop-catalog')}
            className="rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90">
            Continue Shopping
          </button>
        </div>
      </div>);
  }

  return (
    <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
      <h1 className="mb-8 font-heading text-3xl font-bold text-text-primary md:text-4xl">
        Checkout
      </h1>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <CheckoutForm onSubmit={handleSubmit} isProcessing={isProcessing} />
        </div>

        <div className="lg:col-span-1">
          <div className="lg:sticky lg:top-24">
            <OrderSummary
              cartItems={items}
              subtotal={calculateSubtotal()}
              shipping={calculateShipping()}
              tax={calculateTax()}
              total={calculateTotal()} />
          </div>
        </div>
      </div>
    </div>);
};

export default CheckoutInteractive;
