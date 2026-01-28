"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SaveButton } from "@/components/SaveButton";
import { TrackerField } from "@/components/TrackerField";

export default function Home() {
  const [calories, setCalories] = useState(0);
  const [protein, setProtein] = useState(0);
  const [fibre, setFibre] = useState(0);

  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const payload = useMemo(() => ({ calories, protein, fibre }), [calories, protein, fibre]);

  useEffect(() => {
    // If anything changes after saving, allow saving again.
    if (saveState === "saved") setSaveState("idle");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payload.calories, payload.protein, payload.fibre]);

  async function onSave() {
    if (saveState === "saving") return;
    setSaveState("saving");

    try {
      const res = await fetch("/api/stats", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => null))?.error ?? "Save failed");
      setSaveState("saved");
      // Since saves are additive (deltas), reset the local counters after saving.
      setCalories(0);
      setProtein(0);
      setFibre(0);
    } catch {
      setSaveState("idle");
    }
  }

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">
      <main className="mx-auto flex w-full max-w-xl flex-col gap-6 px-4 py-10">
        <header className="flex flex-col gap-1">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl font-semibold tracking-tight">
              avan personal tracker
            </h1>
            <Link
              href="/stats"
              className="rounded-full px-4 py-2 text-sm font-semibold shadow-sm transition
                         bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)]
                         text-foreground
                         hover:bg-[color-mix(in_srgb,var(--color-light)_30%,transparent)]"
            >
              Stats
            </Link>
          </div>
          <p className="text-sm text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
            Calories, protein, fibre.
          </p>
        </header>

        <section className="flex flex-col gap-3">
          <TrackerField
            label="Calories"
            value={calories}
            step={10}
            min={0}
            onChange={setCalories}
          />
          <TrackerField label="Protein" value={protein} step={1} min={0} onChange={setProtein} />
          <TrackerField label="Fibre" value={fibre} step={1} min={0} onChange={setFibre} />
        </section>

        <div className="pt-2">
          <SaveButton state={saveState} onClick={onSave} />
        </div>
      </main>
    </div>
  );
}
