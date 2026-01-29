import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import MonthYearStepper from "./MonthYearStepper";

type StatsRow = {
  day: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  fibre: number;
};

function formatDayLabel(day: string) {
  const m = day.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!m) return day;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const d = Number(m[3]);
  // Use UTC noon to avoid timezone edge shifts when formatting.
  const dt = new Date(Date.UTC(y, mo - 1, d, 12, 0, 0));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(dt);
}

function currentMonthKeyInTZ(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  if (!year || !month) throw new Error("Failed to compute local month");
  return `${year}-${month}`; // YYYY-MM
}

function parseMonthYear(sp: Record<string, string | string[] | undefined>, fallback: string) {
  const [fy, fm] = fallback.split("-");
  const fallbackYear = Number(fy);
  const fallbackMonth = Number(fm);

  const yearRaw = typeof sp.year === "string" ? sp.year : "";
  const monthRaw = typeof sp.month === "string" ? sp.month : "";

  const year = yearRaw.match(/^\d{4}$/) ? Number(yearRaw) : fallbackYear;
  const month = monthRaw.match(/^\d{2}$/) ? Number(monthRaw) : fallbackMonth;
  return { year, month };
}

function monthBounds(monthKey: string) {
  // monthKey: YYYY-MM
  const [y, m] = monthKey.split("-").map((v) => Number(v));
  if (!Number.isFinite(y) || !Number.isFinite(m) || m < 1 || m > 12) return null;
  const start = new Date(Date.UTC(y, m - 1, 1));
  const end = new Date(Date.UTC(y, m, 0));
  const startISO = start.toISOString().slice(0, 10);
  const endISO = end.toISOString().slice(0, 10);
  return { startISO, endISO };
}

async function getRows(monthKey: string): Promise<StatsRow[]> {
  const supabase = supabaseServer();
  const bounds = monthBounds(monthKey);
  let q = supabase
    .from("stats_tracker")
    .select("day,calories,protein,fibre")
    .order("day", { ascending: true });

  if (bounds) {
    q = q.gte("day", bounds.startISO).lte("day", bounds.endISO);
  }

  const { data, error } = await q;
  if (error) return [];
  return (data ?? []) as StatsRow[];
}

export default async function StatsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = (await searchParams) ?? {};
  const tz = "America/New_York";
  const fallback = currentMonthKeyInTZ(tz);
  const { year, month } = parseMonthYear(sp, fallback);
  const monthKey = `${year}-${String(month).padStart(2, "0")}`;

  const rows = await getRows(monthKey);

  return (
    <main className="max-w-[560px] mx-auto px-4 py-4 sm:p-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <MonthYearStepper year={year} month={month} />
        <Link href="/edit" className="underline">
          edit
        </Link>
      </div>

      <div className="grid gap-4 sm:gap-6 mt-4">
        {rows.length === 0 ? (
          <div>no data available</div>
        ) : (
          <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
            <table className="w-full table-fixed text-center min-w-[400px]">
              <thead>
                <tr>
                  <th className="w-1/4 text-sm sm:text-base">date</th>
                  <th className="w-1/4 text-sm sm:text-base">calories</th>
                  <th className="w-1/4 text-sm sm:text-base">protein</th>
                  <th className="w-1/4 text-sm sm:text-base">fibre</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.day}>
                    <td className="w-1/4 text-sm sm:text-base py-2">{formatDayLabel(r.day)}</td>
                    <td className="w-1/4 text-sm sm:text-base py-2">{r.calories}</td>
                    <td className="w-1/4 text-sm sm:text-base py-2">{r.protein}</td>
                    <td className="w-1/4 text-sm sm:text-base py-2">{r.fibre}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
