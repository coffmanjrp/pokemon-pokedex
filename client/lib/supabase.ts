import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/supabase";

// Validate environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false, // We don't need auth for this app
  },
  db: {
    schema: "public",
  },
  global: {
    headers: {
      "x-client-info": "pokemon-pokedex",
    },
    fetch: (url, init) => {
      // Add timeout to Supabase requests
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30 second timeout

      return fetch(url, {
        ...init,
        signal: controller.signal,
      }).finally(() => clearTimeout(timeout));
    },
  },
});

// Helper function to handle Supabase errors
export function handleSupabaseError(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return "An unexpected error occurred";
}
