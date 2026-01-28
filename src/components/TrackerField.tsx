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
    <div className="card">
      <div className="row">
        <div>
          <div>{label}</div>
          <div>{value}</div>
        </div>
        <div>
          {deltas.map((delta, idx) => (
            <button
              key={idx}
              type="button"
              className="btn"
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
