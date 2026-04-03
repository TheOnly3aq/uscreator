import { OverallStats } from "@/types/admin";
import { StatCard } from "./StatCard";

interface OverviewTabProps {
  stats: OverallStats;
}

const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleString();
};

/**
 * Overview tab component displaying statistics and activity timeline
 * @param {OverviewTabProps} props - Component props
 * @param {OverallStats} props.stats - Overall statistics data
 */
export const OverviewTab = ({ stats }: OverviewTabProps) => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Stories" value={stats.totalStories} />
        <StatCard title="Unique Sessions" value={stats.uniqueSessions} />
        <StatCard title="Saved Stories" value={stats.totalSaved} />
        <StatCard title="Drafts" value={stats.totalDrafts} />
      </div>

      <div className="uscreator-panel p-8">
        <h2 className="mb-6 text-[19px] font-semibold text-[#f5f5f7]">
          Activity
        </h2>
        <div className="space-y-4 text-[15px]">
          <div className="flex justify-between gap-4 border-b border-white/[0.06] pb-4">
            <span className="text-[#a1a1a6]">First story</span>
            <span className="text-right text-[#f5f5f7]">
              {formatDate(stats.firstStoryDate)}
            </span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-[#a1a1a6]">Last activity</span>
            <span className="text-right text-[#f5f5f7]">
              {formatDate(stats.lastActivityDate)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
