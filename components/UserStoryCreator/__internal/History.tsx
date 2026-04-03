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

/** Saved stories list with load and delete actions. */
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
      <div className="py-12 text-center">
        <p className="text-[15px] text-[#ff6961]">{error}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="mx-auto max-w-md text-[15px] leading-relaxed text-[#a1a1a6]">
          No saved stories yet. Create one in the Form tab, then copy or save to
          history.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-8 text-[21px] font-semibold tracking-tight text-[#f5f5f7]">
        Saved user stories
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
              className={`rounded-[22px] border p-5 transition-colors ${
                selectedId === item.id
                  ? "border-[#2997ff]/45 bg-[#2997ff]/[0.08]"
                  : "border-white/[0.1] bg-white/[0.02] hover:border-white/[0.16]"
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {item.data.title && (
                    <h3 className="mb-2 text-[17px] font-semibold text-[#f5f5f7]">
                      {item.data.title}
                    </h3>
                  )}
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span
                      className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                        item.data.type === "bug"
                          ? "bg-[#ff453a]/20 text-[#ff9a93]"
                          : "bg-[#2997ff]/20 text-[#6eb9ff]"
                      }`}
                    >
                      {item.data.type === "bug" ? "Bug" : "Story"}
                    </span>
                    {item.data.isAiGenerated && (
                      <span className="rounded-full bg-[#bf5af2]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#d9a9ff]">
                        AI Generated
                      </span>
                    )}
                    <div className="text-[13px] text-[#6e6e73]">
                      Updated: {formatDate(item.updatedAt)}
                    </div>
                  </div>
                  <div className="text-[12px] text-[#6e6e73]">
                    Created: {formatDate(item.createdAt)}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    type="button"
                    onClick={() => handleLoadStory(item)}
                    className="apple-btn-primary apple-btn-compact"
                  >
                    Load
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    className="apple-btn-danger apple-btn-compact"
                  >
                    Delete
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-white/[0.08] bg-black/35 p-4">
                <div className="text-[14px] leading-relaxed text-[#d1d1d6]">
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

