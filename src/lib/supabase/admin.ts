import { createClient } from '@supabase/supabase-js';

// Service role client — bypasses Row Level Security
// ONLY use in API routes / server-side code, NEVER expose to browser
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}
