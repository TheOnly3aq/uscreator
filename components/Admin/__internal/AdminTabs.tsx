import { AdminTab } from "@/types/admin";

interface AdminTabsProps {
  activeTab: AdminTab;
  onTabChange: (tab: AdminTab) => void;
}

/**
 * Admin dashboard tab navigation component
 * @param {AdminTabsProps} props - Component props
 * @param {AdminTab} props.activeTab - Currently active tab
 * @param {(tab: AdminTab) => void} props.onTabChange - Callback function when tab changes
 */
export function AdminTabs({ activeTab, onTabChange }: AdminTabsProps) {
  const tabs: AdminTab[] = ["overview", "sessions", "stories"];

  return (
    <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6">
      <div className="flex gap-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 border-b-2 transition-colors font-medium ${
              activeTab === tab
                ? "border-blue-500 text-blue-600 dark:text-blue-400"
                : "border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
}

