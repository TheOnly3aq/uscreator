interface AdminHeaderProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  onLogout: () => void;
}

/**
 * Admin dashboard header component with refresh and logout buttons
 * @param {AdminHeaderProps} props - Component props
 * @param {boolean} props.isRefreshing - Whether data is currently being refreshed
 * @param {() => void} props.onRefresh - Callback function to refresh data
 * @param {() => void} props.onLogout - Callback function to logout
 */
export function AdminHeader({
  isRefreshing,
  onRefresh,
  onLogout,
}: AdminHeaderProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 py-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">
          Admin Dashboard
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 disabled:bg-zinc-400 disabled:cursor-not-allowed text-white transition-colors text-sm font-medium"
          >
            {isRefreshing ? "Refreshing..." : "Refresh"}
          </button>
          <button
            onClick={onLogout}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors text-sm font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

