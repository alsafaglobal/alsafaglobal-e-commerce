'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface QuantitySelectorProps {
  onQuantityChange: (quantity: number) => void;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  onQuantityChange,
}) => {
  const [quantity, setQuantity] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      onQuantityChange(quantity);
    }
  }, [quantity, onQuantityChange, isHydrated]);

  const handleIncrement = () => {
    if (quantity < 10) {
      setQuantity(quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  if (!isHydrated) {
    return (
      <div className="space-y-3">
        <p className="caption font-medium text-text-secondary">Quantity</p>
        <div className="h-12 w-32 animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="caption font-medium text-text-secondary">Quantity</p>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrement}
          disabled={quantity <= 1}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition-luxury hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="MinusIcon" size={20} className="text-text-primary" />
        </button>
        <span className="data-text w-12 text-center text-lg font-medium text-text-primary">
          {quantity}
        </span>
        <button
          onClick={handleIncrement}
          disabled={quantity >= 10}
          className="flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card transition-luxury hover:bg-muted disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Icon name="PlusIcon" size={20} className="text-text-primary" />
        </button>
      </div>
    </div>
  );
};

export default QuantitySelector;