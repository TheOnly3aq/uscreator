"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { setCookie } from "@/utils/cookies";

interface PasswordGateProps {
  onAuthenticated: () => void;
}

/**
 * Password protection component that gates access to the application
 */
export function PasswordGate({ onAuthenticated }: PasswordGateProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setCookie("authenticated", 7);
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
        className="flex flex-1 items-center justify-center bg-zinc-50 dark:bg-zinc-950 px-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-md"
        >
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-8 border border-zinc-200 dark:border-zinc-800">
            <h1 className="text-2xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">
              User Story Creator
            </h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Please enter the password to continue
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  placeholder="Enter password"
                  autoFocus
                />
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-red-500"
                  >
                    {error}
                  </motion.p>
                )}
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white transition-colors font-medium"
              >
                {isLoading ? "Authenticating..." : "Continue"}
              </button>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
