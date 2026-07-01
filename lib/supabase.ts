import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Returns null when Supabase is not configured so the assessment flow can
// continue without a backing database (badge save is best-effort).
export const supabase =
  url && anonKey && !url.includes('your-project')
    ? createClient(url, anonKey)
    : null;
