import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(req: NextRequest) {
  const ids = req.nextUrl.searchParams.get('ids');
  if (!ids) return NextResponse.json([]);

  const idList = ids.split(',').filter(Boolean);
  if (idList.length === 0) return NextResponse.json([]);

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('products')
    .select('id, name, deliverable_countries')
    .in('id', idList);

  if (error) return NextResponse.json([], { status: 500 });
  return NextResponse.json(data ?? []);
}
