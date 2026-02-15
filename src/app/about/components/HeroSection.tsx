import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
}

const HeroSection: React.FC<HeroSectionProps> = ({ title, subtitle }) => {
  return (
    <section className="relative bg-gradient-to-br from-secondary/30 via-background to-secondary/20 py-16 md:py-24">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-semibold text-text-primary md:text-5xl lg:text-6xl">
            {title}
          </h1>
          <p className="mx-auto mt-6 max-w-3xl font-body text-lg text-text-secondary md:text-xl">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;