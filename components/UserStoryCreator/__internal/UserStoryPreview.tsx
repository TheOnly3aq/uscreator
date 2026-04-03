"use client";

import { useState } from "react";
import { UserStoryPreviewProps } from "@/types/userStoryComponents";
import { formatUserStory } from "@/utils/userStoryFormatter";
import { renderMarkdown } from "@/utils/markdownRenderer";
import { motion } from "framer-motion";

/** Renders formatted output, copy actions, and clear. */
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
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-[21px] font-semibold tracking-tight text-[#f5f5f7]">
          Preview
        </h2>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onClear}
            className="apple-btn-danger apple-btn-compact"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={handleCopy}
            className="apple-btn-primary apple-btn-compact"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      {data.title && data.title.trim() && (
        <div className="mb-4">
          <label className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]">
            Title
          </label>
          <div
            onClick={handleCopyTitle}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                void handleCopyTitle();
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Copy title to clipboard"
            className={`relative w-full cursor-pointer select-none rounded-2xl border px-4 py-3 pr-10 text-[15px] text-[#f5f5f7] transition-all ${
              titleClicked
                ? "border-[#2997ff]/45 bg-[#2997ff]/10"
                : "border-white/[0.12] bg-white/[0.05] hover:bg-white/[0.08]"
            }`}
          >
            <div className="pr-8 truncate">{data.title}</div>
            <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none">
              {titleCopied ? (
                <svg
                  className="h-5 w-5 text-[#30d158]"
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
                  className="h-5 w-5 text-[#a1a1a6]"
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

      <div className="min-h-[200px] rounded-2xl border border-white/[0.1] bg-black/30 p-6 shadow-inner shadow-black/40">
        <div className="text-[15px] leading-relaxed text-[#d1d1d6]">
          {renderMarkdown(formattedStory)}
        </div>
      </div>
    </motion.div>
  );
}

