import React from 'react';
import AppImage from '@/components/ui/AppImage';

interface CartItem {
  id: number;
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
  return (
    <div className="rounded-lg bg-card p-6 shadow-luxury">
      <h2 className="mb-6 font-heading text-2xl font-semibold text-text-primary">
        Order Summary
      </h2>

      <div className="mb-6 space-y-4">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md">
              <AppImage
                src={item.image}
                alt={item.alt}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <h3 className="font-body text-sm font-medium text-text-primary">
                  {item.name}
                </h3>
                <p className="mt-1 font-data text-xs text-text-secondary">
                  Size: {item.size}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-data text-sm text-text-secondary">
                  Qty: {item.quantity}
                </span>
                <span className="font-data text-sm font-medium text-text-primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">
            Subtotal
          </span>
          <span className="font-data text-sm text-text-primary">
            ${subtotal.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">
            Shipping
          </span>
          <span className="font-data text-sm text-text-primary">
            ${shipping.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-body text-sm text-text-secondary">Tax</span>
          <span className="font-data text-sm text-text-primary">
            ${tax.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
        <span className="font-heading text-lg font-semibold text-text-primary">
          Total
        </span>
        <span className="font-data text-xl font-bold text-primary">
          ${total.toFixed(2)}
        </span>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-md bg-muted p-3">
        <svg
          className="h-5 w-5 text-success"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
        <span className="caption text-text-secondary">
          Secure SSL Encrypted Payment
        </span>
      </div>
    </div>
  );
};

export default OrderSummary;