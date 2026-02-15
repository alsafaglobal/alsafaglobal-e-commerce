'use client';

import React, { useState, useEffect } from 'react';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ScentNotes from './ScentNotes';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import RelatedProducts from './RelatedProducts';
import Breadcrumb from './Breadcrumb';

interface Size {
  volume: string;
  price: number;
}

interface ProductImage {
  url: string;
  alt: string;
}

interface RelatedProduct {
  id: number;
  name: string;
  brand: string;
  price: number;
  image: string;
  alt: string;
  rating: number;
}

interface BreadcrumbItem {
  label: string;
  path: string;
}

const ProductDetailInteractive: React.FC = () => {
  const [selectedSize, setSelectedSize] = useState<Size>({
    volume: '50ml',
    price: 85.0
  });
  const [quantity, setQuantity] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const productImages: ProductImage[] = [
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png",
    alt: 'Elegant glass perfume bottle with gold cap on white marble surface with soft lighting'
  },
  {
    url: "https://images.unsplash.com/photo-1594125396325-23d8db4b8623",
    alt: 'Close-up of luxury perfume bottle showing intricate glass details and amber liquid'
  },
  {
    url: "https://images.unsplash.com/photo-1730564798031-55dc12cef48a",
    alt: 'Perfume bottle surrounded by fresh pink roses and white flowers on cream background'
  },
  {
    url: "https://img.rocket.new/generatedImages/rocket_gen_img_102d9474f-1767210518253.png",
    alt: 'Luxury perfume bottle with ornate gold detailing on dark velvet surface'
  }];


  const sizes: Size[] = [
  { volume: '50ml', price: 85.0 },
  { volume: '100ml', price: 145.0 }];


  const relatedProducts: RelatedProduct[] = [
  {
    id: 2,
    name: 'Midnight Rose Eau de Parfum',
    brand: 'Maison Lumière',
    price: 92.0,
    image:
    "https://images.unsplash.com/photo-1684762870187-47219389c8f7",
    alt: 'Dark purple perfume bottle with silver accents on black marble surface',
    rating: 4.7
  },
  {
    id: 3,
    name: 'Ocean Breeze Fresh Cologne',
    brand: 'Aqua Essence',
    price: 68.0,
    image:
    "https://images.unsplash.com/photo-1614590297794-0224f7e1e240",
    alt: 'Light blue perfume bottle with wave design on sandy beach background',
    rating: 4.5
  },
  {
    id: 4,
    name: 'Amber Woods Intense',
    brand: 'Terra Luxe',
    price: 110.0,
    image:
    "https://images.unsplash.com/photo-1676994904360-94f50f3870d3",
    alt: 'Brown amber perfume bottle with wooden cap on rustic wood surface',
    rating: 4.9
  },
  {
    id: 5,
    name: 'Citrus Garden Eau Fraîche',
    brand: 'Jardin Parfums',
    price: 75.0,
    image:
    "https://images.unsplash.com/photo-1601808138313-f8fc2a971d15",
    alt: 'Yellow-tinted perfume bottle surrounded by fresh citrus fruits and green leaves',
    rating: 4.6
  }];


  const breadcrumbItems: BreadcrumbItem[] = [
  { label: 'Home', path: '/home' },
  { label: 'Shop', path: '/shop-catalog' },
  { label: 'Velvet Noir Eau de Parfum', path: '/product-detail' }];


  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
          <div className="h-6 w-64 animate-pulse rounded bg-muted" />
          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-6 w-1/2 animate-pulse rounded bg-muted" />
              <div className="h-24 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          <ProductImageGallery
            images={productImages}
            productName="Velvet Noir Eau de Parfum" />


          <div className="space-y-6">
            <ProductInfo
              name="Velvet Noir Eau de Parfum"
              brand="Élégance Royale"
              price={selectedSize.price}
              rating={4.8}
              reviewCount={342}
              description="Experience the captivating allure of Velvet Noir, a sophisticated fragrance that embodies timeless elegance and modern luxury. This exquisite eau de parfum opens with vibrant citrus notes, transitions into a heart of delicate florals, and settles into a warm, sensual base that lingers throughout the day."
              fragranceFamily="Oriental Floral"
              longevity="8-10 hours"
              occasions={['Evening Events', 'Special Occasions', 'Date Night']} />


            <div className="space-y-6 border-t border-border pt-6">
              <SizeSelector sizes={sizes} onSizeChange={handleSizeChange} />
              <QuantitySelector onQuantityChange={handleQuantityChange} />
              <AddToCartButton
                productName="Velvet Noir Eau de Parfum"
                selectedSize={selectedSize.volume}
                quantity={quantity}
                price={selectedSize.price} />

            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-12">
          <ScentNotes
            topNotes={['Bergamot', 'Pink Pepper', 'Mandarin']}
            heartNotes={['Rose', 'Jasmine', 'Violet']}
            baseNotes={['Vanilla', 'Sandalwood', 'Musk', 'Amber']} />

        </div>

        <div className="mt-12 border-t border-border pt-12">
          <RelatedProducts products={relatedProducts} />
        </div>
      </div>
    </div>);

};

export default ProductDetailInteractive;