'use client';

import React from 'react';
import { useSiteContent } from '@/lib/content/SiteContentContext';

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

  return (
    <div className="space-y-6 rounded-lg bg-card p-6 shadow-luxury-sm">
      <h2 className="font-heading text-2xl font-semibold text-text-primary">
        {scentTitle}
      </h2>

      <div className="space-y-4">
        <div>
          <h3 className="caption font-medium text-text-secondary">{labelTop}</h3>
          <p className="mt-2 font-body text-text-primary">
            {topNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="caption font-medium text-text-secondary">
            {labelHeart}
          </h3>
          <p className="mt-2 font-body text-text-primary">
            {heartNotes.join(', ')}
          </p>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="caption font-medium text-text-secondary">
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