import { useState } from "react";
import { SessionStat } from "@/types/admin";

interface SessionsTabProps {
  sessionStats: SessionStat[];
  onViewStories: (sessionId: string) => void;
  onDeleteSession: (sessionId: string) => Promise<void>;
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleString();
}

/**
 * Sessions tab component displaying session statistics table
 * @param {SessionsTabProps} props - Component props
 * @param {SessionStat[]} props.sessionStats - Array of session statistics
 * @param {(sessionId: string) => void} props.onViewStories - Callback function to view stories for a session
 * @param {(sessionId: string) => Promise<void>} props.onDeleteSession - Callback function to delete a session
 */
export function SessionsTab({
  sessionStats,
  onViewStories,
  onDeleteSession,
}: SessionsTabProps) {
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(
    null
  );

  const handleDelete = async (sessionId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this session? This will also delete all associated stories."
      )
    ) {
      return;
    }

    setDeletingSessionId(sessionId);
    try {
      await onDeleteSession(sessionId);
    } catch (error) {
      console.error("Error deleting session:", error);
      alert("Failed to delete session");
    } finally {
      setDeletingSessionId(null);
    }
  };
  return (
    <div className="space-y-4">
      <div className="uscreator-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-white/[0.04]">
              <tr>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Session ID
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Total Stories
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Saved
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Drafts
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  User Agent
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  IP Addresses
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  First Activity
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Last Activity
                </th>
                <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-[#6e6e73]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.06]">
              {sessionStats.map((stat) => (
                <tr
                  key={stat.sessionId}
                  className="transition-colors hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-3 font-mono text-[13px] text-[#f5f5f7]">
                    {stat.sessionId.substring(0, 16)}...
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#f5f5f7]">
                    {stat.totalStories}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#f5f5f7]">
                    {stat.savedStories}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#f5f5f7]">
                    {stat.drafts}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a1a1a6]">
                    {stat.userAgent ? (
                      <span
                        className="truncate block max-w-xs"
                        title={stat.userAgent}
                      >
                        {stat.userAgent}
                      </span>
                    ) : (
                      <span className="text-[#6e6e73]">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a1a1a6]">
                    {stat.ipAddresses.length > 0 ? (
                      <div className="space-y-1">
                        {stat.ipAddresses.map((ip, idx) => (
                          <div key={idx} className="font-mono text-xs">
                            {ip}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-[#6e6e73]">N/A</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a1a1a6]">
                    {formatDate(stat.firstActivity)}
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[#a1a1a6]">
                    {formatDate(stat.lastActivity)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onViewStories(stat.sessionId)}
                        className="uscreator-link text-[13px] font-semibold no-underline hover:underline"
                      >
                        View stories
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(stat.sessionId)}
                        disabled={deletingSessionId === stat.sessionId}
                        className="text-[13px] font-semibold text-[#ff6961] transition-colors hover:text-[#ff9a93] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {deletingSessionId === stat.sessionId
                          ? "Deleting…"
                          : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
