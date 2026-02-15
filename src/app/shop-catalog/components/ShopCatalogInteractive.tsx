'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import SearchBar from './SearchBar';
import FilterChips from './FilterChips';
import MobileFilterPanel from './MobileFilterPanel';
import ProductGrid from './ProductGrid';
import LoadingSkeleton from './LoadingSkeleton';

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

  const searchParams = useSearchParams();
  const router = useRouter();

  const mockProducts: Product[] = [
  {
    id: 1,
    name: "Midnight Rose Elegance",
    price: 125.00,
    scentType: "Floral",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png",
    alt: "Elegant glass perfume bottle with rose gold cap on marble surface surrounded by fresh pink roses",
    topNotes: ["Rose", "Bergamot", "Pink Pepper"],
    heartNotes: ["Jasmine", "Peony", "Violet"],
    baseNotes: ["Musk", "Sandalwood", "Amber"],
    sizes: [50, 100],
    description: "A sophisticated floral fragrance that captures the essence of midnight blooming roses with a modern twist."
  },
  {
    id: 2,
    name: "Cedarwood Noir",
    price: 145.00,
    scentType: "Woody",
    image: "https://images.unsplash.com/photo-1647009822729-0076c73fe6f0",
    alt: "Dark amber perfume bottle with black cap on wooden surface with cedar wood chips",
    topNotes: ["Bergamot", "Cardamom", "Grapefruit"],
    heartNotes: ["Cedarwood", "Vetiver", "Cypress"],
    baseNotes: ["Leather", "Patchouli", "Tonka Bean"],
    sizes: [50, 100],
    description: "An intense woody fragrance with deep cedarwood notes and a touch of leather for the modern gentleman."
  },
  {
    id: 3,
    name: "Ocean Breeze Aqua",
    price: 95.00,
    scentType: "Fresh",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_14023ba79-1764719212053.png",
    alt: "Clear blue perfume bottle with silver cap on white surface with water droplets and sea shells",
    topNotes: ["Sea Salt", "Lemon", "Mint"],
    heartNotes: ["Marine Accord", "Lavender", "Sage"],
    baseNotes: ["Driftwood", "Musk", "Amber"],
    sizes: [50, 100],
    description: "A refreshing aquatic fragrance that evokes the crisp ocean breeze and coastal serenity."
  },
  {
    id: 4,
    name: "Amber Mystique",
    price: 165.00,
    scentType: "Oriental",
    image: "https://images.unsplash.com/photo-1551028679-ca459b363f98",
    alt: "Ornate gold perfume bottle with intricate patterns on burgundy velvet with amber crystals",
    topNotes: ["Saffron", "Cinnamon", "Orange Blossom"],
    heartNotes: ["Rose", "Oud", "Incense"],
    baseNotes: ["Amber", "Vanilla", "Benzoin"],
    sizes: [50, 100],
    description: "An opulent oriental fragrance with rich amber and exotic spices that create an aura of mystery."
  },
  {
    id: 5,
    name: "Lavender Fields Forever",
    price: 110.00,
    scentType: "Floral",
    image: "https://images.unsplash.com/photo-1599599810907-47da438b0404",
    alt: "Purple glass perfume bottle with silver cap on white surface surrounded by fresh lavender sprigs",
    topNotes: ["Lavender", "Bergamot", "Lemon"],
    heartNotes: ["Geranium", "Clary Sage", "Violet"],
    baseNotes: ["Vanilla", "Tonka Bean", "Musk"],
    sizes: [50, 100],
    description: "A timeless floral fragrance featuring the calming essence of French lavender fields in full bloom."
  },
  {
    id: 6,
    name: "Sandalwood Serenity",
    price: 135.00,
    scentType: "Woody",
    image: "https://images.unsplash.com/photo-1597142177539-ca0e89ba8a11",
    alt: "Minimalist beige perfume bottle with wooden cap on natural wood surface with sandalwood pieces",
    topNotes: ["Cardamom", "Neroli", "Bergamot"],
    heartNotes: ["Sandalwood", "Cedar", "Iris"],
    baseNotes: ["Musk", "Amber", "Vanilla"],
    sizes: [50, 100],
    description: "A warm woody fragrance centered around creamy sandalwood with subtle spice and floral undertones."
  },
  {
    id: 7,
    name: "Citrus Sunrise",
    price: 85.00,
    scentType: "Fresh",
    image: "https://images.unsplash.com/photo-1596702874967-7e9e5c286604",
    alt: "Bright yellow perfume bottle with gold cap on white surface with fresh citrus fruits and green leaves",
    topNotes: ["Grapefruit", "Lemon", "Mandarin"],
    heartNotes: ["Neroli", "Petitgrain", "Basil"],
    baseNotes: ["White Musk", "Vetiver", "Cedarwood"],
    sizes: [50, 100],
    description: "An energizing fresh fragrance bursting with vibrant citrus notes perfect for daytime wear."
  },
  {
    id: 8,
    name: "Spice Bazaar",
    price: 155.00,
    scentType: "Oriental",
    image: "https://images.unsplash.com/photo-1733348874609-6db37f57e60d",
    alt: "Red and gold ornate perfume bottle on dark wooden surface with exotic spices and silk fabric",
    topNotes: ["Cardamom", "Black Pepper", "Bergamot"],
    heartNotes: ["Cinnamon", "Clove", "Rose"],
    baseNotes: ["Oud", "Patchouli", "Amber"],
    sizes: [50, 100],
    description: "An exotic oriental fragrance inspired by ancient spice markets with rich, warm, and sensual notes."
  },
  {
    id: 9,
    name: "White Gardenia Dream",
    price: 120.00,
    scentType: "Floral",
    image: "https://img.rocket.new/generatedImages/rocket_gen_img_15ac54666-1768927507132.png",
    alt: "White frosted perfume bottle with silver cap on marble surface with white gardenia flowers",
    topNotes: ["Gardenia", "Tuberose", "Green Notes"],
    heartNotes: ["Jasmine", "Ylang-Ylang", "Orange Blossom"],
    baseNotes: ["Sandalwood", "Musk", "Coconut"],
    sizes: [50, 100],
    description: "A luxurious floral fragrance featuring the intoxicating scent of white gardenia in full bloom."
  },
  {
    id: 10,
    name: "Pine Forest Escape",
    price: 130.00,
    scentType: "Woody",
    image: "https://images.unsplash.com/photo-1670700000151-e150b17fd140",
    alt: "Green glass perfume bottle with wooden cap on moss-covered surface with pine cones and evergreen branches",
    topNotes: ["Pine", "Juniper", "Eucalyptus"],
    heartNotes: ["Cypress", "Fir Balsam", "Rosemary"],
    baseNotes: ["Cedarwood", "Oakmoss", "Musk"],
    sizes: [50, 100],
    description: "A crisp woody fragrance that transports you to a serene pine forest with every spray."
  },
  {
    id: 11,
    name: "Mint Mojito Fresh",
    price: 90.00,
    scentType: "Fresh",
    image: "https://images.unsplash.com/photo-1622978147891-70dc125a4727",
    alt: "Clear glass perfume bottle with chrome cap on white surface with fresh mint leaves and lime slices",
    topNotes: ["Mint", "Lime", "Ginger"],
    heartNotes: ["Green Tea", "Basil", "Cucumber"],
    baseNotes: ["White Musk", "Vetiver", "Amber"],
    sizes: [50, 100],
    description: "A refreshing and invigorating fragrance with cool mint and zesty lime notes perfect for summer."
  },
  {
    id: 12,
    name: "Velvet Oud Royale",
    price: 185.00,
    scentType: "Oriental",
    image: "https://images.unsplash.com/photo-1723391962166-6d9bb8a3d3e7",
    alt: "Luxurious black and gold perfume bottle with jeweled cap on purple velvet with gold chains",
    topNotes: ["Saffron", "Nutmeg", "Cardamom"],
    heartNotes: ["Oud", "Rose", "Jasmine"],
    baseNotes: ["Amber", "Leather", "Musk"],
    sizes: [50, 100],
    description: "An opulent oriental masterpiece featuring rare oud wood and precious saffron for ultimate luxury."
  }];


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
    let filtered = mockProducts;

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
  }, [searchQuery, selectedFilters]);

  const filterCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Floral: 0,
      Woody: 0,
      Fresh: 0,
      Oriental: 0
    };

    const searchFiltered = searchQuery ?
    mockProducts.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) :
    mockProducts;

    searchFiltered.forEach((product) => {
      counts[product.scentType]++;
    });

    return counts;
  }, [searchQuery]);

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
              Showing {filteredProducts.length} of {mockProducts.length} perfumes
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