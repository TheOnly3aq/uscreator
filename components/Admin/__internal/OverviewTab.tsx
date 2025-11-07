import { OverallStats } from "@/types/admin";
import { StatCard } from "./StatCard";

interface OverviewTabProps {
  stats: OverallStats;
}

function formatDate(dateString: string | null) {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
}

/**
 * Overview tab component displaying statistics and activity timeline
 * @param {OverviewTabProps} props - Component props
 * @param {OverallStats} props.stats - Overall statistics data
 */
export function OverviewTab({ stats }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Stories" value={stats.totalStories} />
        <StatCard title="Unique Sessions" value={stats.uniqueSessions} />
        <StatCard title="Saved Stories" value={stats.totalSaved} />
        <StatCard title="Drafts" value={stats.totalDrafts} />
      </div>

      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
        <h2 className="text-lg font-semibold mb-4 text-zinc-900 dark:text-zinc-100">
          Activity Timeline
        </h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">
              First Story:
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formatDate(stats.firstStoryDate)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-zinc-600 dark:text-zinc-400">
              Last Activity:
            </span>
            <span className="text-zinc-900 dark:text-zinc-100">
              {formatDate(stats.lastActivityDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
