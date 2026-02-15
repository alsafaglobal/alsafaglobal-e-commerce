'use client';

import React, { useState, useEffect } from 'react';
import HeroSection from './HeroSection';
import StorySection from './StorySection';
import ValuesGrid from './ValuesGrid';
import CraftsmanshipSection from './CraftsmanshipSection';
import AwardsSection from './AwardsSection';
import CommitmentSection from './CommitmentSection';
import CTASection from './CTASection';

interface Value {
  icon: string;
  title: string;
  description: string;
}

interface CraftsmanshipStep {
  number: string;
  title: string;
  description: string;
}

interface Award {
  year: string;
  title: string;
  organization: string;
}

interface Commitment {
  icon: string;
  title: string;
  description: string;
}

const AboutContent: React.FC = () => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const heroData = {
    title: 'The Art of Timeless Elegance',
    subtitle: `Crafting exceptional fragrances since 1985, we blend traditional perfumery techniques with modern innovation to create scents that tell stories and evoke emotions.`
  };

  const storyData = {
    title: 'Our Heritage',
    content: [
    `Founded in the heart of Paris by master perfumer Jean-Claude Beaumont, our journey began with a simple vision: to create fragrances that transcend time and trends. For over three decades, we have remained committed to this founding principle.`,
    `Each perfume in our collection represents countless hours of dedication, combining rare ingredients sourced from around the world with innovative extraction techniques. Our atelier houses over 3,000 raw materials, each carefully selected for its unique olfactory properties.`,
    `Today, we continue to honor our heritage while embracing sustainable practices and ethical sourcing, ensuring that luxury and responsibility go hand in hand.`],

    imageSrc:
    "https://img.rocket.new/generatedImages/rocket_gen_img_16a8087b6-1767519450202.png",
    imageAlt:
    'Elegant perfume bottles displayed on marble surface with soft natural lighting in luxury boutique setting'
  };

  const valuesData: Value[] = [
  {
    icon: 'SparklesIcon',
    title: 'Excellence',
    description: `We pursue perfection in every aspect of our craft, from ingredient selection to final presentation, ensuring each fragrance meets our exacting standards.`
  },
  {
    icon: 'HeartIcon',
    title: 'Passion',
    description: `Our love for perfumery drives us to explore new olfactory territories while respecting the timeless traditions of French perfume-making.`
  },
  {
    icon: 'GlobeAltIcon',
    title: 'Sustainability',
    description: `We are committed to ethical sourcing and environmental responsibility, working directly with growers to ensure fair practices and ecological preservation.`
  },
  {
    icon: 'UserGroupIcon',
    title: 'Community',
    description: `We believe in building lasting relationships with our customers, suppliers, and artisans, creating a community united by appreciation for fine fragrance.`
  }];


  const craftsmanshipData: CraftsmanshipStep[] = [
  {
    number: '01',
    title: 'Ingredient Selection',
    description: `Our master perfumers travel the world to source the finest raw materials, from Bulgarian rose to Indonesian patchouli, ensuring authenticity and quality in every note.`
  },
  {
    number: '02',
    title: 'Composition',
    description: `Each fragrance is meticulously composed over months or even years, balancing top, heart, and base notes to create a harmonious and memorable scent experience.`
  },
  {
    number: '03',
    title: 'Maturation',
    description: `Like fine wine, our perfumes undergo a careful aging process, allowing the ingredients to marry and develop their full complexity and character.`
  },
  {
    number: '04',
    title: 'Quality Control',
    description: `Every batch is rigorously tested to ensure consistency, longevity, and adherence to our strict quality standards before it reaches your hands.`
  }];


  const craftsmanshipImage = {
    src: "https://img.rocket.new/generatedImages/rocket_gen_img_16b86ed99-1764763413688.png",
    alt: 'Master perfumer carefully measuring essential oils in traditional glass laboratory equipment with vintage brass scales'
  };

  const awardsData: Award[] = [
  {
    year: '2025',
    title: 'Best Luxury Fragrance Brand',
    organization: 'International Perfume Awards'
  },
  {
    year: '2024',
    title: 'Sustainable Beauty Excellence',
    organization: 'Global Sustainability Council'
  },
  {
    year: '2023',
    title: 'Innovation in Perfumery',
    organization: 'European Fragrance Federation'
  },
  {
    year: '2022',
    title: 'Heritage Brand of the Year',
    organization: 'Luxury Goods Association'
  },
  {
    year: '2021',
    title: 'Customer Choice Award',
    organization: 'Premium Beauty Magazine'
  },
  {
    year: '2020',
    title: 'Artisan Excellence Recognition',
    organization: 'French Perfumers Guild'
  }];


  const commitmentsData: Commitment[] = [
  {
    icon: 'CheckBadgeIcon',
    title: 'Premium Ingredients',
    description: `We use only the highest quality natural and synthetic ingredients, ensuring each fragrance delivers exceptional performance and longevity.`
  },
  {
    icon: 'ShieldCheckIcon',
    title: 'Ethical Sourcing',
    description: `Our supply chain is transparent and fair, supporting local communities and preserving traditional harvesting methods for rare botanicals.`
  },
  {
    icon: 'BeakerIcon',
    title: 'Cruelty-Free',
    description: `All our products are developed without animal testing, and we actively support initiatives to end cosmetic testing on animals worldwide.`
  }];


  const philosophyData = {
    title: 'Our Philosophy',
    content: [
    `We believe that a fragrance is more than just a pleasant scent—it is an expression of identity, a memory captured in a bottle, and an invisible accessory that completes your presence.`,
    `Our approach combines the artistry of traditional perfumery with cutting-edge technology. We honor the wisdom of master perfumers who came before us while embracing innovation that allows us to create more sustainable and longer-lasting fragrances.`,
    `Every bottle that leaves our atelier carries with it our promise of quality, authenticity, and the timeless elegance that has defined our brand for generations.`],

    imageSrc:
    "https://images.unsplash.com/photo-1677080232408-333ec77adeab",
    imageAlt:
    'Close-up of artisan hands carefully pouring golden perfume liquid into crystal bottle with precision and care'
  };

  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-8">
          <div className="space-y-16">
            <div className="h-64 animate-pulse rounded-lg bg-muted" />
            <div className="h-96 animate-pulse rounded-lg bg-muted" />
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4].map((i) =>
              <div key={i} className="h-48 animate-pulse rounded-lg bg-muted" />
              )}
            </div>
          </div>
        </div>
      </div>);

  }

  return (
    <div className="min-h-screen bg-background">
      <HeroSection title={heroData.title} subtitle={heroData.subtitle} />

      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <StorySection
          title={storyData.title}
          content={storyData.content}
          imageSrc={storyData.imageSrc}
          imageAlt={storyData.imageAlt}
          imagePosition="right" />


        <ValuesGrid values={valuesData} />

        <CraftsmanshipSection
          steps={craftsmanshipData}
          imageSrc={craftsmanshipImage.src}
          imageAlt={craftsmanshipImage.alt} />


        <AwardsSection awards={awardsData} />

        <StorySection
          title={philosophyData.title}
          content={philosophyData.content}
          imageSrc={philosophyData.imageSrc}
          imageAlt={philosophyData.imageAlt}
          imagePosition="left" />


        <CommitmentSection commitments={commitmentsData} />

        <CTASection />
      </div>
    </div>);

};

export default AboutContent;