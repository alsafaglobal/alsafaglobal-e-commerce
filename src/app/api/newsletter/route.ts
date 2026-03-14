import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const { error } = await supabase
    .from('newsletter_subscribers')
    .insert({ email });

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Already subscribed' }, { status: 409 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Send welcome email — wrapped in try/catch so a Resend failure never blocks the subscription
  try {
    await resend.emails.send({
      from: 'Al Safa Global <noreply@shopatasg.com>',
      to: email,
      subject: 'Welcome to Al Safa Global — You\'re In!',
      html: `
        <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
          <div style="background:#1a1a2e;padding:24px;text-align:center;">
            <h1 style="color:#c9a96e;margin:0;font-size:24px;">Al Safa Global</h1>
            <p style="color:#9ca3af;margin:8px 0 0;">Luxury Fragrances</p>
          </div>
          <div style="padding:32px 24px;text-align:center;">
            <h2 style="color:#1f2937;font-size:22px;margin:0 0 16px;">Welcome! You're now subscribed.</h2>
            <p style="color:#6b7280;line-height:1.8;margin:0 0 24px;">
              Thank you for joining the Al Safa Global family. You'll be the first to know about exclusive offers, new arrivals, and fragrance tips from our experts.
            </p>
            <a href="https://shopatasg.com/home"
              style="display:inline-block;background:#c9a96e;color:#ffffff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:600;font-size:15px;">
              Shop Now
            </a>
          </div>
          <div style="background:#f9fafb;padding:16px 24px;text-align:center;">
            <p style="color:#9ca3af;margin:0;font-size:12px;">
              Al Safa Global · info@alsafaglobal.com<br/>
              You received this because you subscribed at shopatasg.com
            </p>
          </div>
        </div>
      `,
    });
  } catch (emailErr) {
    console.error('Welcome email failed:', emailErr);
  }

  return NextResponse.json({ success: true }, { status: 201 });
}
