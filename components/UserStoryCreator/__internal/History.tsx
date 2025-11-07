"use client";

import { useState, useEffect } from "react";
import { UserStoryData } from "@/types/userStory";
import { formatUserStory } from "@/utils/userStoryFormatter";
import { renderMarkdown } from "@/utils/markdownRenderer";
import { motion } from "framer-motion";

interface HistoryItem {
  id: number;
  data: UserStoryData;
  createdAt: Date;
  updatedAt: Date;
}

interface HistoryProps {
  onLoadStory: (data: UserStoryData) => void;
}

/**
 * History component that displays saved user stories
 */
export function History({ onLoadStory }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/user-stories/history");
      const { history: historyData, error: errorMessage } =
        await response.json();

      if (errorMessage) {
        setError(errorMessage);
      } else {
        setHistory(historyData || []);
      }
    } catch (err) {
      setError("Failed to load history");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
        // Remove the item from the local state
        setHistory((prev) => prev.filter((item) => item.id !== itemId));
        // Clear selection if the deleted item was selected
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

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-zinc-600 dark:text-zinc-400">Loading history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600 dark:text-red-400">{error}</p>
      </div>
    );
  }

  if (history.length === 0) {
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
        {history.map((item) => {
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
                  <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-2">
                    Updated: {formatDate(item.updatedAt)}
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

