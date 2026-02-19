'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import JsonArrayEditor from './components/JsonArrayEditor';
import JsonLinksEditor from './components/JsonLinksEditor';

/* ------------------------------------------------------------------ */
/*  Tab & field definitions                                           */
/* ------------------------------------------------------------------ */

interface TextField { key: string; label: string; type: 'text' | 'textarea' }
interface JsonArrayField {
  key: string; label: string; type: 'json_array';
  fields: { name: string; label: string; type: 'text' | 'textarea' }[];
}
interface JsonLinksField { key: string; label: string; type: 'json_links' }
interface ToggleField { key: string; label: string; type: 'toggle' }

type FieldDef = TextField | JsonArrayField | JsonLinksField | ToggleField;

interface Section { title: string; keys: FieldDef[] }
interface Tab { id: string; label: string; icon: string; sections: Section[] }

const tabs: Tab[] = [
  {
    id: 'home', label: 'Home Page', icon: 'HomeIcon',
    sections: [
      {
        title: 'Hero Section',
        keys: [
          { key: 'hero_title', label: 'Headline', type: 'text' },
          { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'hero_button_text', label: 'Button Text', type: 'text' },
        ],
      },
      {
        title: 'Category Showcase',
        keys: [
          { key: 'category_showcase_title', label: 'Section Title', type: 'text' },
          { key: 'category_showcase_subtitle', label: 'Section Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Featured Products',
        keys: [
          { key: 'featured_title', label: 'Section Title', type: 'text' },
          { key: 'featured_subtitle', label: 'Section Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Newsletter',
        keys: [
          { key: 'newsletter_title', label: 'Title', type: 'text' },
          { key: 'newsletter_subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'newsletter_placeholder', label: 'Input Placeholder', type: 'text' },
          { key: 'newsletter_button_text', label: 'Button Text', type: 'text' },
          { key: 'newsletter_success_message', label: 'Success Message', type: 'text' },
        ],
      },
      {
        title: 'Footer',
        keys: [
          { key: 'footer_tagline', label: 'Footer Description', type: 'textarea' },
          { key: 'footer_copyright_text', label: 'Copyright Text', type: 'text' },
          { key: 'footer_heading_shop', label: 'Shop Column Heading', type: 'text' },
          { key: 'footer_links_shop', label: 'Shop Links', type: 'json_links' },
          { key: 'footer_heading_company', label: 'Company Column Heading', type: 'text' },
          { key: 'footer_links_company', label: 'Company Links', type: 'json_links' },
          { key: 'footer_heading_support', label: 'Support Column Heading', type: 'text' },
          { key: 'footer_links_support', label: 'Support Links', type: 'json_links' },
        ],
      },
    ],
  },
  {
    id: 'shop', label: 'Shop & Product', icon: 'ShoppingBagIcon',
    sections: [
      {
        title: 'Shop Catalog',
        keys: [
          { key: 'shop_page_heading', label: 'Page Heading', type: 'text' },
          { key: 'shop_search_placeholder', label: 'Search Placeholder', type: 'text' },
          { key: 'shop_empty_title', label: 'Empty State Title', type: 'text' },
          { key: 'shop_empty_subtitle', label: 'Empty State Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Product Detail',
        keys: [
          { key: 'product_breadcrumb_home', label: 'Breadcrumb: Home', type: 'text' },
          { key: 'product_breadcrumb_shop', label: 'Breadcrumb: Shop', type: 'text' },
          { key: 'product_related_title', label: 'Related Products Title', type: 'text' },
          { key: 'product_label_fragrance_family', label: 'Label: Fragrance Family', type: 'text' },
          { key: 'product_label_longevity', label: 'Label: Longevity', type: 'text' },
          { key: 'product_label_occasions', label: 'Label: Occasions', type: 'text' },
          { key: 'product_label_select_size', label: 'Label: Select Size', type: 'text' },
          { key: 'product_add_to_cart_text', label: 'Add to Cart Button', type: 'text' },
          { key: 'product_buy_now_text', label: 'Buy Now Button', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'about', label: 'About Page', icon: 'InformationCircleIcon',
    sections: [
      {
        title: 'About Hero',
        keys: [
          { key: 'about_hero_title', label: 'Title', type: 'text' },
          { key: 'about_hero_subtitle', label: 'Subtitle', type: 'textarea' },
        ],
      },
      {
        title: 'Our Story',
        keys: [
          { key: 'about_story_title', label: 'Section Title', type: 'text' },
          { key: 'about_story_content', label: 'Story Paragraphs', type: 'json_array', fields: [
            { name: 'text', label: 'Paragraph', type: 'textarea' },
          ]},
        ],
      },
      {
        title: 'Core Values',
        keys: [
          { key: 'about_values_heading', label: 'Section Heading', type: 'text' },
          { key: 'about_values_subtitle', label: 'Section Subtitle', type: 'text' },
          { key: 'about_values', label: 'Values', type: 'json_array', fields: [
            { name: 'icon', label: 'Icon Name', type: 'text' },
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ]},
        ],
      },
      {
        title: 'Craftsmanship',
        keys: [
          { key: 'about_craftsmanship_heading', label: 'Section Heading', type: 'text' },
          { key: 'about_craftsmanship_subtitle', label: 'Section Subtitle', type: 'text' },
          { key: 'about_craftsmanship_steps', label: 'Steps', type: 'json_array', fields: [
            { name: 'number', label: 'Step Number', type: 'text' },
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ]},
        ],
      },
      {
        title: 'Awards',
        keys: [
          { key: 'about_awards_heading', label: 'Section Heading', type: 'text' },
          { key: 'about_awards_subtitle', label: 'Section Subtitle', type: 'text' },
          { key: 'about_awards', label: 'Awards', type: 'json_array', fields: [
            { name: 'year', label: 'Year', type: 'text' },
            { name: 'title', label: 'Award Title', type: 'text' },
            { name: 'organization', label: 'Organization', type: 'text' },
          ]},
        ],
      },
      {
        title: 'Philosophy',
        keys: [
          { key: 'about_philosophy_title', label: 'Section Title', type: 'text' },
          { key: 'about_philosophy_content', label: 'Philosophy Paragraphs', type: 'json_array', fields: [
            { name: 'text', label: 'Paragraph', type: 'textarea' },
          ]},
        ],
      },
      {
        title: 'Commitments',
        keys: [
          { key: 'about_commitments_heading', label: 'Section Heading', type: 'text' },
          { key: 'about_commitments_subtitle', label: 'Section Subtitle', type: 'text' },
          { key: 'about_commitments', label: 'Commitments', type: 'json_array', fields: [
            { name: 'icon', label: 'Icon Name', type: 'text' },
            { name: 'title', label: 'Title', type: 'text' },
            { name: 'description', label: 'Description', type: 'textarea' },
          ]},
        ],
      },
      {
        title: 'Call to Action',
        keys: [
          { key: 'about_cta_title', label: 'Heading', type: 'text' },
          { key: 'about_cta_subtitle', label: 'Description', type: 'textarea' },
          { key: 'about_cta_button1_text', label: 'Button 1 Text', type: 'text' },
          { key: 'about_cta_button2_text', label: 'Button 2 Text', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'contact', label: 'Contact Page', icon: 'EnvelopeIcon',
    sections: [
      {
        title: 'Page Header',
        keys: [
          { key: 'contact_heading', label: 'Page Heading', type: 'text' },
          { key: 'contact_subtitle', label: 'Page Subtitle', type: 'textarea' },
        ],
      },
      {
        title: 'Contact Details',
        keys: [
          { key: 'contact_email', label: 'Email', type: 'text' },
          { key: 'contact_phone', label: 'Phone', type: 'text' },
          { key: 'contact_address', label: 'Address', type: 'textarea' },
        ],
      },
      {
        title: 'Form Labels',
        keys: [
          { key: 'contact_label_name', label: 'Name Label', type: 'text' },
          { key: 'contact_label_email', label: 'Email Label', type: 'text' },
          { key: 'contact_label_subject', label: 'Subject Label', type: 'text' },
          { key: 'contact_label_message', label: 'Message Label', type: 'text' },
        ],
      },
      {
        title: 'Form Placeholders',
        keys: [
          { key: 'contact_placeholder_name', label: 'Name Placeholder', type: 'text' },
          { key: 'contact_placeholder_email', label: 'Email Placeholder', type: 'text' },
          { key: 'contact_placeholder_subject', label: 'Subject Placeholder', type: 'text' },
          { key: 'contact_placeholder_message', label: 'Message Placeholder', type: 'text' },
        ],
      },
      {
        title: 'Form Actions',
        keys: [
          { key: 'contact_submit_text', label: 'Submit Button Text', type: 'text' },
          { key: 'contact_success_title', label: 'Success Title', type: 'text' },
          { key: 'contact_success_message', label: 'Success Message', type: 'textarea' },
        ],
      },
    ],
  },
  {
    id: 'sitewide', label: 'Site-Wide', icon: 'GlobeAltIcon',
    sections: [
      {
        title: 'Brand Identity',
        keys: [
          { key: 'site_name', label: 'Brand Name', type: 'text' },
          { key: 'site_tagline', label: 'Tagline', type: 'text' },
        ],
      },
      {
        title: 'SEO',
        keys: [
          { key: 'meta_title', label: 'Page Title', type: 'text' },
          { key: 'meta_description', label: 'Meta Description', type: 'textarea' },
        ],
      },
      {
        title: 'Navigation Labels',
        keys: [
          { key: 'nav_home', label: 'Home', type: 'text' },
          { key: 'nav_shop', label: 'Shop', type: 'text' },
          { key: 'nav_about', label: 'About', type: 'text' },
          { key: 'nav_contact', label: 'Contact', type: 'text' },
        ],
      },
      {
        title: '404 Page',
        keys: [
          { key: 'notfound_heading', label: 'Heading', type: 'text' },
          { key: 'notfound_description', label: 'Description', type: 'text' },
          { key: 'notfound_go_back', label: 'Go Back Button', type: 'text' },
          { key: 'notfound_back_home', label: 'Back Home Button', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'visibility', label: 'Visibility', icon: 'EyeIcon',
    sections: [
      {
        title: 'Homepage Sections',
        keys: [
          { key: 'section_visible_hero', label: 'Hero Section', type: 'toggle' },
          { key: 'section_visible_category_showcase', label: 'Category Showcase', type: 'toggle' },
          { key: 'section_visible_featured_products', label: 'Featured Products', type: 'toggle' },
          { key: 'section_visible_newsletter', label: 'Newsletter Section', type: 'toggle' },
        ],
      },
      {
        title: 'About Page Sections',
        keys: [
          { key: 'section_visible_about_story', label: 'Our Story', type: 'toggle' },
          { key: 'section_visible_about_values', label: 'Core Values', type: 'toggle' },
          { key: 'section_visible_about_craftsmanship', label: 'Craftsmanship', type: 'toggle' },
          { key: 'section_visible_about_awards', label: 'Awards', type: 'toggle' },
          { key: 'section_visible_about_philosophy', label: 'Philosophy', type: 'toggle' },
          { key: 'section_visible_about_commitments', label: 'Commitments', type: 'toggle' },
          { key: 'section_visible_about_cta', label: 'Call to Action', type: 'toggle' },
        ],
      },
      {
        title: 'Product Page Sections',
        keys: [
          { key: 'section_visible_related_products', label: 'Related Products', type: 'toggle' },
        ],
      },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default function AdminContentPage() {
  const [content, setContent] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    async function load() {
      const res = await fetch('/api/admin/content');
      const data = await res.json();
      setContent(data || {});
      setLoading(false);
    }
    load();
  }, []);

  const handleChange = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/admin/content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const currentTab = tabs.find((t) => t.id === activeTab) || tabs[0];

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        {[1, 2, 3].map((i) => <div key={i} className="h-40 animate-pulse rounded-lg bg-muted" />)}
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-heading text-2xl font-semibold text-text-primary">Site Content</h1>
          <p className="mt-1 font-body text-sm text-text-secondary">
            Edit all text and sections visible on the website
          </p>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-5 py-2.5 font-body text-sm font-medium text-primary-foreground transition-luxury hover:opacity-90 disabled:opacity-50">
          <Icon name={saved ? 'CheckIcon' : 'ArrowUpTrayIcon'} size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>

      {/* Tab navigation */}
      <div className="mt-6 flex gap-1 overflow-x-auto rounded-lg bg-muted p-1">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`inline-flex items-center gap-2 whitespace-nowrap rounded-md px-4 py-2.5 font-body text-sm font-medium transition-luxury ${
              activeTab === tab.id
                ? 'bg-card text-text-primary shadow-luxury-sm'
                : 'text-text-secondary hover:text-text-primary'
            }`}>
            <Icon name={tab.icon} size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="mt-6 space-y-6">
        {currentTab.sections.map((section) => (
          <div key={section.title} className="rounded-lg bg-card p-6 shadow-luxury-sm">
            <h2 className="mb-4 font-heading text-lg font-semibold text-text-primary">
              {section.title}
            </h2>
            <div className="space-y-4">
              {section.keys.map((field) => (
                <div key={field.key}>
                  {field.type === 'toggle' ? (
                    <label className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                      <div>
                        <span className="font-body text-sm font-medium text-text-primary">{field.label}</span>
                        <span className="ml-2 font-data text-xs text-text-secondary">({field.key})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleChange(field.key, content[field.key] === 'false' ? 'true' : (content[field.key] === undefined || content[field.key] === 'true') ? 'false' : 'true')}
                        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors ${
                          content[field.key] !== 'false' ? 'bg-primary' : 'bg-muted'
                        }`}>
                        <span className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${
                          content[field.key] !== 'false' ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </button>
                    </label>
                  ) : field.type === 'json_array' ? (
                    <JsonArrayEditor
                      value={content[field.key] || '[]'}
                      onChange={(val) => handleChange(field.key, val)}
                      fields={field.fields}
                      label={field.label}
                    />
                  ) : field.type === 'json_links' ? (
                    <JsonLinksEditor
                      value={content[field.key] || '[]'}
                      onChange={(val) => handleChange(field.key, val)}
                      label={field.label}
                    />
                  ) : (
                    <div>
                      <label className="mb-1 block font-body text-sm font-medium text-text-primary">
                        {field.label}
                        <span className="ml-2 font-data text-xs text-text-secondary">({field.key})</span>
                      </label>
                      {field.type === 'textarea' ? (
                        <textarea
                          rows={3}
                          value={content[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="w-full resize-none rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      ) : (
                        <input
                          value={content[field.key] || ''}
                          onChange={(e) => handleChange(field.key, e.target.value)}
                          className="w-full rounded-md border border-border bg-input px-4 py-2.5 font-body text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-ring"
                        />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Floating save */}
      <div className="sticky bottom-4 mt-6 flex justify-end">
        <button onClick={handleSave} disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-6 py-3 font-body text-sm font-medium text-primary-foreground shadow-luxury transition-luxury hover:opacity-90 disabled:opacity-50">
          <Icon name={saved ? 'CheckIcon' : 'ArrowUpTrayIcon'} size={16} />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save All Changes'}
        </button>
      </div>
    </div>
  );
}
