'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { createClient } from '@/lib/supabase/client';

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [content, setContent] = useState({
    newsletter_title: 'Join Our Exclusive Circle',
    newsletter_subtitle: 'Subscribe to receive early access to new collections, exclusive offers, and fragrance tips from our experts',
  });

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from('site_content')
        .select('key, value')
        .in('key', ['newsletter_title', 'newsletter_subtitle']);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((row) => { map[row.key] = row.value; });
        setContent((prev) => ({ ...prev, ...map }));
      }
    }
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!email) return;

    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setEmail('');
          setIsSubmitted(false);
        }, 3000);
      } else {
        const data = await res.json();
        setError(data.error === 'Already subscribed' ? 'You are already subscribed!' : 'Something went wrong. Please try again.');
      }
    } catch {
      setError('Something went wrong. Please try again.');
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
            {content.newsletter_title}
          </h2>

          <p className="mb-8 font-body text-lg text-primary-foreground/90">
            {content.newsletter_subtitle}
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
              {error && (
                <p className="mt-3 font-body text-sm text-primary-foreground/80">{error}</p>
              )}
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
