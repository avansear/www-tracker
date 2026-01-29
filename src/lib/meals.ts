export type MealPreset = {
  id: string;
  title: string;
  calories: number;
  protein: number;
  fibre: number;
};

const STORAGE_KEY = "meal_presets";

const DEFAULT_MEALS: MealPreset[] = [
  { id: "1", title: "just bare breaded chicken nuggets", calories: 200, protein: 20, fibre: 0 },
  { id: "2", title: "grilled cheese w fibre toast", calories: 140, protein: 18, fibre: 12 },
];

function getStored(): MealPreset[] {
  if (typeof window === "undefined") return DEFAULT_MEALS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_MEALS;
    const parsed = JSON.parse(raw) as MealPreset[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_MEALS;
  } catch {
    return DEFAULT_MEALS;
  }
}

export function getMealPresets(): MealPreset[] {
  return getStored();
}

export function addMealPreset(meal: Omit<MealPreset, "id">): MealPreset[] {
  const list = getStored();
  const id = crypto.randomUUID?.() ?? `meal-${Date.now()}`;
  const next = [...list, { ...meal, id }];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeMealPreset(id: string): MealPreset[] {
  const list = getStored().filter((m) => m.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}
