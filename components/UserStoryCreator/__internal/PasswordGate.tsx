"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
interface PasswordGateProps {
  onAuthenticated: () => void;
}

/** Password gate before accessing the app. */
export function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        onAuthenticated();
      } else {
        setError(data.error || "Invalid password");
      }
    } catch (err) {
      setError("Failed to authenticate. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex w-full flex-1 items-center justify-center px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="uscreator-panel p-8 sm:p-10">
            <h1 className="mb-2 text-center text-[28px] font-semibold tracking-tight text-[#f5f5f7] sm:text-left">
              StoryFlow
            </h1>
            <p className="mb-8 text-center text-[15px] leading-relaxed text-[#a1a1a6] sm:text-left">
              Enter the password to continue.
            </p>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="uscreator-field"
                  placeholder="Password"
                  autoComplete="current-password"
                  autoFocus
                  aria-invalid={error ? "true" : "false"}
                  aria-describedby={error ? "password-error" : undefined}
                />
                {error && (
                  <motion.p
                    id="password-error"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-[13px] text-[#ff6961]"
                    role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="uscreator-btn-primary w-full"
              >
                {isLoading ? "Signing in…" : "Continue"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
