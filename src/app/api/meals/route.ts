import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

function rowToMeal(row: { id: string; title: string | null; calories: number; protein: number; fibre: number }) {
  return {
    id: String(row.id),
    title: row.title ?? "",
    calories: Number(row.calories) ?? 0,
    protein: Number(row.protein) ?? 0,
    fibre: Number(row.fibre) ?? 0,
  };
}

export async function GET() {
  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("stats_meals")
    .select("id, title, calories, protein, fibre")
    .order("created_at", { ascending: true });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const meals = (data ?? []).map(rowToMeal);
  return NextResponse.json({ meals });
}

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => null)) as {
    title?: string;
    calories?: number;
    protein?: number;
    fibre?: number;
  } | null;

  if (!body || typeof body.title !== "string" || !body.title.trim()) {
    return NextResponse.json({ error: "title required" }, { status: 400 });
  }

  const title = body.title.trim();
  const calories = Number(body.calories);
  const protein = Number(body.protein);
  const fibre = Number(body.fibre);

  if (!Number.isFinite(calories) || !Number.isFinite(protein) || !Number.isFinite(fibre)) {
    return NextResponse.json({ error: "calories, protein, fibre must be numbers" }, { status: 400 });
  }

  const supabase = supabaseServer();
  const { data, error } = await supabase
    .from("stats_meals")
    .insert({ title, calories, protein, fibre })
    .select("id, title, calories, protein, fibre")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ meal: rowToMeal(data) });
}
