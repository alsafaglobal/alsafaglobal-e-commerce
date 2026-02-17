'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductImageGallery from './ProductImageGallery';
import ProductInfo from './ProductInfo';
import ScentNotes from './ScentNotes';
import SizeSelector from './SizeSelector';
import QuantitySelector from './QuantitySelector';
import AddToCartButton from './AddToCartButton';
import RelatedProducts from './RelatedProducts';
import Breadcrumb from './Breadcrumb';
import { createClient } from '@/lib/supabase/client';

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
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [selectedSize, setSelectedSize] = useState<Size>({
    volume: '50ml',
    price: 85.0
  });
  const [quantity, setQuantity] = useState(1);
  const [isHydrated, setIsHydrated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Product data state
  const [productName, setProductName] = useState('');
  const [productBrand, setProductBrand] = useState('');
  const [productDescription, setProductDescription] = useState('');
  const [productImages, setProductImages] = useState<ProductImage[]>([]);
  const [sizes, setSizes] = useState<Size[]>([]);
  const [topNotes, setTopNotes] = useState<string[]>([]);
  const [heartNotes, setHeartNotes] = useState<string[]>([]);
  const [baseNotes, setBaseNotes] = useState<string[]>([]);
  const [occasions, setOccasions] = useState<string[]>([]);
  const [scentType, setScentType] = useState('');
  const [relatedProducts, setRelatedProducts] = useState<RelatedProduct[]>([]);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    async function loadProduct() {
      const supabase = createClient();

      // If no product ID, load first product as default
      let query = supabase
        .from('products')
        .select('*, product_sizes(*), scent_notes(*), product_occasions(*)')
        .eq('is_active', true);

      if (productId) {
        query = query.eq('id', productId);
      }

      const { data } = await query.limit(1).single();

      if (data) {
        setProductName(data.name);
        setProductBrand(data.brand || '');
        setProductDescription(data.description || '');
        setScentType(data.scent_type || '');

        // Images
        const imgs: ProductImage[] = [];
        if (data.image_url) {
          imgs.push({ url: data.image_url, alt: data.image_alt || data.name });
        }
        setProductImages(imgs.length > 0 ? imgs : [{ url: 'https://images.unsplash.com/photo-1541643600914-78b084683601', alt: data.name }]);

        // Sizes
        const productSizes = (data.product_sizes || []).map((s: { volume_ml: number; price: number }) => ({
          volume: `${s.volume_ml}ml`,
          price: s.price,
        }));
        setSizes(productSizes);
        if (productSizes.length > 0) {
          setSelectedSize(productSizes[0]);
        }

        // Scent notes
        const notes = data.scent_notes || [];
        setTopNotes(notes.filter((n: { note_type: string }) => n.note_type === 'top').map((n: { note_name: string }) => n.note_name));
        setHeartNotes(notes.filter((n: { note_type: string }) => n.note_type === 'heart').map((n: { note_name: string }) => n.note_name));
        setBaseNotes(notes.filter((n: { note_type: string }) => n.note_type === 'base').map((n: { note_name: string }) => n.note_name));

        // Occasions
        setOccasions((data.product_occasions || []).map((o: { occasion: string }) => o.occasion));

        // Load related products (same scent type, different ID)
        const { data: related } = await supabase
          .from('products')
          .select('id, name, brand, price, image_url, image_alt')
          .eq('is_active', true)
          .eq('scent_type', data.scent_type)
          .neq('id', data.id)
          .limit(4);

        if (related) {
          setRelatedProducts(
            related.map((p) => ({
              id: p.id,
              name: p.name,
              brand: p.brand || '',
              price: p.price,
              image: p.image_url || '',
              alt: p.image_alt || p.name,
              rating: 4.5,
            }))
          );
        }
      }
      setLoading(false);
    }
    loadProduct();
  }, [productId]);

  const breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Home', path: '/home' },
    { label: 'Shop', path: '/shop-catalog' },
    { label: productName || 'Product', path: '/product-detail' }
  ];

  const handleSizeChange = (size: Size) => {
    setSelectedSize(size);
  };

  const handleQuantityChange = (newQuantity: number) => {
    setQuantity(newQuantity);
  };

  if (!isHydrated || loading) {
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
            productName={productName} />

          <div className="space-y-6">
            <ProductInfo
              name={productName}
              brand={productBrand}
              price={selectedSize.price}
              rating={4.8}
              reviewCount={342}
              description={productDescription}
              fragranceFamily={scentType}
              longevity="8-10 hours"
              occasions={occasions} />

            <div className="space-y-6 border-t border-border pt-6">
              <SizeSelector sizes={sizes} onSizeChange={handleSizeChange} />
              <QuantitySelector onQuantityChange={handleQuantityChange} />
              <AddToCartButton
                productName={productName}
                selectedSize={selectedSize.volume}
                quantity={quantity}
                price={selectedSize.price} />
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-12">
          <ScentNotes
            topNotes={topNotes}
            heartNotes={heartNotes}
            baseNotes={baseNotes} />
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-12 border-t border-border pt-12">
            <RelatedProducts products={relatedProducts} />
          </div>
        )}
      </div>
    </div>);
};

export default ProductDetailInteractive;
