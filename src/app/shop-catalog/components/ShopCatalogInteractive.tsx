'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import MobileFilterPanel from './MobileFilterPanel';
import ProductGrid from './ProductGrid';
import LoadingSkeleton from './LoadingSkeleton';
import { createClient } from '@/lib/supabase/client';

interface Product {
  id: number;
  name: string;
  price: number;
  scentType: string;
  image: string;
  alt: string;
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
  sizes: number[];
  description: string;
}

const ShopCatalogInteractive: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Fetch products from Supabase
  useEffect(() => {
    async function loadProducts() {
      const supabase = createClient();
      const { data } = await supabase
        .from('products')
        .select('*, product_sizes(*), scent_notes(*)')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data) {
        setProducts(
          data.map((p) => ({
            id: p.id,
            name: p.name,
            price: p.price,
            scentType: p.scent_type || '',
            image: p.image_url || '',
            alt: p.image_alt || p.name,
            topNotes: (p.scent_notes || [])
              .filter((n: { note_type: string }) => n.note_type === 'top')
              .map((n: { note_name: string }) => n.note_name),
            heartNotes: (p.scent_notes || [])
              .filter((n: { note_type: string }) => n.note_type === 'heart')
              .map((n: { note_name: string }) => n.note_name),
            baseNotes: (p.scent_notes || [])
              .filter((n: { note_type: string }) => n.note_type === 'base')
              .map((n: { note_name: string }) => n.note_name),
            sizes: (p.product_sizes || []).map((s: { volume_ml: number }) => s.volume_ml),
            description: p.description || '',
          }))
        );
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    const query = searchParams.get('search') || '';
    const filters = searchParams.get('filters')?.split(',').filter(Boolean) || [];

    setSearchQuery(query);
    setSelectedFilters(filters);

    setTimeout(() => {
      setIsLoading(false);
    }, 800);
  }, [isHydrated, searchParams]);

  const filteredProducts = useMemo(() => {
    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedFilters.length > 0) {
      filtered = filtered.filter((product) =>
      selectedFilters.includes(product.scentType)
      );
    }

    return filtered;
  }, [searchQuery, selectedFilters, products]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Floral: 0,
      Woody: 0,
      Fresh: 0,
      Oriental: 0
    };

    const searchFiltered = searchQuery ?
    products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) :
    products;

    searchFiltered.forEach((product) => {
      if (counts[product.scentType] !== undefined) {
        counts[product.scentType]++;
      }
    });

    return counts;
  }, [searchQuery, products]);

  const handleSearchChange = (query: string) => {
    if (!isHydrated) return;

    setSearchQuery(query);
    setIsLoading(true);

    const params = new URLSearchParams();
    if (query) params.set('search', query);
    if (selectedFilters.length > 0) params.set('filters', selectedFilters.join(','));

    router.push(`/shop-catalog${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleFilterToggle = (filter: string) => {
    if (!isHydrated) return;

    setIsLoading(true);

    const newFilters = selectedFilters.includes(filter) ?
    selectedFilters.filter((f) => f !== filter) :
    [...selectedFilters, filter];

    setSelectedFilters(newFilters);

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (newFilters.length > 0) params.set('filters', newFilters.join(','));

    router.push(`/shop-catalog${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const handleClearAllFilters = () => {
    if (!isHydrated) return;

    setIsLoading(true);
    setSelectedFilters([]);

    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);

    router.push(`/shop-catalog${params.toString() ? `?${params.toString()}` : ''}`, { scroll: false });

    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
          <div className="mb-8">
            <div className="mb-6 h-12 w-full animate-pulse rounded-lg bg-muted" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) =>
              <div key={i} className="h-10 w-24 animate-pulse rounded-full bg-muted" />
              )}
            </div>
          </div>
          <LoadingSkeleton />
        </div>
      </div>);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-6 lg:px-8">
        <div className="mb-8">
          <div className="mb-6 flex items-center justify-between">
            <h1 className="font-heading text-3xl font-bold text-text-primary md:text-4xl">
              Luxury Perfume Collection
            </h1>
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 font-body text-sm font-medium text-primary-foreground shadow-luxury transition-luxury hover:opacity-90 md:hidden">

              <Icon name="AdjustmentsHorizontalIcon" size={20} />
              Filters
              {selectedFilters.length > 0 &&
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent font-data text-xs text-accent-foreground">
                  {selectedFilters.length}
                </span>
              }
            </button>
          </div>

          <div className="mb-6">
            <SearchBar
              searchQuery={searchQuery}
              onSearchChange={handleSearchChange}
              resultCount={filteredProducts.length} />
          </div>

          <div className="mb-6 hidden items-center justify-between md:flex">
            <FilterChips
              selectedFilters={selectedFilters}
              onFilterToggle={handleFilterToggle}
              filterCounts={filterCounts} />

            {selectedFilters.length > 0 &&
            <button
              onClick={handleClearAllFilters}
              className="font-body text-sm font-medium text-primary transition-luxury hover:text-accent">
                Clear All Filters
              </button>
            }
          </div>

          <div className="mb-4 flex items-center justify-between">
            <p className="font-body text-sm text-text-secondary">
              Showing {filteredProducts.length} of {products.length} perfumes
            </p>
          </div>
        </div>

        {isLoading ? <LoadingSkeleton /> : <ProductGrid products={filteredProducts} />}
      </div>

      <MobileFilterPanel
        isOpen={isMobileFilterOpen}
        onClose={() => setIsMobileFilterOpen(false)}
        selectedFilters={selectedFilters}
        onFilterToggle={handleFilterToggle}
        filterCounts={filterCounts}
        onClearAll={handleClearAllFilters} />
    </div>);
};

export default ShopCatalogInteractive;
