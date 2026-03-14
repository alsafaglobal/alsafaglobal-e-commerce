import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: NextRequest) {
  try {
    const { name, email, subject, message } = await req.json();

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields are required.' }, { status: 400 });
    }

    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;color:#1f2937;">
        <div style="background:#1a1a2e;padding:24px;text-align:center;">
          <h1 style="color:#c9a96e;margin:0;font-size:24px;">Al Safa Global</h1>
          <p style="color:#9ca3af;margin:8px 0 0;">New Contact Form Message</p>
        </div>

        <div style="padding:24px;">
          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;">Sender Details</h3>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:4px 0;color:#6b7280;width:80px;">Name</td><td style="padding:4px 0;font-weight:600;">${name}</td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;">Email</td><td style="padding:4px 0;"><a href="mailto:${email}" style="color:#c9a96e;">${email}</a></td></tr>
            <tr><td style="padding:4px 0;color:#6b7280;">Subject</td><td style="padding:4px 0;">${subject}</td></tr>
          </table>

          <h3 style="color:#1f2937;border-bottom:2px solid #c9a96e;padding-bottom:8px;margin-top:24px;">Message</h3>
          <p style="margin:0;line-height:1.8;white-space:pre-wrap;">${message}</p>
        </div>

        <div style="background:#1a1a2e;padding:16px;text-align:center;">
          <p style="color:#9ca3af;margin:0;font-size:12px;">Al Safa Global · info@alsafaglobal.com</p>
        </div>
      </div>
    `;

    await resend.emails.send({
      from: 'Al Safa Global Contact <noreply@shopatasg.com>',
      to: 'info@alsafaglobal.com',
      replyTo: email,
      subject: `Contact Form: ${subject} — ${name}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Contact email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
