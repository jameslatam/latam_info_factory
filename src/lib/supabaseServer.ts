import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? process.env.SUPABASE_URL;
const supabaseServiceRole =
  process.env.SUPABASE_SERVICE_ROLE ??
  process.env.SUPABASE_SERVICE_ROLE_KEY;

// If env vars are missing, export a safe stub to avoid build-time crashes.
let supabaseServer: any = null;

if (supabaseUrl && supabaseServiceRole) {
	supabaseServer = createClient(supabaseUrl, supabaseServiceRole);
} else {
	// Minimal stub implementing the methods used by our API route.
	supabaseServer = {
		from: () => ({
			insert: async () => ({ data: null, error: { message: "Supabase not configured" } }),
			select: async () => ({ data: null, error: { message: "Supabase not configured" } }),
			order: () => ({ select: async () => ({ data: null, error: { message: "Supabase not configured" } }) }),
		}),
	};
}

export { supabaseServer };
export default supabaseServer;
