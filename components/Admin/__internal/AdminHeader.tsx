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
export const AdminHeader = ({
  isRefreshing,
  onRefresh,
  onLogout,
}: AdminHeaderProps) => {
  return (
    <div className="border-b border-white/[0.08] bg-black/50 px-6 py-5 backdrop-blur-2xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-[28px] font-semibold tracking-tight text-[#f5f5f7]">
          Dashboard
        </h1>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="uscreator-btn-primary uscreator-btn-compact disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRefreshing ? "Refreshing…" : "Refresh"}
          </button>
          <button
            type="button"
            onClick={onLogout}
            className="uscreator-btn-secondary uscreator-btn-compact"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};
