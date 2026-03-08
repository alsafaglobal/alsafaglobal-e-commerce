'use client';

import React from 'react';
import Image from 'next/image';
import { useSiteContent, useSiteContentJSON } from '@/lib/content/SiteContentContext';

const defaultStoryParagraphs = [
  { text: 'Founded in 2010, Al Safa Global began with a simple vision: to bring the world\'s finest fragrances to discerning individuals who appreciate the art of perfumery.' },
  { text: 'Inspired by the rich heritage of Arabian perfumery and the sophistication of global fragrance traditions, Al Safa Global has grown into an online global store offering a carefully curated collection of niche and long-lasting fragrances. Each scent is selected for its exceptional quality, distinctive character, and ability to leave a lasting impression.' },
  { text: 'Today, Al Safa Global is recognized as a trusted destination for fragrance enthusiasts worldwide who seek unique, refined scents that embody elegance, individuality, and timeless luxury. Every bottle represents a sensory journey crafted for those who value sophistication and authenticity.' },
];

const AboutContent: React.FC = () => {
  const storyParagraphs = useSiteContentJSON<{ text: string }[]>('about_story_content', defaultStoryParagraphs);
  const bannerImage = useSiteContent('about_banner_image', '');

  return (
    <>
      {/* Full-width banner image */}
      {bannerImage && (
        <div className="relative h-64 w-full overflow-hidden md:h-80 lg:h-96">
          <Image
            src={bannerImage}
            alt="About Al Safa Global"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      )}

      <div className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24 lg:px-8">
        <h1 className="mb-10 font-heading text-4xl font-semibold text-text-primary md:text-5xl">
          About Us
        </h1>
        <div className="space-y-6">
          {storyParagraphs.map((p, i) => (
            <p key={i} className="font-body text-base leading-relaxed text-text-secondary md:text-lg">
              {p.text}
            </p>
          ))}
        </div>
      </div>
    </>
  );
};

export default AboutContent;
