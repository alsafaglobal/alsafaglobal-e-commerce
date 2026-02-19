'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface CartItemProps {
  id: string;
  name: string;
  size: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  onQuantityChange: (id: string, newQuantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({
  id, name, size, price, quantity, image, alt, onQuantityChange, onRemove,
}) => {
  const labelSize = useSiteContent('cart_label_size', 'Size');
  const btnRemove = useSiteContent('cart_btn_remove', 'Remove');

  const handleIncrement = () => onQuantityChange(id, quantity + 1);
  const handleDecrement = () => { if (quantity > 1) onQuantityChange(id, quantity - 1); };
  const handleRemove = () => { if (window.confirm(`Remove ${name} from cart?`)) onRemove(id); };

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-6 transition-luxury hover:bg-muted/30 sm:flex-row sm:items-center sm:gap-6 sm:pb-8">
      <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-md bg-muted">
        <AppImage src={image} alt={alt} className="h-full w-full object-cover transition-luxury hover:scale-105" />
      </div>

      <div className="flex flex-1 flex-col gap-2">
        <h3 className="font-heading text-lg font-medium text-text-primary sm:text-xl">{name}</h3>
        <p className="caption text-text-secondary">{labelSize}: {size}</p>
        <p className="font-data text-lg font-medium text-primary">${price.toFixed(2)}</p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-start">
        <div className="flex items-center gap-3 rounded-md border border-border bg-card p-1">
          <button onClick={handleDecrement} disabled={quantity <= 1}
            className="flex h-8 w-8 items-center justify-center rounded transition-luxury hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Decrease quantity">
            <Icon name="MinusIcon" size={16} className="text-text-primary" />
          </button>
          <span className="font-data w-8 text-center text-base font-medium text-text-primary">{quantity}</span>
          <button onClick={handleIncrement}
            className="flex h-8 w-8 items-center justify-center rounded transition-luxury hover:bg-muted"
            aria-label="Increase quantity">
            <Icon name="PlusIcon" size={16} className="text-text-primary" />
          </button>
        </div>

        <button onClick={handleRemove}
          className="flex items-center gap-2 text-sm text-text-secondary transition-luxury hover:text-error"
          aria-label={`Remove ${name} from cart`}>
          <Icon name="TrashIcon" size={20} />
          <span className="sm:hidden">{btnRemove}</span>
        </button>
      </div>
    </div>
  );
};

export default CartItem;
