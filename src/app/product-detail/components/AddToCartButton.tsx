'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';
import { useCart } from '@/lib/cart/CartContext';

interface AddToCartButtonProps {
  productId: string;
  productName: string;
  selectedSize: string;
  quantity: number;
  price: number;
  image: string;
  imageAlt: string;
}

const AddToCartButton: React.FC<AddToCartButtonProps> = ({
  productId,
  productName,
  selectedSize,
  quantity,
  price,
  image,
  imageAlt,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const router = useRouter();
  const { addItem } = useCart();
  const addToCartText = useSiteContent('product_add_to_cart_text', 'Add to Cart');
  const buyNowText = useSiteContent('product_buy_now_text', 'Buy Now');
  const addingText = useSiteContent('product_adding_text', 'Adding...');
  const addedText = useSiteContent('product_added_text', 'Added to Cart!');

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const handleAddToCart = () => {
    setIsAdding(true);

    addItem({
      id: productId,
      name: productName,
      size: selectedSize,
      price,
      quantity,
      image,
      alt: imageAlt,
    });

    setTimeout(() => {
      setIsAdding(false);
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
      }, 2000);
    }, 500);
  };

  const handleBuyNow = () => {
    addItem({
      id: productId,
      name: productName,
      size: selectedSize,
      price,
      quantity,
      image,
      alt: imageAlt,
    });
    router.push('/shopping-cart');
  };

  if (!isHydrated) {
    return (
      <div className="space-y-3">
        <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
        <div className="h-12 w-full animate-pulse rounded-md bg-muted" />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body font-medium text-primary-foreground shadow-luxury-sm transition-luxury hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isAdding ? (
          <>
            <Icon
              name="ArrowPathIcon"
              size={20}
              className="animate-spin text-primary-foreground"
            />
            <span>{addingText}</span>
          </>
        ) : showSuccess ? (
          <>
            <Icon
              name="CheckCircleIcon"
              size={20}
              className="text-primary-foreground"
            />
            <span>{addedText}</span>
          </>
        ) : (
          <>
            <Icon
              name="ShoppingCartIcon"
              size={20}
              className="text-primary-foreground"
            />
            <span>{addToCartText}</span>
          </>
        )}
      </button>

      <button
        onClick={handleBuyNow}
        className="flex w-full items-center justify-center gap-2 rounded-md border-2 border-primary bg-background px-6 py-3 font-body font-medium text-primary transition-luxury hover:bg-primary hover:text-primary-foreground"
      >
        <span>{buyNowText}</span>
        <Icon name="ArrowRightIcon" size={20} />
      </button>

      {showSuccess && (
        <p className="caption text-center text-success">
          {quantity}x {productName} ({selectedSize}) added to your cart
        </p>
      )}
    </div>
  );
};

export default AddToCartButton;
