import React from 'react';
import AppImage from '@/components/ui/AppImage';

interface StorySectionProps {
  title: string;
  content: string[];
  imageSrc: string;
  imageAlt: string;
  imagePosition: 'left' | 'right';
}

const StorySection: React.FC<StorySectionProps> = ({
  title,
  content,
  imageSrc,
  imageAlt,
  imagePosition,
}) => {
  return (
    <section className="py-12 md:py-16">
      <div
        className={`flex flex-col gap-8 ${
          imagePosition === 'right' ? 'lg:flex-row' : 'lg:flex-row-reverse'
        } items-center`}
      >
        <div className="w-full lg:w-1/2">
          <div className="overflow-hidden rounded-lg shadow-luxury">
            <AppImage
              src={imageSrc}
              alt={imageAlt}
              className="h-[400px] w-full object-cover transition-luxury hover:scale-105 md:h-[500px]"
            />
          </div>
        </div>

        <div className="w-full lg:w-1/2">
          <h2 className="font-heading text-3xl font-semibold text-text-primary md:text-4xl">
            {title}
          </h2>
          <div className="mt-6 space-y-4">
            {content.map((paragraph, index) => (
              <p
                key={index}
                className="font-body text-base leading-relaxed text-text-secondary md:text-lg"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default StorySection;