'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const ContactContent: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const contactDetails = [
    {
      icon: 'EnvelopeIcon',
      label: 'Email',
      lines: ['info@alsafaglobal.com'],
    },
    {
      icon: 'PhoneIcon',
      label: 'Phone',
      lines: ['00971 4 3741 969'],
    },
    {
      icon: 'MapPinIcon',
      label: 'Address',
      lines: [
        'Al Safa Global General Trading FZ LLC FDBC3472',
        'Compass Building, Al Shohada Road',
        'Al Hamra Industrial Zone-FZ',
        'P.O. Box 10055',
        'Ras Al Khaimah, United Arab Emirates',
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-12 md:px-6 md:py-16 lg:px-8">
      {/* Page heading */}
      <div className="mb-12 text-center">
        <h1 className="font-heading text-4xl font-semibold text-text-primary md:text-5xl">
          Contact Us
        </h1>
        <p className="mx-auto mt-4 max-w-2xl font-body text-base text-text-secondary md:text-lg">
          We&apos;d love to hear from you. Send us a message and we&apos;ll
          respond as soon as possible.
        </p>
      </div>

      <div className="grid gap-12 lg:grid-cols-3">
        {/* Contact details */}
        <div className="space-y-8">
          {contactDetails.map((detail) => (
            <div key={detail.label} className="flex items-start gap-4">
              <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Icon name={detail.icon} size={22} className="text-primary" />
              </div>
              <div>
                <p className="font-body text-sm font-medium text-text-secondary">
                  {detail.label}
                </p>
                <div className="mt-1 space-y-0.5">
                  {detail.lines.map((line, i) => (
                    <p key={i} className="font-body text-base text-text-primary">
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact form */}
        <div className="lg:col-span-2">
          {submitted ? (
            <div className="flex flex-col items-center justify-center rounded-lg bg-success/10 px-8 py-16 text-center shadow-luxury-sm">
              <Icon
                name="CheckCircleIcon"
                size={56}
                className="mb-4 text-success"
              />
              <h2 className="font-heading text-2xl font-semibold text-text-primary">
                Message Sent!
              </h2>
              <p className="mt-3 font-body text-base text-text-secondary">
                Thank you for reaching out. We&apos;ll get back to you within
                1–2 business days.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', subject: '', message: '' });
                }}
                className="mt-8 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="rounded-lg bg-card p-8 shadow-luxury-sm"
            >
              <div className="grid gap-6 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1 block font-body text-sm font-medium text-text-primary"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1 block font-body text-sm font-medium text-text-primary"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="subject"
                  className="mb-1 block font-body text-sm font-medium text-text-primary"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  type="text"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="How can we help?"
                  className="w-full rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="mt-6">
                <label
                  htmlFor="message"
                  className="mb-1 block font-body text-sm font-medium text-text-primary"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={6}
                  required
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full resize-none rounded-md border border-border bg-input px-4 py-3 font-body text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <button
                type="submit"
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-base font-medium text-primary-foreground transition-luxury hover:opacity-90 sm:w-auto"
              >
                Send Message
                <Icon name="PaperAirplaneIcon" size={18} className="text-primary-foreground" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactContent;
