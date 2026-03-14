import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  const { data, error } = await supabase
    .from('newsletter_subscribers')
    .select('*');

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // normalize column name — table may use created_at or subscribed_at
  const normalized = (data || []).map((row: any) => ({
    id: row.id,
    email: row.email,
    subscribed_at: row.subscribed_at || row.created_at,
  }));

  return NextResponse.json(normalized);
}
