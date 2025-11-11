import { useState } from "react";
import { AdminUserStory } from "@/types/admin";

interface StoryCardProps {
  story: AdminUserStory;
  onDeleteStory: (storyId: number) => Promise<void>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

/**
 * Story card component displaying individual user story details
 * @param {StoryCardProps} props - Component props
 * @param {AdminUserStory} props.story - User story data to display
 * @param {(storyId: number) => Promise<void>} props.onDeleteStory - Callback function to delete a story
 */
export function StoryCard({ story, onDeleteStory }: StoryCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this story?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await onDeleteStory(story.id);
    } catch (error) {
      console.error("Error deleting story:", error);
      alert("Failed to delete story");
    } finally {
      setIsDeleting(false);
    }
  };
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
              ID: {story.id}
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-medium ${
                story.type === "bug"
                  ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400"
                  : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
              }`}
            >
              {story.type === "bug" ? "Bug" : "Story"}
            </span>
            {story.isDraft && (
              <span className="px-2 py-1 text-xs rounded bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200">
                Draft
              </span>
            )}
          </div>
          <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400">
            Session: {story.sessionId.substring(0, 16)}...
          </p>
        </div>
        <div className="flex items-start gap-4">
          <div className="text-xs text-zinc-500 dark:text-zinc-400">
            <div>Created: {formatDate(story.createdAt)}</div>
            <div>Updated: {formatDate(story.updatedAt)}</div>
          </div>
          <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      <div className="space-y-3">
        {story.role && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Role:
            </span>{" "}
            <span className="text-zinc-900 dark:text-zinc-100">{story.role}</span>
          </div>
        )}
        {story.action && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Action:
            </span>{" "}
            <span className="text-zinc-900 dark:text-zinc-100">
              {story.action}
            </span>
          </div>
        )}
        {story.benefit && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Benefit:
            </span>{" "}
            <span className="text-zinc-900 dark:text-zinc-100">
              {story.benefit}
            </span>
          </div>
        )}
        {story.background && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Background:
            </span>
            <p className="text-zinc-900 dark:text-zinc-100 mt-1">
              {story.background}
            </p>
          </div>
        )}
        {story.acceptanceCriteria.length > 0 && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Acceptance Criteria:
            </span>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {story.acceptanceCriteria.map((criteria, idx) => (
                <li key={idx} className="text-zinc-900 dark:text-zinc-100">
                  {criteria}
                </li>
              ))}
            </ul>
          </div>
        )}
        {story.technicalInfo.length > 0 && (
          <div>
            <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Technical Info:
            </span>
            <ul className="list-disc list-inside mt-1 space-y-1">
              {story.technicalInfo.map((info, idx) => (
                <li key={idx} className="text-zinc-900 dark:text-zinc-100">
                  {info}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

