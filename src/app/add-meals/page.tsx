"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PasswordModal } from "@/components/PasswordModal";
import { isAuthValid, setAuthGranted } from "@/lib/edit-auth";

type Meal = { id: string; title: string; calories: number; protein: number; fibre: number };

function AddMealsPage() {
  const [title, setTitle] = useState("");
  const [calories, setCalories] = useState("");
  const [protein, setProtein] = useState("");
  const [fibre, setFibre] = useState("");
  const [meals, setMeals] = useState<Meal[]>([]);
  const [mealsLoading, setMealsLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordPrompt, setShowPasswordPrompt] = useState(false);

  async function fetchMeals() {
    setMealsLoading(true);
    try {
      const res = await fetch("/api/meals", { cache: "no-store" });
      const json = (await res.json().catch(() => null)) as { meals?: Meal[] } | null;
      setMeals(json?.meals ?? []);
    } catch {
      setMeals([]);
    } finally {
      setMealsLoading(false);
    }
  }

  useEffect(() => {
    fetchMeals();
  }, []);

  useEffect(() => {
    setIsAuthenticated(isAuthValid());
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowPasswordPrompt(true);
      return;
    }
    const cal = Number(calories);
    const pro = Number(protein);
    const fib = Number(fibre);
    if (!title.trim() || !Number.isFinite(cal) || !Number.isFinite(pro) || !Number.isFinite(fib)) {
      return;
    }
    setAddLoading(true);
    try {
      const res = await fetch("/api/meals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), calories: cal, protein: pro, fibre: fib }),
      });
      const json = (await res.json().catch(() => null)) as { meal?: Meal } | null;
      if (json?.meal) {
        setMeals((prev) => [...prev, json.meal!]);
      }
      setTitle("");
      setCalories("");
      setProtein("");
      setFibre("");
    } finally {
      setAddLoading(false);
    }
  }

  function handlePasswordSuccess() {
    setAuthGranted();
    setIsAuthenticated(true);
    setShowPasswordPrompt(false);
  }

  return (
    <>
      {showPasswordPrompt && (
        <PasswordModal
          onSuccess={handlePasswordSuccess}
          onClose={() => setShowPasswordPrompt(false)}
        />
      )}
      <main className="max-w-[560px] mx-auto px-4 py-4 sm:p-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <h2 className="m-0 text-lg sm:text-xl">add meals</h2>
          <Link href="/edit" className="underline">
            edit
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4 max-w-sm">
          <div>
            <label htmlFor="meal-title" className="block text-sm mb-1">
              title
            </label>
            <input
              id="meal-title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-3 py-2 lowercase focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
              placeholder="meal name"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label htmlFor="meal-cal" className="block text-sm mb-1">
                cal
              </label>
              <input
                id="meal-cal"
                type="number"
                min={0}
                value={calories}
                onChange={(e) => setCalories(e.target.value)}
                className="w-full bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
              />
            </div>
            <div>
              <label htmlFor="meal-protein" className="block text-sm mb-1">
                protein
              </label>
              <input
                id="meal-protein"
                type="number"
                min={0}
                value={protein}
                onChange={(e) => setProtein(e.target.value)}
                className="w-full bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
              />
            </div>
            <div>
              <label htmlFor="meal-fibre" className="block text-sm mb-1">
                fibre
              </label>
              <input
                id="meal-fibre"
                type="number"
                min={0}
                value={fibre}
                onChange={(e) => setFibre(e.target.value)}
                className="w-full bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={addLoading}
            className="inline-flex h-10 items-center justify-center border border-[#eeeeee] bg-[#111111] px-4 text-[#eeeeee] cursor-pointer touch-manipulation w-fit disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {addLoading ? "adding…" : "add meal"}
          </button>
        </form>

        {mealsLoading ? (
          <div className="mt-8 text-sm">loading saved meals…</div>
        ) : meals.length > 0 ? (
          <div className="mt-8">
            <h3 className="text-sm sm:text-base mb-3">saved meals ({meals.length})</h3>
            <ul className="list-none p-0 m-0 flex flex-col gap-2">
              {meals.map((m) => (
                <li
                  key={m.id}
                  className="border border-[#eeeeee] bg-[#111111] px-3 py-2 text-sm"
                >
                  {m.title} · {m.calories} cal · {m.protein}g protein · {m.fibre}g fibre
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </main>
    </>
  );
}

export default AddMealsPage;
