"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { setAuthGranted } from "@/lib/edit-auth";

type PasswordModalProps = {
  onSuccess: () => void;
  onClose: () => void;
};

export function PasswordModal({ onSuccess, onClose }: PasswordModalProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
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
        onSuccess();
      } else {
        setError("incorrect password");
        setPassword("");
      }
    } catch (err) {
      setError("error checking password");
      setPassword("");
    }
  }

  const popup = (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="password-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/70"
        aria-hidden="true"
        onClick={onClose}
      />
      <div className="relative z-10 bg-[#111111] border border-[#eeeeee] rounded-lg shadow-2xl p-6 max-w-xs w-full">
        <h2 id="password-modal-title" className="text-lg sm:text-xl mb-4">
          enter password to make changes
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-[#111111] border border-[#eeeeee] text-[#eeeeee] px-4 py-2 lowercase focus:outline-none focus:ring-1 focus:ring-[#eeeeee] rounded"
            placeholder="password"
            autoFocus
          />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center border border-[#eeeeee] bg-[#111111] px-4 text-[#eeeeee] cursor-pointer touch-manipulation rounded"
            >
              cancel
            </button>
            <button
              type="submit"
              className="inline-flex h-10 items-center justify-center border border-[#eeeeee] bg-[#111111] px-4 text-[#eeeeee] cursor-pointer touch-manipulation rounded"
            >
              submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  if (!mounted || typeof document === "undefined") return null;
  return createPortal(popup, document.body);
}
