'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setEmail('');
        setIsSubmitted(false);
      }, 3000);
    }
  };

  return (
    <section className="w-full bg-primary py-16 md:py-20">
      <div className="mx-auto max-w-[1440px] px-4 md:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <Icon
            name="EnvelopeIcon"
            size={48}
            className="mx-auto mb-6 text-primary-foreground"
          />
          
          <h2 className="mb-4 font-heading text-3xl font-bold text-primary-foreground md:text-4xl">
            Join Our Exclusive Circle
          </h2>
          
          <p className="mb-8 font-body text-lg text-primary-foreground/90">
            Subscribe to receive early access to new collections, exclusive offers, and fragrance tips from our experts
          </p>
          
          {isSubmitted ? (
            <div className="flex items-center justify-center gap-2 rounded-lg bg-success px-6 py-4 text-success-foreground">
              <Icon name="CheckCircleIcon" size={24} />
              <span className="font-body font-medium">
                Thank you for subscribing!
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="mx-auto max-w-md">
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 rounded-lg border-2 border-primary-foreground/20 bg-primary-foreground/10 px-4 py-3 font-body text-primary-foreground placeholder:text-primary-foreground/60 focus:border-primary-foreground/40 focus:outline-none"
                />
                
                <button
                  type="submit"
                  className="rounded-lg bg-accent px-6 py-3 font-body font-medium text-accent-foreground shadow-luxury transition-luxury hover:bg-accent/90 hover:shadow-luxury-md"
                >
                  Subscribe
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;