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
      <div className="bg-white dark:bg-zinc-900 rounded-lg shadow border border-zinc-200 dark:border-zinc-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-100 dark:bg-zinc-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Session ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Total Stories
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Saved
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Drafts
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  User Agent
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  IP Addresses
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  First Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Last Activity
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {sessionStats.map((stat) => (
                <tr
                  key={stat.sessionId}
                  className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
                >
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100 font-mono">
                    {stat.sessionId.substring(0, 16)}...
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                    {stat.totalStories}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                    {stat.savedStories}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-900 dark:text-zinc-100">
                    {stat.drafts}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {stat.userAgent ? (
                      <span
                        className="truncate block max-w-xs"
                        title={stat.userAgent}
                      >
                        {stat.userAgent}
                      </span>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {stat.ipAddresses.length > 0 ? (
                      <div className="space-y-1">
                        {stat.ipAddresses.map((ip, idx) => (
                          <div key={idx} className="font-mono text-xs">
                            {ip}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-zinc-400 dark:text-zinc-500">
                        N/A
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(stat.firstActivity)}
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-600 dark:text-zinc-400">
                    {formatDate(stat.lastActivity)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onViewStories(stat.sessionId)}
                        className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        View Stories
                      </button>
                      <button
                        onClick={() => handleDelete(stat.sessionId)}
                        disabled={deletingSessionId === stat.sessionId}
                        className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deletingSessionId === stat.sessionId
                          ? "Deleting..."
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

