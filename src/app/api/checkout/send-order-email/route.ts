import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import React from 'react';
import { renderToBuffer } from '@react-pdf/renderer';
import { InvoicePDF, InvoiceContent } from '@/lib/invoice/InvoicePDF';
import { createAdminClient } from '@/lib/supabase/admin';

const resend = new Resend(process.env.RESEND_API_KEY);

const DEFAULT_INVOICE_CONTENT: InvoiceContent = {
  company_name: 'Al Safa Global',
  tagline: 'Luxury Fragrances',
  title: 'Invoice',
  label_bill_to: 'Bill To',
  col_product: 'Product',
  col_size: 'Size',
  col_qty: 'Qty',
  col_unit_price: 'Unit Price',
  col_total: 'Total',
  label_subtotal: 'Subtotal',
  label_tax: 'Tax',
  label_delivery: 'Delivery',
  label_grand_total: 'Grand Total',
  footer_message: 'Thank you for your order!',
  contact_email: 'info@alsafaglobal.com',
  website: 'www.shopatasg.com',
  policy_note: 'All sales are final. No returns or refunds.',
};

async function fetchInvoiceContent(): Promise<InvoiceContent> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from('site_content')
      .select('key, value')
      .like('key', 'invoice_%');

    if (!data) return DEFAULT_INVOICE_CONTENT;

    const map: Record<string, string> = {};
    data.forEach(({ key, value }: { key: string; value: string }) => {
      map[key.replace('invoice_', '')] = value;
    });

    return {
      company_name:    map['company_name']    || DEFAULT_INVOICE_CONTENT.company_name,
      tagline:         map['tagline']         || DEFAULT_INVOICE_CONTENT.tagline,
      title:           map['title']           || DEFAULT_INVOICE_CONTENT.title,
      label_bill_to:   map['label_bill_to']   || DEFAULT_INVOICE_CONTENT.label_bill_to,
      col_product:     map['col_product']     || DEFAULT_INVOICE_CONTENT.col_product,
      col_size:        map['col_size']        || DEFAULT_INVOICE_CONTENT.col_size,
      col_qty:         map['col_qty']         || DEFAULT_INVOICE_CONTENT.col_qty,
      col_unit_price:  map['col_unit_price']  || DEFAULT_INVOICE_CONTENT.col_unit_price,
      col_total:       map['col_total']       || DEFAULT_INVOICE_CONTENT.col_total,
      label_subtotal:  map['label_subtotal']  || DEFAULT_INVOICE_CONTENT.label_subtotal,
      label_tax:       map['label_tax']       || DEFAULT_INVOICE_CONTENT.label_tax,
      label_delivery:  map['label_delivery']  || DEFAULT_INVOICE_CONTENT.label_delivery,
      label_grand_total: map['label_grand_total'] || DEFAULT_INVOICE_CONTENT.label_grand_total,
      footer_message:  map['footer_message']  || DEFAULT_INVOICE_CONTENT.footer_message,
      contact_email:   map['contact_email']   || DEFAULT_INVOICE_CONTENT.contact_email,
      website:         map['website']         || DEFAULT_INVOICE_CONTENT.website,
      policy_note:     map['policy_note']     || DEFAULT_INVOICE_CONTENT.policy_note,
    };
  } catch {
    return DEFAULT_INVOICE_CONTENT;
  }
}

