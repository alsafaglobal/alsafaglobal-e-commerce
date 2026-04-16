'use client';

import React from 'react';
import { useSiteContent, useSectionVisible } from '@/lib/content/SiteContentContext';

interface ScentNotesProps {
  topNotes: string[];
  heartNotes: string[];
  baseNotes: string[];
}

const ScentNotes: React.FC<ScentNotesProps> = ({
  topNotes,
  heartNotes,
  baseNotes,
}) => {
  const scentTitle = useSiteContent('product_scent_notes_title', 'Scent Notes');
  const labelTop = useSiteContent('product_label_top_notes', 'Top Notes');
  const labelHeart = useSiteContent('product_label_heart_notes', 'Heart Notes');
  const labelBase = useSiteContent('product_label_base_notes', 'Base Notes');
  const visible = useSectionVisible('product_scent_notes');
  if (!visible) return null;

  return (
    <div className="space-y-6 rounded-lg bg-card p-6 shadow-luxury-sm">
      <h2 className="font-heading text-2xl font-semibold text-text-primary">
        {scentTitle}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">{labelTop}</h3>
          <p className="mt-2 font-body text-text-primary">
            {topNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {labelHeart}
          </h3>
          <p className="mt-2 font-body text-text-primary">
            {heartNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-accent">
            {labelBase}
          </h3>
          <p className="mt-2 font-body text-text-primary">
            {baseNotes.join(', ')}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ScentNotes;