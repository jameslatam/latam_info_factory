import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabaseServer: SupabaseClient | null =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey)
    : null;

export function getSupabaseServer() {
  if (!supabaseServer) {
    throw new Error(
      "Supabase server env vars are not configured. Make sure NEXT_PUBLIC_SUPABASE_URL or SUPABASE_URL and SUPABASE_SERVICE_ROLE or SUPABASE_SERVICE_ROLE_KEY are set."
    );
  }

  return supabaseServer;
}

export { supabaseServer };
export default supabaseServer;