function fmtEmail(aed: number, currency: string, rate: number): string {
  const converted = aed * rate;
  try {
    return new Intl.NumberFormat('en', { style: 'currency', currency, minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(converted);
  } catch {
    return `${currency} ${converted.toFixed(2)}`;
  }
}

export async function POST(req: NextRequest) {
  try {
    const {
      orderNumber,
      customer,
      shipping,
      items,
      totals,
      paymentIntentId,
      currency = 'AED',
      rate = 1,
      taxRate = 0,
    } = await req.json();

    const date = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

    // ── Generate Invoice PDF ──────────────────────────────────────────
    let pdfBuffer: Buffer | null = null;
    try {
      const invoiceContent = await fetchInvoiceContent();
      const element = React.createElement(InvoicePDF, {
        order: { orderNumber, date, customer, shipping, items, totals, taxRate, currency, rate },
        content: invoiceContent,
      });
      pdfBuffer = await renderToBuffer(element as any);
    } catch (pdfErr) {
      console.error('PDF generation failed (email will still send):', pdfErr);
    }

    // ── Build email HTML rows ─────────────────────────────────────────
    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${item.size || '-'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmtEmail(item.price, currency, rate)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">${fmtEmail(item.price * item.quantity, currency, rate)}</td>
      </tr>
    `).join('');

    const deliveryRow = totals.shipping > 0
      ? `<tr><td style="padding:4px 0;color:#6b7280;">Delivery</td><td style="padding:4px 0;text-align:right;">${fmtEmail(totals.shipping, currency, rate)}</td></tr>`
      : `<tr><td style="padding:4px 0;color:#6b7280;">Delivery</td><td style="padding:4px 0;text-align:right;color:#7A8471;">Free</td></tr>`;

    const taxRow = totals.tax > 0
      ? `<tr><td style="padding:4px 0;color:#6b7280;">Tax${taxRate > 0 ? ` (${taxRate}%)` : ''}</td><td style="padding:4px 0;text-align:right;">${fmtEmail(totals.tax, currency, rate)}</td></tr>`
      : '';

    // ── Admin email ───────────────────────────────────────────────────
    const adminHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;">
        <div style="background:#1a1a2e;padding:28px 24px;text-align:center;">
          <h1 style="color:#c9a96e;margin:0;font-size:26px;letter-spacing:1px;">Al Safa Global</h1>
          <p style="color:#9ca3af;margin:8px 0 0;font-size:14px;">New Order Received</p>
        </div>
        <div style="padding:20px 24px;background:#f9fafb;border-bottom:1px solid #e5e7eb;">
          <table style="width:100%;border-collapse:collapse;">
            <tr>
              <td><h2 style="color:#1f2937;margin:0;font-size:18px;">Order #${orderNumber}</h2></td>
              <td style="text-align:right;color:#6b7280;font-size:13px;">Payment ID: ${paymentIntentId}</td>
            </tr>
          </table>
        </div>
        <div style="padding:24px;">
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin:0 0 12px;">Customer Details</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
            <tr><td style="padding:5px 0;color:#6b7280;width:120px;">Name</td><td style="padding:5px 0;font-weight:600;">${customer.name}</td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Email</td><td style="padding:5px 0;"><a href="mailto:${customer.email}" style="color:#c9a96e;">${customer.email}</a></td></tr>
            <tr><td style="padding:5px 0;color:#6b7280;">Phone</td><td style="padding:5px 0;">${customer.phone}</td></tr>
          </table>
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin:0 0 12px;">Shipping Address</h3>
          <p style="margin:0 0 24px;line-height:1.9;color:#374151;">
            ${shipping.address}<br/>
            ${shipping.city}${shipping.state ? ', ' + shipping.state : ''} ${shipping.zipCode || ''}<br/>
            ${shipping.country}
          </p>
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin:0 0 12px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;font-size:13px;">Product</th>
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;font-size:13px;">Size</th>
                <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;font-size:13px;">Qty</th>
                <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;font-size:13px;">Unit Price</th>
                <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;font-size:13px;">Total</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>
          <table style="width:100%;border-collapse:collapse;max-width:280px;margin-left:auto;">
            <tr><td style="padding:4px 0;color:#6b7280;">Subtotal</td><td style="padding:4px 0;text-align:right;">${fmtEmail(totals.subtotal, currency, rate)}</td></tr>
            ${deliveryRow}
            ${taxRow}
            <tr style="border-top:2px solid #c9a96e;">
              <td style="padding:10px 0 4px;font-weight:700;font-size:17px;color:#1f2937;">Total</td>
              <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:17px;color:#c9a96e;">${fmtEmail(totals.total, currency, rate)}</td>
            </tr>
          </table>
        </div>
        <div style="background:#1a1a2e;padding:16px 24px;text-align:center;">
          <p style="color:#9ca3af;margin:0;font-size:12px;">Al Safa Global · info@alsafaglobal.com · shopatasg.com</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Al Safa Global Orders <noreply@shopatasg.com>',
      to: 'info@alsafaglobal.com',
      subject: `New Order ${orderNumber} — ${customer.name} — ${fmtEmail(totals.total, currency, rate)}`,
      html: adminHtml,
    });

    // ── Customer confirmation email (with PDF invoice attached) ───────
    const customerHtml = `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#1f2937;">
        <div style="background:#1a1a2e;padding:28px 24px;text-align:center;">
          <h1 style="color:#c9a96e;margin:0;font-size:26px;letter-spacing:1px;">Al Safa Global</h1>
          <p style="color:#9ca3af;margin:8px 0 0;font-size:14px;">Order Confirmation</p>
        </div>
        <div style="padding:28px 24px;">
          <h2 style="color:#1f2937;margin:0 0 8px;">Thank you, ${customer.name}!</h2>
          <p style="color:#6b7280;margin:0 0 24px;line-height:1.7;">Your order has been placed successfully and payment confirmed. We'll start processing it right away.</p>
          <div style="background:#f9fafb;border-radius:8px;padding:16px 20px;margin-bottom:24px;">
            <p style="margin:0;color:#6b7280;font-size:13px;">Order Number</p>
            <p style="margin:4px 0 0;font-size:20px;font-weight:700;color:#c9a96e;">#${orderNumber}</p>
          </div>
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin:0 0 12px;">Shipping To</h3>
          <p style="margin:0 0 24px;line-height:1.9;color:#374151;">
            ${shipping.address}<br/>
            ${shipping.city}${shipping.state ? ', ' + shipping.state : ''} ${shipping.zipCode || ''}<br/>
            ${shipping.country}
          </p>
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin:0 0 12px;">Your Order</h3>
          <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;font-size:13px;">Product</th>
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;font-size:13px;">Size</th>
                <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;font-size:13px;">Qty</th>
                <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;font-size:13px;">Total</th>
              </tr>
            </thead>
            <tbody>${items.map((item: any) => `
              <tr>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${item.name}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${item.size || '-'}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
                <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">${fmtEmail(item.price * item.quantity, currency, rate)}</td>
              </tr>
            `).join('')}</tbody>
          </table>
          <table style="width:100%;border-collapse:collapse;max-width:280px;margin-left:auto;">
            <tr><td style="padding:4px 0;color:#6b7280;">Subtotal</td><td style="padding:4px 0;text-align:right;">${fmtEmail(totals.subtotal, currency, rate)}</td></tr>
            ${deliveryRow}
            ${taxRow}
            <tr style="border-top:2px solid #c9a96e;">
              <td style="padding:10px 0 4px;font-weight:700;font-size:17px;color:#1f2937;">Total Paid</td>
              <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:17px;color:#c9a96e;">${fmtEmail(totals.total, currency, rate)}</td>
            </tr>
          </table>
          ${pdfBuffer ? '<p style="margin:20px 0 0;color:#6b7280;font-size:13px;">Your invoice is attached to this email as a PDF.</p>' : ''}
          <p style="margin:16px 0 0;color:#6b7280;font-size:13px;line-height:1.7;">
            If you have any questions about your order, reply to this email or contact us at
            <a href="mailto:info@alsafaglobal.com" style="color:#c9a96e;">info@alsafaglobal.com</a>
          </p>
        </div>
        <div style="background:#1a1a2e;padding:16px 24px;text-align:center;">
          <p style="color:#9ca3af;margin:0;font-size:12px;">Al Safa Global · info@alsafaglobal.com · shopatasg.com</p>
        </div>
      </div>
    `;

    const customerEmailPayload: Parameters<typeof resend.emails.send>[0] = {
      from: 'Al Safa Global <noreply@shopatasg.com>',
      to: customer.email,
      subject: `Order Confirmed #${orderNumber} — Thank you, ${customer.name}!`,
      html: customerHtml,
      ...(pdfBuffer ? {
        attachments: [{
          filename: `Invoice-${orderNumber}.pdf`,
          content: pdfBuffer,
        }],
      } : {}),
    };

    await resend.emails.send(customerEmailPayload);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
