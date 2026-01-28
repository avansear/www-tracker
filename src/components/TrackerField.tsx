 "use client";
 
 type TrackerFieldProps = {
   label: string;
   value: number;
   step: number;
  onDelta: (delta: number) => void;
 };
 
export function TrackerField({ label, value, step, onDelta }: TrackerFieldProps) {
   return (
    <div className="card">
      <div className="row">
        <div>
          <div>{label}</div>
          <div>{value}</div>
        </div>
        <div>
          <button type="button" className="btn" onClick={() => onDelta(-step)}>
            - {step}
          </button>{" "}
          <button type="button" className="btn" onClick={() => onDelta(step)}>
            + {step}
          </button>
        </div>
      </div>
    </div>
   );
 }
