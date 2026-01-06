"use client";

import { useState } from "react";
import { UserStoryPreviewProps } from "@/types/userStoryComponents";
import { formatUserStory } from "@/utils/userStoryFormatter";
import { renderMarkdown } from "@/utils/markdownRenderer";
import { motion } from "framer-motion";

/**
 * Preview component that displays the formatted user story
 * @param {UserStoryPreviewProps} props - Component props
 * @param {UserStoryData} props.data - User story data to preview
 * @param {() => void} props.onClear - Callback function to clear the form
 * @param {() => void} props.onSaveToHistory - Callback function called when story is copied to save to history
 * @returns {JSX.Element} The user story preview component
 */
export function UserStoryPreview({
  data,
  onClear,
  onSaveToHistory,
}: UserStoryPreviewProps) {
  const formattedStory = formatUserStory(data);
  const [copied, setCopied] = useState(false);
  const [titleCopied, setTitleCopied] = useState(false);
  const [titleClicked, setTitleClicked] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onSaveToHistory();
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleCopyTitle = async () => {
    if (!data.title?.trim()) return;

    try {
      await navigator.clipboard.writeText(data.title.trim());
      setTitleCopied(true);
      setTitleClicked(true);
      setTimeout(() => {
        setTitleCopied(false);
        setTitleClicked(false);
      }, 2000);
      onSaveToHistory();
    } catch (error) {
      console.error("Failed to copy title:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
          Preview
        </h2>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClear}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
          >
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>

      {data.title && data.title.trim() && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
            Title
          </label>
          <div
            onClick={handleCopyTitle}
            className={`relative w-full px-4 py-2 pr-10 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 cursor-pointer transition-all select-none ${
              titleClicked
                ? "bg-blue-100 dark:bg-blue-900/30 border-blue-400 dark:border-blue-600"
                : "hover:bg-zinc-100 dark:hover:bg-zinc-700"
            }`}
          >
            <div className="pr-8 truncate">{data.title}</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              {titleCopied ? (
                <svg
                  className="w-5 h-5 text-green-600 dark:text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5 text-zinc-600 dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="p-6 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 min-h-[200px]">
        <div className="text-sm leading-relaxed">
          {renderMarkdown(formattedStory)}
        </div>
      </div>
    </motion.div>
  );
}

