 "use client";
 
 type TrackerFieldProps = {
   label: string;
   value: number;
   step: number;
  onDelta: (delta: number) => void;
  extraStep?: number;
 };
 
export function TrackerField({ label, value, step, extraStep, onDelta }: TrackerFieldProps) {
  const steps = extraStep ? [step, extraStep] : [step];

   return (
    <div className="card">
      <div className="row">
        <div>
          <div>{label}</div>
          <div>{value}</div>
        </div>
        <div>
          {steps.map((s) => (
            <span key={s}>
              <button type="button" className="btn" onClick={() => onDelta(-s)}>
                - {s}
              </button>{" "}
              <button type="button" className="btn" onClick={() => onDelta(s)}>
                + {s}
              </button>{" "}
            </span>
          ))}
        </div>
      </div>
    </div>
   );
 }
