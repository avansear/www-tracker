"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

function monthName(m: number) {
  const names = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
  return names[m - 1] ?? String(m);
}

function clampMonth(m: number) {
  if (m < 1) return 1;
  if (m > 12) return 12;
  return m;
}

export default function MonthYearStepper({ year, month }: { year: number; month: number }) {
  const router = useRouter();

  const labelMonth = useMemo(() => monthName(month), [month]);
  const labelYear = useMemo(() => String(year), [year]);

  function set(nextYear: number, nextMonth: number) {
    const y = nextYear;
    const m = clampMonth(nextMonth);
    const params = new URLSearchParams();
    params.set("year", String(y));
    params.set("month", String(m).padStart(2, "0"));
    router.push(`/stats?${params.toString()}`);
  }

  return (
    <div className="row" style={{ justifyContent: "flex-start" }}>
      <div className="row" style={{ gap: 8 }}>
        <button type="button" className="btn btn-square" onClick={() => set(year, month - 1)}>
          {"<"}
        </button>
        <div className="box">{labelMonth}</div>
        <button type="button" className="btn btn-square" onClick={() => set(year, month + 1)}>
          {">"}
        </button>
      </div>

      <div className="row" style={{ gap: 8 }}>
        <button type="button" className="btn btn-square" onClick={() => set(year - 1, month)}>
          {"<"}
        </button>
        <div className="box">{labelYear}</div>
        <button type="button" className="btn btn-square" onClick={() => set(year + 1, month)}>
          {">"}
        </button>
      </div>
    </div>
  );
}

