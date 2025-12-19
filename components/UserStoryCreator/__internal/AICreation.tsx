"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UserStoryData } from "@/types/userStory";

interface AICreationProps {
  onGenerate: (data: UserStoryData) => void;
}

/**
 * AI Creation component that allows users to generate user stories or bugs using AI
 * @param {AICreationProps} props - Component props
 * @param {(data: UserStoryData) => void} props.onGenerate - Callback function called when AI generates data
 * @returns {JSX.Element} The AI creation component
 */
export function AICreation({ onGenerate }: AICreationProps) {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState<"story" | "bug">("story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThinPromptModal, setShowThinPromptModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Checks if the prompt is too thin (not enough information)
   * @param {string} promptText - The prompt text to validate
   * @returns {boolean} True if the prompt is too thin
   */
  const isPromptTooThin = (promptText: string): boolean => {
    const trimmed = promptText.trim();
    if (!trimmed) return true;

    const words = trimmed.split(/\s+/).filter((word) => word.length > 0);

    return words.length < 10;
  };

  const handleGenerate = async (bypassValidation = false) => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!bypassValidation && isPromptTooThin(prompt)) {
      setShowThinPromptModal(true);
      return;
    }

    if (showThinPromptModal) {
      setShowThinPromptModal(false);
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/user-stories/ai-generate/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: prompt.trim(), type }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to generate user story");
      }

      if (result.data) {
        onGenerate(result.data);
      } else {
        throw new Error("No data received from AI");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleGenerate();
    }
  };

  const handleBypass = () => {
    handleGenerate(true);
  };

  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const response = await fetch("/api/user-stories/ai-prompt");
        if (response.ok) {
          const result = await response.json();
          if (result.prompt) {
            setPrompt(result.prompt);
          }
        }
      } catch (err) {
        console.error("Failed to load prompt:", err);
      }
    };

    loadPrompt();
  }, []);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/user-stories/ai-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
      } catch (err) {
        console.error("Failed to save prompt:", err);
      }
    }, 500); // Debounce for 500ms

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [prompt]);

  const handleClearPrompt = async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/user-stories/ai-prompt", {
        method: "DELETE",
      });

      if (response.ok) {
        setPrompt("");
      } else {
        throw new Error("Failed to clear prompt");
      }
    } catch (err) {
      console.error("Failed to clear prompt:", err);
      setError("Failed to clear prompt");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showThinPromptModal) {
        setShowThinPromptModal(false);
      }
    };

    if (showThinPromptModal) {
      document.addEventListener("keydown", handleEscape);
      setTimeout(() => {
        modalRef.current?.focus();
      }, 100);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showThinPromptModal]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          AI Creation
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
          Describe what you want to create, and AI will generate a{" "}
          {type === "story" ? "user story" : "bug report"} for you.
        </p>
      </div>

      <div>
        <label
          htmlFor="ai-type"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Type
        </label>
        <select
          id="ai-type"
          value={type}
          onChange={(e) => setType(e.target.value as "story" | "bug")}
          disabled={isGenerating}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <option value="story">Story</option>
          <option value="bug">Bug</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label
            htmlFor="ai-prompt"
            className="block text-sm font-medium text-zinc-700 dark:text-zinc-300"
          >
            Prompt
          </label>
          {prompt && (
            <button
              type="button"
              onClick={handleClearPrompt}
              disabled={isClearing || isGenerating}
              className="text-xs px-2 py-1 rounded text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Clear prompt"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={6}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 disabled:opacity-50 disabled:cursor-not-allowed resize-none"
          placeholder={
            type === "story"
              ? "e.g., Users should be able to save their preferences so they don't have to reconfigure settings every time they visit the site"
              : "e.g., When users click the disabled filter button, they get redirected to an undefined page instead of seeing filtered results"
          }
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          Press Cmd/Ctrl + Enter to generate
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => handleGenerate()}
        disabled={isGenerating || !prompt.trim()}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
        aria-label="Generate user story with AI"
      >
        {isGenerating
          ? "Generating..."
          : `Generate ${type === "story" ? "User Story" : "Bug Report"}`}
      </button>

      <AnimatePresence>
        {showThinPromptModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowThinPromptModal(false)}
              className="fixed inset-0 bg-black/50 z-40"
              aria-hidden="true"
            />
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
              <motion.div
                ref={modalRef}
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl border border-zinc-200 dark:border-zinc-800 p-6 max-w-md w-full pointer-events-auto"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                tabIndex={-1}
              >
                <h2
                  id="modal-title"
                  className="text-xl font-semibold mb-3 text-zinc-900 dark:text-zinc-100"
                >
                  Prompt Too Short
                </h2>
                <p
                  id="modal-description"
                  className="text-sm text-zinc-600 dark:text-zinc-400 mb-6"
                >
                  Your prompt is too brief. Please provide more details about
                  what you want to create. Include information about:
                </p>
                <ul className="text-sm text-zinc-600 dark:text-zinc-400 mb-6 list-disc list-inside space-y-1">
                  {type === "story" ? (
                    <>
                      <li>Who the user is (role/persona)</li>
                      <li>What they want to do (action)</li>
                      <li>Why they want it (benefit/value)</li>
                      <li>Any relevant context or background</li>
                    </>
                  ) : (
                    <>
                      <li>What the bug is (description)</li>
                      <li>Steps to reproduce the issue</li>
                      <li>Expected behavior</li>
                      <li>Actual behavior</li>
                    </>
                  )}
                </ul>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowThinPromptModal(false)}
                    className="flex-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    aria-label="Close modal"
                  >
                    Got it
                  </button>
                  <button
                    type="button"
                    onClick={handleBypass}
                    disabled={isGenerating}
                    className="flex-1 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-400 dark:disabled:bg-red-700 disabled:cursor-not-allowed text-white font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 dark:focus:ring-red-400"
                    aria-label="Bypass prompt validation and generate anyway"
                  >
                    Bypass
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
