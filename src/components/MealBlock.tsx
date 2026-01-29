"use client";

type MealBlockProps = {
  title: string;
  calories: number;
  protein: number;
  fibre: number;
  onAdd: () => void;
};

export function MealBlock({ title, calories, protein, fibre, onAdd }: MealBlockProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className="aspect-square w-full min-w-0 max-w-[200px] flex flex-col items-center justify-center gap-0.5 border border-[#eeeeee] bg-[#111111] p-4 text-[#eeeeee] cursor-pointer touch-manipulation hover:border-[#cccccc] focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
    >
      <span className="text-sm sm:text-base font-medium leading-tight line-clamp-2 w-full text-center">
        {title}
      </span>
      <span className="text-sm">{calories} cal</span>
      <span className="text-sm">{protein}g protein</span>
      <span className="text-sm">{fibre}g fibre</span>
    </button>
  );
}
