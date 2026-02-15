'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/common/Header';
import CartItem from './CartItem';
import CartSummary from './CartSummary';
import EmptyCart from './EmptyCart';

interface CartItemData {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

const ShoppingCartInteractive: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);

  useEffect(() => {
    setIsHydrated(true);

    const mockCartItems: CartItemData[] = [
    {
      id: '1',
      name: 'Midnight Rose Eau de Parfum',
      size: '100ml',
      price: 145.0,
      quantity: 1,
      image:
      "https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png",
      alt: 'Elegant black perfume bottle with gold accents and rose design on white marble surface'
    },
    {
      id: '2',
      name: 'Ocean Breeze Cologne',
      size: '50ml',
      price: 85.0,
      quantity: 2,
      image:
      "https://images.unsplash.com/photo-1725182524566-e640cc061a27",
      alt: 'Blue glass cologne bottle with silver cap surrounded by seashells and ocean elements'
    },
    {
      id: '3',
      name: 'Amber Woods Intense',
      size: '100ml',
      price: 165.0,
      quantity: 1,
      image:
      "https://images.unsplash.com/photo-1676994904360-94f50f3870d3",
      alt: 'Amber-colored perfume bottle with wooden cap on rustic wood background with dried flowers'
    }];


    setCartItems(mockCartItems);
  }, []);

  const handleQuantityChange = (id: string, newQuantity: number) => {
    setCartItems((prevItems) =>
    prevItems.map((item) =>
    item.id === id ? { ...item, quantity: newQuantity } : item
    )
    );
  };

  const handleRemove = (id: string) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  if (!isHydrated) {
    return (
      <>
        <Header cartItemCount={0} />
        <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8 h-10 w-48 animate-pulse rounded bg-muted" />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              {[1, 2, 3].map((i) =>
              <div
                key={i}
                className="flex gap-4 border-b border-border pb-6">

                  <div className="h-32 w-32 animate-pulse rounded bg-muted" />
                  <div className="flex-1 space-y-3">
                    <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-1/4 animate-pulse rounded bg-muted" />
                    <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
                  </div>
                </div>
              )}
            </div>
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
          </div>
        </div>
      </>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (cartItems.length === 0) {
    return (
      <>
        <Header cartItemCount={0} />
        <EmptyCart />
      </>
    );
  }

  return (
    <>
      <Header cartItemCount={cartItems.length} />
      <div className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-medium text-text-primary md:text-5xl">
            Shopping Cart
          </h1>
          <p className="mt-2 text-base text-text-secondary">
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in
            your cart
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            {cartItems.map((item) =>
            <CartItem
              key={item.id}
              {...item}
              onQuantityChange={handleQuantityChange}
              onRemove={handleRemove} />

            )}
          </div>

          <div>
            <CartSummary subtotal={subtotal} tax={tax} total={total} />
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border bg-card p-6">
          <h3 className="mb-4 font-heading text-xl font-medium text-text-primary">
            Why Shop With Us?
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <p className="font-medium text-text-primary">
                Authentic Products
              </p>
              <p className="caption mt-1 text-text-secondary">
                100% genuine luxury fragrances from authorized distributors
              </p>
            </div>
            <div>
              <p className="font-medium text-text-primary">Secure Payment</p>
              <p className="caption mt-1 text-text-secondary">
                SSL encrypted checkout with multiple payment options
              </p>
            </div>
            <div>
              <p className="font-medium text-text-primary">Fast Delivery</p>
              <p className="caption mt-1 text-text-secondary">
                Express shipping available with tracking on all orders
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShoppingCartInteractive;
