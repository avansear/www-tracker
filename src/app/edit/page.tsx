"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { TrackerField } from "@/components/TrackerField";
import { PasswordGate } from "@/components/PasswordGate";
import { DayStepper } from "@/components/DayStepper";

type StatsRow = {
  day: string; // YYYY-MM-DD
  calories: number;
  protein: number;
  fibre: number;
};

function todayInTZISODate(timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const year = parts.find((p) => p.type === "year")?.value;
  const month = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!year || !month || !day) return new Date().toISOString().slice(0, 10);
  return `${year}-${month}-${day}`;
}

function EditPage() {
  const tz = "America/New_York";
  const today = useMemo(() => todayInTZISODate(tz), [tz]);

  const [selectedDate, setSelectedDate] = useState(today);
  const [totals, setTotals] = useState<Pick<StatsRow, "calories" | "protein" | "fibre">>({
    calories: 0,
    protein: 0,
    fibre: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/stats?from=${selectedDate}&to=${selectedDate}`,
          { cache: "no-store" },
        );
        const json = (await res.json().catch(() => null)) as { rows?: StatsRow[] } | null;
        const row = json?.rows?.[0];
        if (!cancelled) {
          setTotals({
            calories: row?.calories ?? 0,
            protein: row?.protein ?? 0,
            fibre: row?.fibre ?? 0,
          });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [selectedDate]);

  async function addDelta(delta: Partial<Pick<StatsRow, "calories" | "protein" | "fibre">>) {
    setTotals((t) => ({
      calories: Math.max(0, t.calories + (delta.calories ?? 0)),
      protein: Math.max(0, t.protein + (delta.protein ?? 0)),
      fibre: Math.max(0, t.fibre + (delta.fibre ?? 0)),
    }));

    await fetch("/api/stats", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ...delta, day: selectedDate }),
    }).catch(() => null);
  }

  return (
    <PasswordGate>
      <main className="max-w-[560px] mx-auto px-4 py-4 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="m-0 text-lg sm:text-xl">avan personal tracker</h2>
          <Link href="/" className="underline">
            stats
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-start gap-3 mt-4">
          <DayStepper dateIso={selectedDate} onDateChange={setSelectedDate} />
        </div>

        <div className="grid gap-4 sm:gap-6 mt-4">
          <TrackerField
            label="calories (max 2000)"
            value={totals.calories}
            step={10}
            extraStep={100}
            onDelta={(d) => addDelta({ calories: d })}
          />
          <TrackerField
            label="protein (max 160)"
            value={totals.protein}
            step={1}
            extraStep={10}
            onDelta={(d) => addDelta({ protein: d })}
          />
          <TrackerField
            label="fibre (max 30)"
            value={totals.fibre}
            step={1}
            extraStep={5}
            onDelta={(d) => addDelta({ fibre: d })}
          />
        </div>

        {loading ? <div className="mt-4">loading…</div> : null}
      </main>
    </PasswordGate>
  );
}

export default EditPage;
