import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET() {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('site_content')
    .select('*')
    .order('key');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Convert array to key-value object
  const content: Record<string, string> = {};
  data?.forEach((row: { key: string; value: string }) => {
    content[row.key] = row.value;
  });

  return NextResponse.json(content);
}

export async function POST(req: NextRequest) {
  const supabase = createAdminClient();
  const body: Record<string, string> = await req.json();

  // Upsert each key-value pair
  const upserts = Object.entries(body).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabase
    .from('site_content')
    .upsert(upserts, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
