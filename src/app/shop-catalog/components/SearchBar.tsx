'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useSiteContent } from '@/lib/content/SiteContentContext';

interface SearchBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  resultCount: number;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchQuery,
  onSearchChange,
  resultCount,
}) => {
  const searchPlaceholder = useSiteContent('shop_search_placeholder', 'Search perfumes by name...');
  return (
    <div className="w-full">
      <div className="relative">
        <Icon
          name="MagnifyingGlassIcon"
          size={20}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={searchPlaceholder}
          className="w-full rounded-lg border border-border bg-input px-12 py-3 font-body text-base text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring transition-luxury"
          aria-label="Search perfumes"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-luxury"
            aria-label="Clear search"
          >
            <Icon name="XMarkIcon" size={20} />
          </button>
        )}
      </div>
      {searchQuery && (
        <p className="mt-2 font-body text-sm text-text-secondary">
          Found {resultCount} {resultCount === 1 ? 'perfume' : 'perfumes'} matching "{searchQuery}"
        </p>
      )}
    </div>
  );
};

export default SearchBar;