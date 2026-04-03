"use client";

import { useState } from "react";
import { UserStoryData } from "@/types/userStory";
import { formatUserStory } from "@/utils/userStoryFormatter";
import { renderMarkdown } from "@/utils/markdownRenderer";
import { motion } from "framer-motion";

export interface HistoryItem {
  id: number;
  data: UserStoryData;
  createdAt: Date | string;
  updatedAt: Date | string;
}

interface HistoryProps {
  onLoadStory: (data: UserStoryData) => void;
  items: HistoryItem[];
  onItemsChange: (items: HistoryItem[]) => void;
}

/**
 * History component that displays saved user stories
 * @param {HistoryProps} props - Component props
 * @param {(data: UserStoryData) => void} props.onLoadStory - Callback function to load a story
 * @param {HistoryItem[]} props.items - History entries (loaded by parent)
 * @param {(items: HistoryItem[]) => void} props.onItemsChange - Updates history when entries change
 *
 * @returns {JSX.Element} The history component
 */
export function History({ onLoadStory, items, onItemsChange }: HistoryProps) {
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const formatDate = (date: Date | string) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(d);
  };

  const handleLoadStory = (item: HistoryItem) => {
    onLoadStory(item.data);
    setSelectedId(item.id);
  };

  const handleDelete = async (itemId: number) => {
    try {
      const response = await fetch(`/api/user-stories/delete?id=${itemId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onItemsChange(items.filter((item) => item.id !== itemId));
        if (selectedId === itemId) {
          setSelectedId(null);
        }
      } else {
        const { error } = await response.json();
        setError(error || "Failed to delete user story");
      }
    } catch (err) {
      setError("Failed to delete user story");
      console.error(err);
    }
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">
          No saved user stories yet. Start creating one in the Form tab!
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
        Saved User Stories
      </h2>
      <div className="space-y-4">
        {items.map((item) => {
          const formattedStory = formatUserStory(item.data);
          const hasContent =
            item.data.role.trim() ||
            item.data.action.trim() ||
            item.data.benefit.trim();

          if (!hasContent) {
            return null;
          }

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`border rounded-lg p-4 transition-colors ${
                selectedId === item.id
                  ? "border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-950/20"
                  : "border-zinc-200 dark:border-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-700"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {item.data.title && (
                    <h3 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
                      {item.data.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        item.data.type === "bug"
                          ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
                      }`}
                    >
                      {item.data.type === "bug" ? "Bug" : "Story"}
                    </span>
                    {item.data.isAiGenerated && (
                      <span className="px-2 py-1 rounded text-xs font-medium bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400">
                        AI Generated
                      </span>
                    )}
                    <div className="text-sm text-zinc-500 dark:text-zinc-400">
                      Updated: {formatDate(item.updatedAt)}
                    </div>
                  </div>
                  <div className="text-xs text-zinc-500 dark:text-zinc-400">
                    Created: {formatDate(item.createdAt)}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleLoadStory(item)}
                    className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm font-medium"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-900">
                <div className="text-sm leading-relaxed">
                  {renderMarkdown(formattedStory)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

