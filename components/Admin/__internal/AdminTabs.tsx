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
export const AdminTabs = ({ activeTab, onTabChange }: AdminTabsProps) => {
  const tabs: AdminTab[] = ["overview", "sessions", "stories"];

  return (
    <div className="border-b border-white/[0.08] bg-black/30 px-6 py-3">
      <div className="apple-segment flex w-full max-w-xl">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => onTabChange(tab)}
            className={`apple-segment-btn flex-1 ${
              activeTab === tab ? "apple-segment-btn-active" : ""
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
    </div>
  );
};
