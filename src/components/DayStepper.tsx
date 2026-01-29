"use client";

import { useMemo } from "react";

const MONTH_NAMES = [
  "jan", "feb", "mar", "apr", "may", "jun",
  "jul", "aug", "sep", "oct", "nov", "dec",
];

function parseIso(iso: string): { y: number; m: number; d: number } {
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  return { y: y ?? 0, m: m ?? 1, d: d ?? 1 };
}

function toIso(y: number, m: number, d: number): string {
  return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
}

function addDays(iso: string, delta: number): string {
  const { y, m, d } = parseIso(iso);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() + delta);
  return toIso(
    date.getUTCFullYear(),
    date.getUTCMonth() + 1,
    date.getUTCDate(),
  );
}

type DayStepperProps = {
  dateIso: string; // YYYY-MM-DD
  onDateChange: (dateIso: string) => void;
};

export function DayStepper({ dateIso, onDateChange }: DayStepperProps) {
  const { y, m, d } = parseIso(dateIso);
  const monthName = MONTH_NAMES[m - 1] ?? String(m);
  const label = useMemo(
    () => `${d} ${monthName} ${y}`,
    [d, monthName, y],
  );

  function goPrev() {
    onDateChange(addDays(dateIso, -1));
  }

  function goNext() {
    onDateChange(addDays(dateIso, 1));
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
        onClick={goPrev}
        aria-label="previous day"
      >
        {"<"}
      </button>
      <div className="flex h-10 sm:h-9 min-w-28 sm:min-w-32 items-center justify-center border border-[#eeeeee] px-2.5 text-sm sm:text-base text-center">
        {label}
      </div>
      <button
        type="button"
        className="inline-flex h-10 w-10 sm:h-9 sm:w-9 min-w-10 sm:min-w-9 items-center justify-center border border-[#eeeeee] bg-[#111111] p-0 text-[#eeeeee] cursor-pointer touch-manipulation"
        onClick={goNext}
        aria-label="next day"
      >
        {">"}
      </button>
    </div>
  );
}
