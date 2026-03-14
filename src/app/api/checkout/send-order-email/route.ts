import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, customer, shipping, items, totals, paymentIntentId } = await req.json();

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.name}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;">${item.size}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">AED ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h1 style="color:#c9a96e;margin:0;font-size:24px;">Al Safa Global</h1>
          <p style="color:#9ca3af;margin:8px 0 0;">New Order Received</p>
        </div>

        <div style="padding:24px;background:#f9fafb;">
          <h2 style="color:#1f2937;margin:0 0 4px;">Order ${orderNumber}</h2>
          <p style="color:#6b7280;margin:0;">Payment ID: ${paymentIntentId}</p>
        </div>

        <div style="padding:24px;">
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;">Customer Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#6b7280;width:120px;">Name</td><td style="padding:4px 0;font-weight:600;">${customer.name}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;">${customer.email}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;">Phone</td><td style="padding:4px 0;">${customer.phone}</td></tr>
          </table>

          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin-top:24px;">Shipping Address</h3>
          <p style="margin:0;line-height:1.8;">
            ${shipping.address}<br/>
            ${shipping.city}, ${shipping.state} ${shipping.zipCode}<br/>
            ${shipping.country}
          </p>

          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin-top:24px;">Order Items</h3>
          <table style="width:100%;border-collapse:collapse;">
            <thead>
              <tr style="background:#f3f4f6;">
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Product</th>
                <th style="padding:8px 12px;text-align:left;color:#6b7280;font-weight:600;">Size</th>
                <th style="padding:8px 12px;text-align:center;color:#6b7280;font-weight:600;">Qty</th>
                <th style="padding:8px 12px;text-align:right;color:#6b7280;font-weight:600;">Price</th>
              </tr>
            </thead>
            <tbody>${itemsHtml}</tbody>
          </table>

          <div style="margin-top:16px;text-align:right;">
            <p style="margin:4px 0;color:#6b7280;">Subtotal: <strong>AED ${totals.subtotal.toFixed(2)}</strong></p>
            <p style="margin:4px 0;font-size:18px;color:#c9a96e;font-weight:700;">Total: AED ${totals.total.toFixed(2)}</p>
          </div>
        </div>

        <div style="background:#1a1a2e;padding:16px;text-align:center;">
          <p style="color:#9ca3af;margin:0;font-size:12px;">Al Safa Global · info@alsafaglobal.com</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Al Safa Global Orders <noreply@shopatasg.com>',
      to: 'info@alsafaglobal.com',
      subject: `New Order ${orderNumber} — ${customer.name} — AED ${totals.total.toFixed(2)}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
