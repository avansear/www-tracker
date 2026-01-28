 import "server-only";
 
 import { createClient } from "@supabase/supabase-js";
 
 function requireEnv(name: string) {
   const v = process.env[name];
   if (!v) throw new Error(`Missing env var: ${name}`);
   return v;
 }
 
 export function supabaseServer() {
   const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
   const serviceRoleKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
 
   // Service role key MUST stay server-side.
   return createClient(url, serviceRoleKey, {
     auth: { persistSession: false, autoRefreshToken: false },
   });
 }
 
