 import { NextResponse } from "next/server";
 import { supabaseServer } from "@/lib/supabase/server";
 
 type StatsRow = {
   day: string; // YYYY-MM-DD
   calories: number;
   protein: number;
   fibre: number;
 };
 
function todayInTimeZoneISODate(timeZone: string) {
  // Returns YYYY-MM-DD for the given IANA timezone (e.g. America/New_York).
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());

  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!year || !month || !day) throw new Error("Failed to compute local date");
  return `${year}-${month}-${day}`;
 }
 
 export async function POST(req: Request) {
   const body = (await req.json().catch(() => null)) as Partial<StatsRow> | null;
   if (!body) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
 
  // Ann Arbor, MI is America/New_York.
  const tz = "America/New_York";
  const day = (body.day ?? todayInTimeZoneISODate(tz)).slice(0, 10);

  // Treat incoming values as DELTAS to add onto today's totals.
  const caloriesDelta = Number(body.calories ?? 0);
  const proteinDelta = Number(body.protein ?? 0);
  const fibreDelta = Number(body.fibre ?? 0);
 
  if (![caloriesDelta, proteinDelta, fibreDelta].every((n) => Number.isFinite(n))) {
     return NextResponse.json({ error: "Invalid numbers" }, { status: 400 });
   }
 
   const supabase = supabaseServer();
  const { data: existing, error: readErr } = await supabase
    .from("stats_tracker")
    .select("day,calories,protein,fibre")
    .eq("day", day)
    .maybeSingle();

  if (readErr) return NextResponse.json({ error: readErr.message }, { status: 500 });

  // Clamp at 0 so you can't go negative.
  const nextCalories = Math.max(0, (existing?.calories ?? 0) + caloriesDelta);
  const nextProtein = Math.max(0, (existing?.protein ?? 0) + proteinDelta);
  const nextFibre = Math.max(0, (existing?.fibre ?? 0) + fibreDelta);

  const { data, error } = await supabase
    .from("stats_tracker")
    .upsert(
      { day, calories: nextCalories, protein: nextProtein, fibre: nextFibre },
      { onConflict: "day" },
    )
    .select()
    .single();
 
   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ row: data, day, timeZone: tz }, { status: 200 });
 }
 
 export async function GET(req: Request) {
   const url = new URL(req.url);
   const from = url.searchParams.get("from"); // YYYY-MM-DD
   const to = url.searchParams.get("to"); // YYYY-MM-DD
 
   const supabase = supabaseServer();
   let q = supabase
     .from("stats_tracker")
     .select("day,calories,protein,fibre")
     .order("day", { ascending: true });
 
   if (from) q = q.gte("day", from);
   if (to) q = q.lte("day", to);
 
   const { data, error } = await q;
   if (error) return NextResponse.json({ error: error.message }, { status: 500 });
   return NextResponse.json({ rows: data ?? [] }, { status: 200 });
 }

