"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminLogin } from "@/components/Admin/__internal/AdminLogin";
import { AdminHeader } from "@/components/Admin/__internal/AdminHeader";
import { AdminTabs } from "@/components/Admin/__internal/AdminTabs";
import { OverviewTab } from "@/components/Admin/__internal/OverviewTab";
import { SessionsTab } from "@/components/Admin/__internal/SessionsTab";
import { StoriesTab } from "@/components/Admin/__internal/StoriesTab";
import { AdminData, AdminTab } from "@/types/admin";

/**
 * Admin dashboard page component
 * @returns {JSX.Element} The admin dashboard page
 */
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState<AdminData | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(
    null
  );

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/admin/auth/");
        const { authenticated } = await response.json();
        setIsAuthenticated(authenticated);
        if (authenticated) {
          const savedTab = localStorage.getItem("admin_active_tab");
          if (
            savedTab &&
            (savedTab === "overview" ||
              savedTab === "sessions" ||
              savedTab === "stories")
          ) {
            setActiveTab(savedTab as AdminTab);
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const response = await fetch("/api/admin/data/");
      if (response.ok) {
        const adminData = await response.json();
        setData(adminData);
      } else if (response.status === 401) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error fetching admin data:", error);
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, fetchData]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/auth/", { method: "DELETE" });
      setIsAuthenticated(false);
      setData(null);
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    setSelectedSessionId(null);
    localStorage.setItem("admin_active_tab", tab);
  };

  const handleViewStories = (sessionId: string) => {
    setSelectedSessionId(sessionId);
    setActiveTab("stories");
    localStorage.setItem("admin_active_tab", "stories");
  };

  const filteredStories = selectedSessionId
    ? data?.stories.filter((s) => s.sessionId === selectedSessionId) || []
    : data?.stories || [];

  if (isLoading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-zinc-600 dark:text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950 min-h-screen">
      <AdminHeader
        isRefreshing={isRefreshing}
        onRefresh={fetchData}
        onLogout={handleLogout}
      />
      <AdminTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex-1 p-6 overflow-auto">
        {activeTab === "overview" && data && (
          <OverviewTab stats={data.overallStats} />
        )}
        {activeTab === "sessions" && data && (
          <SessionsTab
            sessionStats={data.sessionStats}
            onViewStories={handleViewStories}
          />
        )}
        {activeTab === "stories" && (
          <StoriesTab
            stories={filteredStories}
            selectedSessionId={selectedSessionId}
            onClearFilter={() => setSelectedSessionId(null)}
          />
        )}
      </div>
    </div>
  );
}
