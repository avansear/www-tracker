import Link from "next/link";
import { supabaseServer } from "@/lib/supabase/server";
 
type StatsRow = {
  day: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  fibre: number;
};

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
    <div className="min-h-screen font-sans bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-4 py-10">
        <div className="flex items-end justify-between gap-4">
          <Link
            href="/"
            className="rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition
                       bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)]
                       text-foreground
                       hover:bg-[color-mix(in_srgb,var(--color-light)_30%,transparent)]"
          >
            Back
          </Link>

          <form method="get">
            <input
              type="month"
              name="month"
              defaultValue={month}
              className="h-10 rounded-xl px-3 shadow-sm
                         bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)]
                         text-foreground"
            />
          </form>
        </div>

        <div className="rounded-2xl overflow-hidden shadow-sm bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)]">
          {rows.length === 0 ? (
            <div className="px-4 py-6 text-sm font-medium text-[color-mix(in_srgb,var(--color-light)_80%,transparent)]">
              no data available
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="text-xs font-semibold uppercase text-[color-mix(in_srgb,var(--color-light)_80%,transparent)]">
                  <tr>
                    <th className="px-4 py-3">Date</th>
                    <th className="px-4 py-3">Calories</th>
                    <th className="px-4 py-3">Protein</th>
                    <th className="px-4 py-3">Fibre</th>
                  </tr>
                </thead>
                <tbody className="text-foreground">
                  {rows.map((r) => (
                    <tr
                      key={r.day}
                      className="odd:bg-[color-mix(in_srgb,var(--color-light)_12%,transparent)]"
                    >
                      <td className="px-4 py-3 font-medium tabular-nums">{r.day}</td>
                      <td className="px-4 py-3 tabular-nums">{r.calories}</td>
                      <td className="px-4 py-3 tabular-nums">{r.protein}</td>
                      <td className="px-4 py-3 tabular-nums">{r.fibre}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
       </main>
     </div>
   );
 }

