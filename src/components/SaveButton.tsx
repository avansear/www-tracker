 "use client";
 
 type SaveButtonProps = {
   state: "idle" | "saving" | "saved";
   onClick: () => void;
 };
 
 function Spinner() {
   return (
     <svg
      className="size-5 animate-spin text-green-600"
       viewBox="0 0 24 24"
       aria-hidden="true"
     >
       <circle
         className="opacity-25"
         cx="12"
         cy="12"
         r="10"
         fill="none"
         stroke="currentColor"
         strokeWidth="4"
       />
       <path
         className="opacity-90"
         fill="currentColor"
         d="M12 2a10 10 0 0 1 10 10h-4a6 6 0 0 0-6-6V2z"
       />
     </svg>
   );
 }
 
 export function SaveButton({ state, onClick }: SaveButtonProps) {
   const disabled = state === "saving";
   const label = state === "saved" ? "Saved" : "Save";
 
   return (
     <button
       type="button"
       disabled={disabled}
       onClick={onClick}
      className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full px-5 text-base font-semibold shadow-sm transition disabled:cursor-not-allowed disabled:opacity-60 sm:w-40
                 bg-[color-mix(in_srgb,var(--color-light)_20%,transparent)] text-foreground
                 hover:bg-[color-mix(in_srgb,var(--color-light)_30%,transparent)]"
     >
       {state === "saving" ? <Spinner /> : null}
       <span>{label}</span>
     </button>
   );
 }
