"use client";

import { useState } from "react";
import { UserStoryData } from "@/types/userStory";
import { formatUserStory } from "@/utils/userStoryFormatter";
import { renderMarkdown } from "@/utils/markdownRenderer";
import { motion } from "framer-motion";

interface UserStoryPreviewProps {
  data: UserStoryData;
  onClear: () => void;
}

/**
 * Preview component that displays the formatted user story
 */
export function UserStoryPreview({ data, onClear }: UserStoryPreviewProps) {
  const formattedStory = formatUserStory(data);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedStory);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
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
      <div className="p-6 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900 min-h-[200px]">
        <div className="text-sm leading-relaxed">
          {renderMarkdown(formattedStory)}
        </div>
      </div>
    </motion.div>
  );
}

