 "use client";

 type TrackerFieldProps = {
   label: string;
   value: number;
   step: number;
   onDelta: (delta: number) => void;
   extraStep?: number;
 };

 export function TrackerField({ label, value, step, extraStep, onDelta }: TrackerFieldProps) {
   const deltas =
     extraStep != null
       ? [-extraStep, -step, step, extraStep]
       : [-step, step];

  return (
    <div className="bg-[#111111]">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-3">
        <div className="min-w-0">
          <div className="text-sm sm:text-base">{label}</div>
          <div className="text-lg sm:text-xl font-medium">{value}</div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 w-full sm:w-auto">
          {deltas.map((delta, idx) => (
            <button
              key={idx}
              type="button"
              className="inline-flex h-10 sm:h-9 min-w-14 sm:min-w-16 items-center justify-center border border-[#eeeeee] bg-[#111111] px-3 sm:px-2.5 text-sm sm:text-base text-[#eeeeee] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed touch-manipulation"
              onClick={() => onDelta(delta)}
            >
              {delta < 0 ? "- " : "+ "}
              {Math.abs(delta)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
 }

