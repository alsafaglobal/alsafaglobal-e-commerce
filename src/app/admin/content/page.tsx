'use client';

import React, { useEffect, useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import JsonArrayEditor from './components/JsonArrayEditor';
import JsonLinksEditor from './components/JsonLinksEditor';
import ImageUploadField from './components/ImageUploadField';

/* ------------------------------------------------------------------ */
/*  Tab & field definitions                                           */
/* ------------------------------------------------------------------ */

interface TextField { key: string; label: string; type: 'text' | 'textarea'; visibilityKey?: string }
interface JsonArrayField {
  key: string; label: string; type: 'json_array'; visibilityKey?: string;
  fields: { name: string; label: string; type: 'text' | 'textarea' }[];
}
interface JsonLinksField { key: string; label: string; type: 'json_links'; visibilityKey?: string }
interface VisibilityOnlyField { key: string; label: string; type: 'visibility_only'; visibilityKey: string }
interface ImageUploadFieldDef { key: string; label: string; type: 'image_upload'; visibilityKey?: string }

type FieldDef = TextField | JsonArrayField | JsonLinksField | VisibilityOnlyField | ImageUploadFieldDef;

interface Section { title: string; visibilityKey?: string; keys: FieldDef[] }
interface Tab { id: string; label: string; icon: string; sections: Section[] }

const tabs: Tab[] = [
  {
    id: 'home', label: 'Home Page', icon: 'HomeIcon',
    sections: [
      {
        title: 'Hero Section',
        visibilityKey: 'section_visible_hero',
        keys: [
          { key: 'hero_title', label: 'Headline', type: 'text' },
          { key: 'hero_subtitle', label: 'Subtitle', type: 'textarea' },
          { key: 'hero_button_text', label: 'Button Text', type: 'text' },
        ],
      },
      {
        title: 'Category Showcase',
        visibilityKey: 'section_visible_category_showcase',
        keys: [
          { key: 'category_showcase_title', label: 'Section Title', type: 'text' },
          { key: 'category_showcase_subtitle', label: 'Section Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Offers Section',
        visibilityKey: 'section_visible_offers',
        keys: [],
      },
      {
        title: 'Featured Products',
        visibilityKey: 'section_visible_featured_products',
        keys: [
          { key: 'featured_title', label: 'Section Title', type: 'text' },
          { key: 'featured_subtitle', label: 'Section Subtitle', type: 'text' },
        ],
      },
      {
        title: 'Product Card',
        keys: [
          { key: 'product_view_details', label: 'View Details Button', type: 'text' },
          { key: 'product_btn_add', label: 'Add Button', type: 'text' },
        ],
      },
      {
        title: 'WhatsApp Button',
        visibilityKey: 'section_visible_whatsapp',
        keys: [
          { key: 'whatsapp_number', label: 'WhatsApp Number (with country code, no +)', type: 'text' },
          { key: 'whatsapp_message', label: 'Pre-filled Message', type: 'text' },
        ],
      },
      {
        title: 'Newsletter',
        visibilityKey: 'section_visible_newsletter',
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
        visibilityKey: 'section_visible_footer',
        keys: [
          { key: 'footer_tagline', label: 'Footer Description', type: 'textarea' },
          { key: 'footer_copyright_text', label: 'Copyright Text', type: 'text' },
          { key: 'footer_heading_company', label: 'Company Column Heading', type: 'text' },
          { key: 'footer_links_company', label: 'Company Links', type: 'json_links' },
          { key: 'footer_heading_support', label: 'Support Column Heading', type: 'text' },
          { key: 'footer_links_support', label: 'Support Links', type: 'json_links' },
          { key: 'footer_terms', label: 'Terms Link Text', type: 'text' },
          { key: 'footer_privacy', label: 'Privacy Link Text', type: 'text' },
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
          { key: 'shop_btn_filters', label: 'Filters Button', type: 'text' },
          { key: 'shop_btn_clear_filters', label: 'Clear All Filters Button', type: 'text' },
          { key: 'shop_showing_text', label: 'Showing Results Text (use {count} and {total})', type: 'text' },
        ],
      },
      {
        title: 'Shop Filters (Mobile)',
        keys: [
          { key: 'shop_filter_title', label: 'Filter Panel Title', type: 'text' },
          { key: 'shop_filter_scent_type', label: 'Scent Type Label', type: 'text' },
          { key: 'shop_btn_clear_all', label: 'Clear All Button', type: 'text' },
          { key: 'shop_btn_view_results', label: 'View Results Button', type: 'text' },
        ],
      },
      {
        title: 'Product Detail',
        keys: [
          { key: 'product_breadcrumb_home', label: 'Breadcrumb: Home', type: 'text' },
          { key: 'product_breadcrumb_shop', label: 'Breadcrumb: Shop', type: 'text' },
          { key: 'product_related_title', label: 'Related Products Title', type: 'text', visibilityKey: 'section_visible_related_products' },
          { key: 'product_label_fragrance_family', label: 'Label: Fragrance Family', type: 'text' },
          { key: 'product_label_longevity', label: 'Label: Longevity', type: 'text' },
          { key: 'product_label_occasions', label: 'Label: Occasions', type: 'text' },
          { key: 'product_label_select_size', label: 'Label: Select Size', type: 'text' },
          { key: 'product_label_quantity', label: 'Label: Quantity', type: 'text' },
          { key: 'product_add_to_cart_text', label: 'Add to Cart Button', type: 'text' },
          { key: 'product_buy_now_text', label: 'Buy Now Button', type: 'text' },
          { key: 'product_adding_text', label: 'Adding... Text', type: 'text' },
          { key: 'product_added_text', label: 'Added to Cart! Text', type: 'text' },
        ],
      },
      {
        title: 'Scent Notes',
        visibilityKey: 'section_visible_product_scent_notes',
        keys: [
          { key: 'product_scent_notes_title', label: 'Section Title', type: 'text' },
          { key: 'product_label_top_notes', label: 'Top Notes Label', type: 'text' },
          { key: 'product_label_heart_notes', label: 'Heart Notes Label', type: 'text' },
          { key: 'product_label_base_notes', label: 'Base Notes Label', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'cart', label: 'Cart & Checkout', icon: 'ShoppingCartIcon',
    sections: [
      {
        title: 'Empty Cart',
        keys: [
          { key: 'cart_empty_title', label: 'Empty Cart Title', type: 'text' },
          { key: 'cart_empty_description', label: 'Empty Cart Description', type: 'textarea' },
          { key: 'cart_empty_button', label: 'Explore Button Text', type: 'text' },
          { key: 'cart_benefit_1', label: 'Benefit 1', type: 'text' },
          { key: 'cart_benefit_2', label: 'Benefit 2', type: 'text' },
          { key: 'cart_benefit_3', label: 'Benefit 3', type: 'text' },
        ],
      },
      {
        title: 'Cart Items & Summary',
        keys: [
          { key: 'cart_label_size', label: 'Size Label', type: 'text' },
          { key: 'cart_btn_remove', label: 'Remove Button', type: 'text' },
          { key: 'cart_summary_title', label: 'Order Summary Title', type: 'text' },
          { key: 'cart_label_subtotal', label: 'Subtotal Label', type: 'text' },
          { key: 'cart_label_tax', label: 'Tax Label', type: 'text' },
          { key: 'cart_label_total', label: 'Total Label', type: 'text' },
          { key: 'cart_btn_checkout', label: 'Checkout Button', type: 'text' },
          { key: 'cart_btn_continue', label: 'Continue Shopping Button', type: 'text' },
          { key: 'cart_secure_text', label: 'Secure Checkout Text', type: 'text' },
          { key: 'cart_shipping_text', label: 'Free Shipping Text', type: 'text' },
        ],
      },
      {
        title: 'Checkout Steps',
        keys: [
          { key: 'checkout_step_personal', label: 'Step 1 Label', type: 'text' },
          { key: 'checkout_step_shipping', label: 'Step 2 Label', type: 'text' },
          { key: 'checkout_step_payment', label: 'Step 3 Label', type: 'text' },
        ],
      },
      {
        title: 'Checkout - Personal Info',
        keys: [
          { key: 'checkout_heading_personal', label: 'Section Heading', type: 'text' },
          { key: 'checkout_label_first_name', label: 'First Name Label', type: 'text' },
          { key: 'checkout_label_last_name', label: 'Last Name Label', type: 'text' },
          { key: 'checkout_label_email', label: 'Email Label', type: 'text' },
          { key: 'checkout_label_phone', label: 'Phone Label', type: 'text' },
        ],
      },
      {
        title: 'Checkout - Shipping',
        keys: [
          { key: 'checkout_heading_shipping', label: 'Section Heading', type: 'text' },
          { key: 'checkout_label_address', label: 'Address Label', type: 'text' },
          { key: 'checkout_label_city', label: 'City Label', type: 'text' },
          { key: 'checkout_label_state', label: 'State Label', type: 'text' },
          { key: 'checkout_label_zip', label: 'ZIP Code Label', type: 'text' },
          { key: 'checkout_label_country', label: 'Country Label', type: 'text' },
        ],
      },
      {
        title: 'Checkout - Payment',
        keys: [
          { key: 'checkout_heading_payment', label: 'Section Heading', type: 'text' },
          { key: 'checkout_label_card_number', label: 'Card Number Label', type: 'text' },
          { key: 'checkout_label_card_name', label: 'Cardholder Name Label', type: 'text' },
          { key: 'checkout_label_expiry', label: 'Expiry Date Label', type: 'text' },
          { key: 'checkout_label_cvv', label: 'CVV Label', type: 'text' },
          { key: 'checkout_security_text', label: 'Security Info Text', type: 'textarea' },
        ],
      },
      {
        title: 'Checkout - Buttons & Summary',
        keys: [
          { key: 'checkout_btn_previous', label: 'Previous Button', type: 'text' },
          { key: 'checkout_btn_next', label: 'Next Button', type: 'text' },
          { key: 'checkout_btn_place_order', label: 'Place Order Button', type: 'text' },
          { key: 'checkout_btn_processing', label: 'Processing Text', type: 'text' },
          { key: 'checkout_summary_title', label: 'Order Summary Title', type: 'text' },
          { key: 'checkout_label_size', label: 'Size Label', type: 'text' },
          { key: 'checkout_label_qty', label: 'Qty Label', type: 'text' },
          { key: 'checkout_label_subtotal', label: 'Subtotal Label', type: 'text' },
          { key: 'checkout_label_shipping', label: 'Shipping Label', type: 'text' },
          { key: 'checkout_label_tax', label: 'Tax Label', type: 'text' },
          { key: 'checkout_label_total', label: 'Total Label', type: 'text' },
          { key: 'checkout_secure_badge', label: 'Secure Badge Text', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'order', label: 'Order Confirm', icon: 'CheckCircleIcon',
    sections: [
      {
        title: 'Order Confirmed',
        keys: [
          { key: 'order_confirmed_title', label: 'Title', type: 'text' },
          { key: 'order_confirmed_message', label: 'Message (use {name} for customer name)', type: 'textarea' },
        ],
      },
      {
        title: 'Order Summary Labels',
        keys: [
          { key: 'order_summary_title', label: 'Summary Heading', type: 'text' },
          { key: 'order_label_subtotal', label: 'Subtotal', type: 'text' },
          { key: 'order_label_shipping', label: 'Shipping', type: 'text' },
          { key: 'order_label_tax', label: 'Tax', type: 'text' },
          { key: 'order_label_total', label: 'Total', type: 'text' },
        ],
      },
      {
        title: 'Shipping & Payment',
        keys: [
          { key: 'order_shipping_title', label: 'Shipping Address Heading', type: 'text' },
          { key: 'order_payment_title', label: 'Payment Heading', type: 'text' },
          { key: 'order_card_ending', label: 'Card Ending Text', type: 'text' },
          { key: 'order_confirmation_email', label: 'Email Confirmation Text', type: 'text' },
        ],
      },
      {
        title: 'Buttons',
        keys: [
          { key: 'order_btn_continue', label: 'Continue Shopping', type: 'text' },
          { key: 'order_btn_home', label: 'Back to Home', type: 'text' },
        ],
      },
      {
        title: 'No Order State',
        keys: [
          { key: 'order_no_order_title', label: 'No Order Title', type: 'text' },
          { key: 'order_no_order_message', label: 'No Order Message', type: 'textarea' },
          { key: 'order_no_order_button', label: 'Browse Button Text', type: 'text' },
        ],
      },
    ],
  },
  {
    id: 'about', label: 'About Page', icon: 'InformationCircleIcon',
    sections: [
      {
        title: 'About Us Banner',
        keys: [
          { key: 'about_banner_image', label: 'Banner Image (full-width image above content)', type: 'image_upload' },
        ],
      },
      {
        title: 'About Us Content',
        keys: [
          { key: 'about_story_content', label: 'Paragraphs', type: 'json_array', fields: [
            { name: 'text', label: 'Paragraph', type: 'textarea' },
          ]},
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
        visibilityKey: 'section_visible_contact_details',
        keys: [
          { key: 'contact_email', label: 'Email', type: 'text' },
          { key: 'contact_phone', label: 'Phone', type: 'text' },
          { key: 'contact_address', label: 'Address', type: 'textarea' },
        ],
      },
      {
        title: 'Contact Form',
        visibilityKey: 'section_visible_contact_form',
        keys: [
          { key: 'contact_label_name', label: 'Name Label', type: 'text' },
          { key: 'contact_label_email', label: 'Email Label', type: 'text' },
          { key: 'contact_label_subject', label: 'Subject Label', type: 'text' },
          { key: 'contact_label_message', label: 'Message Label', type: 'text' },
          { key: 'contact_placeholder_name', label: 'Name Placeholder', type: 'text' },
          { key: 'contact_placeholder_email', label: 'Email Placeholder', type: 'text' },
          { key: 'contact_placeholder_subject', label: 'Subject Placeholder', type: 'text' },
          { key: 'contact_placeholder_message', label: 'Message Placeholder', type: 'text' },
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
          { key: 'brand_name_primary', label: 'Brand Name (Primary)', type: 'text' },
          { key: 'brand_name_accent', label: 'Brand Name (Accent)', type: 'text' },
          { key: 'site_name', label: 'Full Site Name', type: 'text' },
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
        title: 'Navigation',
        keys: [
          { key: 'nav_home', label: 'Home', type: 'text', visibilityKey: 'section_visible_nav_home' },
          { key: 'nav_shop', label: 'Shop', type: 'text', visibilityKey: 'section_visible_nav_shop' },
          { key: 'nav_about', label: 'About', type: 'text', visibilityKey: 'section_visible_nav_about' },
          { key: 'nav_contact', label: 'Contact', type: 'text', visibilityKey: 'section_visible_nav_contact' },
          { key: 'nav_shopping_cart', label: 'Shopping Cart', type: 'text' },
          { key: 'section_visible_dark_mode_toggle', label: 'Dark Mode Toggle', type: 'visibility_only', visibilityKey: 'section_visible_dark_mode_toggle' },
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
    id: 'terms', label: 'Terms & Conditions', icon: 'DocumentTextIcon',
    sections: [
      {
        title: 'Page Header',
        keys: [
          { key: 'terms_page_title', label: 'Page Title', type: 'text' },
          { key: 'terms_intro', label: 'Introduction Paragraph', type: 'textarea' },
        ],
      },
      { title: 'Section 1 — General', keys: [{ key: 'terms_s1_title', label: 'Section Title', type: 'text' }, { key: 'terms_s1_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 2 — Orders & Payments', keys: [{ key: 'terms_s2_title', label: 'Section Title', type: 'text' }, { key: 'terms_s2_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 3 — Shipping & Delivery', keys: [{ key: 'terms_s3_title', label: 'Section Title', type: 'text' }, { key: 'terms_s3_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 4 — No Return / No Refund', keys: [{ key: 'terms_s4_title', label: 'Section Title', type: 'text' }, { key: 'terms_s4_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 5 — Damaged / Wrong Items', keys: [{ key: 'terms_s5_title', label: 'Section Title', type: 'text' }, { key: 'terms_s5_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 6 — Order Cancellation', keys: [{ key: 'terms_s6_title', label: 'Section Title', type: 'text' }, { key: 'terms_s6_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 7 — Liability', keys: [{ key: 'terms_s7_title', label: 'Section Title', type: 'text' }, { key: 'terms_s7_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 8 — Intellectual Property', keys: [{ key: 'terms_s8_title', label: 'Section Title', type: 'text' }, { key: 'terms_s8_body', label: 'Content (one point per line)', type: 'textarea' }] },
      { title: 'Section 9 — Governing Law', keys: [{ key: 'terms_s9_title', label: 'Section Title', type: 'text' }, { key: 'terms_s9_body', label: 'Content (one point per line)', type: 'textarea' }] },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Inline Visibility Toggle                                           */
/* ------------------------------------------------------------------ */

function VisibilityToggle({
  visibilityKey,
  content,
  onChange,
}: {
  visibilityKey: string;
  content: Record<string, string>;
  onChange: (key: string, value: string) => void;
}) {
  const isVisible = content[visibilityKey] !== 'false';
  return (
    <button
      type="button"
      title={isVisible ? 'Click to hide on site' : 'Click to show on site'}
      onClick={() => onChange(visibilityKey, isVisible ? 'false' : 'true')}
      className={`ml-2 inline-flex flex-shrink-0 items-center gap-1 rounded px-1.5 py-0.5 font-body text-xs font-medium transition-colors ${
        isVisible
          ? 'bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600 dark:bg-green-900/30 dark:text-green-400'
          : 'bg-red-100 text-red-600 hover:bg-green-100 hover:text-green-700 dark:bg-red-900/30 dark:text-red-400'
      }`}
    >
      <Icon name={isVisible ? 'EyeIcon' : 'EyeSlashIcon'} size={12} />
      {isVisible ? 'Visible' : 'Hidden'}
    </button>
  );
}

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
            {/* Section header with inline visibility toggle */}
            <div className="mb-4 flex items-center gap-2">
              <h2 className="font-heading text-lg font-semibold text-text-primary">
                {section.title}
              </h2>
              {section.visibilityKey && (
                <VisibilityToggle
                  visibilityKey={section.visibilityKey}
                  content={content}
                  onChange={handleChange}
                />
              )}
            </div>

            {section.keys.length > 0 && (
              <div className="space-y-4">
                {section.keys.map((field) => (
                  <div key={field.key}>
                    {field.type === 'image_upload' ? (
                      <ImageUploadField
                        label={field.label}
                        value={content[field.key] || ''}
                        onChange={(url) => handleChange(field.key, url)}
                      />
                    ) : field.type === 'visibility_only' ? (
                      <div className="flex items-center justify-between rounded-md border border-border px-4 py-3">
                        <span className="font-body text-sm font-medium text-text-primary">{field.label}</span>
                        <VisibilityToggle
                          visibilityKey={field.visibilityKey}
                          content={content}
                          onChange={handleChange}
                        />
                      </div>
                    ) : field.type === 'json_array' ? (
                      <div>
                        <div className="mb-1 flex items-center">
                          <span className="font-body text-sm font-medium text-text-primary">{field.label}</span>
                          {field.visibilityKey && (
                            <VisibilityToggle
                              visibilityKey={field.visibilityKey}
                              content={content}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                        <JsonArrayEditor
                          value={content[field.key] || '[]'}
                          onChange={(val) => handleChange(field.key, val)}
                          fields={field.fields}
                          label=""
                        />
                      </div>
                    ) : field.type === 'json_links' ? (
                      <div>
                        <div className="mb-1 flex items-center">
                          <span className="font-body text-sm font-medium text-text-primary">{field.label}</span>
                          {field.visibilityKey && (
                            <VisibilityToggle
                              visibilityKey={field.visibilityKey}
                              content={content}
                              onChange={handleChange}
                            />
                          )}
                        </div>
                        <JsonLinksEditor
                          value={content[field.key] || '[]'}
                          onChange={(val) => handleChange(field.key, val)}
                          label=""
                        />
                      </div>
                    ) : (
                      <div>
                        <div className="mb-1 flex items-center">
                          <label className="font-body text-sm font-medium text-text-primary">
                            {field.label}
                            <span className="ml-2 font-data text-xs text-text-secondary">({field.key})</span>
                          </label>
                          {field.visibilityKey && (
                            <VisibilityToggle
                              visibilityKey={field.visibilityKey}
                              content={content}
                              onChange={handleChange}
                            />
                          )}
                        </div>
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
            )}
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
