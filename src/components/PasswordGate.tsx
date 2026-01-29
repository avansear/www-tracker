"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { isAuthValid, setAuthGranted } from "@/lib/edit-auth";

type PasswordGateProps = {
  children: React.ReactNode;
};

export function PasswordGate({ children }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (isAuthValid()) {
      setIsAuthenticated(true);
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
