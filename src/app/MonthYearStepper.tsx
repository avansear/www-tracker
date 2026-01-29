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
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center justify-start gap-3">
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
          onClick={() => set(year, month - 1)}
        >
          {"<"}
        </button>
        <div className="flex h-10 sm:h-9 min-w-16 items-center justify-center border border-[#eeeeee] px-2.5 text-sm sm:text-base text-center">
          {labelMonth}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
          onClick={() => set(year, month + 1)}
        >
          {">"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
          onClick={() => set(year - 1, month)}
        >
          {"<"}
        </button>
        <div className="flex h-10 sm:h-9 min-w-16 items-center justify-center border border-[#eeeeee] px-2.5 text-sm sm:text-base text-center">
          {labelYear}
        </div>
        <button
          type="button"
          className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
          onClick={() => set(year + 1, month)}
        >
          {">"}
        </button>
      </div>
    </div>
  );
}
