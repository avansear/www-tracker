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
    className="flex h-12 w-30 items-center justify-center rounded-full font-semibold gap-2 bg-neutral-100 text-neutral-950"
    >
      {state === "saving" ? <Spinner /> : null}
      <span>{label}</span>
    </button>
  );
}
