import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { orderNumber, customer, shipping, items, totals, paymentIntentId } = await req.json();

    const itemsHtml = items.map((item: any) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;font-weight:600;">${item.name}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;">${item.size || '-'}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:center;">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;">AED ${(item.price).toFixed(2)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e5e7eb;text-align:right;font-weight:600;">AED ${(item.price * item.quantity).toFixed(2)}</td>
      </tr>
    `).join('');

    const deliveryRow = totals.shipping > 0
      ? `<tr><td style="padding:4px 0;color:#6b7280;">Delivery</td><td style="padding:4px 0;text-align:right;">AED ${Number(totals.shipping).toFixed(2)}</td></tr>`
      : `<tr><td style="padding:4px 0;color:#6b7280;">Delivery</td><td style="padding:4px 0;text-align:right;color:#7A8471;">Free</td></tr>`;

    const taxRow = totals.tax > 0
      ? `<tr><td style="padding:4px 0;color:#6b7280;">Tax</td><td style="padding:4px 0;text-align:right;">AED ${Number(totals.tax).toFixed(2)}</td></tr>`
      : '';

    const html = `
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
            <tr><td style="padding:4px 0;color:#6b7280;">Subtotal</td><td style="padding:4px 0;text-align:right;">AED ${Number(totals.subtotal).toFixed(2)}</td></tr>
            ${deliveryRow}
            ${taxRow}
            <tr style="border-top:2px solid #c9a96e;">
              <td style="padding:10px 0 4px;font-weight:700;font-size:17px;color:#1f2937;">Total</td>
              <td style="padding:10px 0 4px;text-align:right;font-weight:700;font-size:17px;color:#c9a96e;">AED ${Number(totals.total).toFixed(2)}</td>
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
      subject: `New Order ${orderNumber} — ${customer.name} — AED ${totals.total.toFixed(2)}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Email send error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
