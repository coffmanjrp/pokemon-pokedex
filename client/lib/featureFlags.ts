// Feature flags for gradual migration to Supabase
export const FEATURE_FLAGS = {
  // Enable Supabase for Pokemon list data fetching
  USE_SUPABASE_FOR_LIST:
    process.env.NEXT_PUBLIC_USE_SUPABASE_FOR_LIST === "true",

  // Enable Supabase for Pokemon detail data fetching
  USE_SUPABASE_FOR_DETAIL:
    process.env.NEXT_PUBLIC_USE_SUPABASE_FOR_DETAIL === "true",

  // Enable Supabase for SSG (Static Site Generation)
  USE_SUPABASE_FOR_SSG: process.env.NEXT_PUBLIC_USE_SUPABASE_FOR_SSG === "true",
} as const;

// Helper function to check if Supabase is enabled
export function isSupabaseEnabled(): boolean {
  return Object.values(FEATURE_FLAGS).some((flag) => flag);
}

// Helper function to get data source name
export function getDataSource(): "supabase" | "graphql" {
  return isSupabaseEnabled() ? "supabase" : "graphql";
}
