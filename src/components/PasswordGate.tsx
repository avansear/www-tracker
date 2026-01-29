"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type PasswordGateProps = {
  children: React.ReactNode;
};

const AUTH_STORAGE_KEY = "edit_access";
const AUTH_DURATION_MS = 14 * 24 * 60 * 60 * 1000; // 2 weeks in milliseconds

function isAuthValid(): boolean {
  try {
    const authData = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!authData) return false;

    const { timestamp } = JSON.parse(authData);
    const now = Date.now();
    const elapsed = now - timestamp;

    // Check if less than 2 weeks have passed
    return elapsed < AUTH_DURATION_MS;
  } catch {
    return false;
  }
}

function setAuthGranted() {
  localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({ granted: true, timestamp: Date.now() })
  );
}

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check if already authenticated (stored in localStorage with 2-week expiration)
    if (isAuthValid()) {
      setIsAuthenticated(true);
    } else {
      // Clear expired auth
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("/api/auth/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (data.success) {
        setAuthGranted();
        setIsAuthenticated(true);
      } else {
        setError("incorrect password");
        setPassword("");
      }
    } catch (err) {
      setError("error checking password");
      setPassword("");
    }
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <main className="max-w-[560px] mx-auto px-4 py-4 sm:p-4">
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <h2 className="text-lg sm:text-xl">enter password</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full max-w-xs">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-4 py-2 lowercase focus:outline-none focus:ring-1 focus:ring-[#eeeeee]"
            placeholder="password"
            autoFocus
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button
            type="submit"
            className="inline-flex h-10 sm:h-9 items-center justify-center border border-[#eeeeee] bg-[#111111] px-4 text-[#eeeeee] cursor-pointer touch-manipulation"
          >
            submit
          </button>
        </form>
        <Link href="/" className="underline text-sm">
          back to stats
        </Link>
      </div>
    </main>
  );
}
