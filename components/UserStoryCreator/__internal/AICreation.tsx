"use client";

import { useState } from "react";
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

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
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
        setPrompt("");
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
        <label
          htmlFor="ai-prompt"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Prompt
        </label>
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
        onClick={handleGenerate}
        disabled={isGenerating || !prompt.trim()}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-400 dark:disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-medium transition-colors"
        aria-label="Generate user story with AI"
      >
        {isGenerating
          ? "Generating..."
          : `Generate ${type === "story" ? "User Story" : "Bug Report"}`}
      </button>
    </div>
  );
}
