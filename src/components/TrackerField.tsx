 "use client";
 
 type TrackerFieldProps = {
   label: string;
   value: number;
   step: number;
   onChange: (next: number) => void;
   min?: number;
 };
 
 export function TrackerField({ label, value, step, onChange, min }: TrackerFieldProps) {
   const canDecrement = min === undefined ? true : value - step >= min;
 
   return (
    <div
      className="w-full rounded-2xl p-4 shadow-sm
                 bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)]"
    >
       <div className="flex items-center justify-between gap-4">
         <div className="min-w-0">
          <div className="text-sm font-medium text-[color-mix(in_srgb,var(--foreground)_55%,transparent)]">
            {label}
          </div>
          <div className="mt-1 text-3xl font-semibold tabular-nums text-foreground">
            {value}
          </div>
         </div>
 
         <div className="flex shrink-0 items-center gap-3">
           <button
             type="button"
             aria-label={`Decrease ${label}`}
             disabled={!canDecrement}
             onClick={() => onChange(min === undefined ? value - step : Math.max(min, value - step))}
            className="grid size-11 place-items-center rounded-full text-xl font-semibold shadow-sm transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40
                       bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)] text-foreground"
           >
             −
           </button>
 
          <div className="grid size-11 place-items-center rounded-xl text-base font-semibold tabular-nums
                          bg-[color-mix(in_srgb,var(--color-light)_12%,transparent)]
                          text-foreground">
             {step}
           </div>
 
           <button
             type="button"
             aria-label={`Increase ${label}`}
             onClick={() => onChange(value + step)}
            className="grid size-11 place-items-center rounded-full text-xl font-semibold shadow-sm transition active:scale-[0.98]
                       bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)] text-foreground"
           >
             +
           </button>
         </div>
       </div>
     </div>
   );
 }
