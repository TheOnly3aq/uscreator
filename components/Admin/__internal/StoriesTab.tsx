import { motion } from "framer-motion";
import { AdminUserStory } from "@/types/admin";
import { StoryCard } from "./StoryCard";
import { SessionFilter } from "./SessionFilter";

interface StoriesTabProps {
  stories: AdminUserStory[];
  selectedSessionId: string | null;
  onClearFilter: () => void;
}

/**
 * Stories tab component displaying list of user stories
 * @param {StoriesTabProps} props - Component props
 * @param {AdminUserStory[]} props.stories - Array of user stories to display
 * @param {string | null} props.selectedSessionId - Currently selected session ID for filtering
 * @param {() => void} props.onClearFilter - Callback function to clear session filter
 */
export function StoriesTab({
  stories,
  selectedSessionId,
  onClearFilter,
}: StoriesTabProps) {
  return (
    <div className="space-y-4">
      {selectedSessionId && (
        <SessionFilter sessionId={selectedSessionId} onClear={onClearFilter} />
      )}

      <div className="space-y-4">
        {stories.length === 0 ? (
          <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800 text-center text-zinc-600 dark:text-zinc-400">
            No stories found
          </div>
        ) : (
          stories.map((story) => (
            <motion.div
              key={story.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <StoryCard story={story} />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

