import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
import MonthPickerButton from "./MonthPickerButton";
 
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
  const month =
    typeof sp.month === "string" && sp.month.match(/^\d{4}-\d{2}$/)
      ? sp.month
      : currentMonthKeyInTZ(tz);

  const rows = await getRows(month);
 
  return (
    <main>
      <div className="row">
        <MonthPickerButton name="month" value={month} />
        <Link href="/">back</Link>
      </div>

      <div className="stack">
        {rows.length === 0 ? (
          <div>no data available</div>
        ) : (
          <table className="center">
            <thead>
              <tr>
                <th>Date</th>
                <th>Calories</th>
                <th>Protein</th>
                <th>Fibre</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.day}>
                  <td>{formatDayLabel(r.day)}</td>
                  <td>{r.calories}</td>
                  <td>{r.protein}</td>
                  <td>{r.fibre}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
}

