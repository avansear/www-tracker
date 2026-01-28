 "use client";
 
 import { createClient } from "@supabase/supabase-js";
 
 function requireEnv(name: string) {
   const v = process.env[name];
   if (!v) throw new Error(`Missing env var: ${name}`);
   return v;
 }
 
 export function supabaseBrowser() {
   const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
   const anonKey = requireEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY");
   return createClient(url, anonKey);
 }
 
