import { useState } from "react";
import { AdminUserStory } from "@/types/admin";

interface StoryCardProps {
  story: AdminUserStory;
  onDeleteStory: (storyId: number) => Promise<void>;
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleString();
};

/**
 * Story card component displaying individual user story details
 * @param {StoryCardProps} props - Component props
 * @param {AdminUserStory} props.story - User story data to display
 * @param {(storyId: number) => Promise<void>} props.onDeleteStory - Callback function to delete a story
 */
export const StoryCard = ({ story, onDeleteStory }: StoryCardProps) => {
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
    <div className="uscreator-panel p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="font-mono text-[11px] text-[#6e6e73]">
              ID: {story.id}
            </span>
            <span
              className={`rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide ${
                story.type === "bug"
                  ? "bg-[#ff453a]/20 text-[#ff9a93]"
                  : "bg-[#2997ff]/20 text-[#6eb9ff]"
              }`}
            >
              {story.type === "bug" ? "Bug" : "Story"}
            </span>
            {story.isDraft && (
              <span className="rounded-full bg-[#ffd60a]/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#ffe98a]">
                Draft
              </span>
            )}
          </div>
          <p className="font-mono text-[11px] text-[#6e6e73]">
            Session: {story.sessionId.substring(0, 16)}…
          </p>
        </div>
        <div className="flex flex-col items-start gap-3 sm:items-end">
          <div className="text-[11px] text-[#6e6e73]">
            <div>Created: {formatDate(story.createdAt)}</div>
            <div>Updated: {formatDate(story.updatedAt)}</div>
          </div>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-[12px] font-semibold text-[#ff6961] transition-colors hover:text-[#ff9a93] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>

      <div className="space-y-4 text-[15px]">
        {story.role && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Role:
            </span>{" "}
            <span className="text-[#f5f5f7]">{story.role}</span>
          </div>
        )}
        {story.action && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Action:
            </span>{" "}
            <span className="text-[#f5f5f7]">{story.action}</span>
          </div>
        )}
        {story.benefit && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Benefit:
            </span>{" "}
            <span className="text-[#f5f5f7]">{story.benefit}</span>
          </div>
        )}
        {story.background && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Background:
            </span>
            <p className="mt-1 text-[#d1d1d6]">{story.background}</p>
          </div>
        )}
        {story.acceptanceCriteria.length > 0 && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Acceptance criteria:
            </span>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#d1d1d6]">
              {story.acceptanceCriteria.map((criteria, idx) => (
                <li key={idx}>{criteria}</li>
              ))}
            </ul>
          </div>
        )}
        {story.technicalInfo.length > 0 && (
          <div>
            <span className="text-[13px] font-semibold text-[#a1a1a6]">
              Technical info:
            </span>
            <ul className="mt-2 list-inside list-disc space-y-1 text-[#d1d1d6]">
              {story.technicalInfo.map((info, idx) => (
                <li key={idx}>{info}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
