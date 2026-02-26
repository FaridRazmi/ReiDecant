import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

// Will be null if credentials aren't configured yet
export const supabase =
  supabaseUrl && supabaseKey && supabaseKey !== "YOUR_SUPABASE_ANON_KEY_HERE"
    ? createClient(supabaseUrl, supabaseKey)
    : null;
