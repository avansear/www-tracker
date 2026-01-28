"use client";

import { useRef } from "react";

function formatMonthLabel(value: string) {
  const m = value.match(/^(\d{4})-(\d{2})$/);
  if (!m) return value;
  const y = Number(m[1]);
  const mo = Number(m[2]);
  const dt = new Date(Date.UTC(y, mo - 1, 1, 12, 0, 0));
  const label = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/New_York",
    month: "short",
    year: "numeric",
  }).format(dt);
  return label.toLowerCase();
}

export default function MonthPickerButton({
  name,
  value,
}: {
  name: string;
  value: string; // YYYY-MM
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const formRef = useRef<HTMLFormElement | null>(null);
  const label = formatMonthLabel(value);

  return (
    <form ref={formRef} method="get">
      {/* Keep input in DOM for showPicker(), but not keyboard accessible */}
      <input
        ref={inputRef}
        type="month"
        name={name}
        defaultValue={value}
        tabIndex={-1}
        aria-hidden="true"
        style={{
          position: "absolute",
          opacity: 0,
          width: 1,
          height: 1,
          pointerEvents: "none",
        }}
        onKeyDown={(e) => e.preventDefault()}
        onChange={() => formRef.current?.requestSubmit()}
      />

      <button
        type="button"
        className="btn"
        aria-label={`Choose month, currently ${label}`}
        onClick={() => {
          const el = inputRef.current;
          if (!el) return;
          // Chromium/Safari: open native picker
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const anyEl = el as any;
          if (typeof anyEl.showPicker === "function") anyEl.showPicker();
          else el.click();
        }}
      >
        {label}
      </button>
    </form>
  );
}

