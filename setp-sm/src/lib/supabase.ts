import { createClient as createSupabaseClient } from '@supabase/supabase-js';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  console.warn('[supabase] NEXT_PUBLIC_SUPABASE_URL is not set — running in seed mode');
}
if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.warn('[supabase] SUPABASE_SERVICE_ROLE_KEY is not set — running in seed mode');
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? '';

// Cliente server-side con service role key (solo para API Routes y Server Components)
export const supabase = supabaseUrl && supabaseServiceKey
  ? createSupabaseClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export default supabase;
