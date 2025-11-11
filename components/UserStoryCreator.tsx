"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { motion } from "framer-motion";
import { UserStoryData } from "@/types/userStory";
import { getCookie, setSessionId, getSessionId } from "@/utils/cookies";
import { PasswordGate } from "./UserStoryCreator/__internal/PasswordGate";
import { UserStoryForm } from "./UserStoryCreator/__internal/UserStoryForm";
import { UserStoryPreview } from "./UserStoryCreator/__internal/UserStoryPreview";
import { History } from "./UserStoryCreator/__internal/History";

/**
 * Main user story creator component that manages authentication, form state, and user story creation
 * @returns {JSX.Element} The user story creator component or password gate if not authenticated
 */
export function UserStoryCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history">("form");
  const [currentType, setCurrentType] = useState<"story" | "bug">("story");
  const [storyData, setStoryData] = useState<UserStoryData>({
    type: "story",
    role: "",
    action: "",
    benefit: "",
    background: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  });
  const [bugData, setBugData] = useState<UserStoryData>({
    type: "bug",
    role: "",
    action: "",
    benefit: "",
    background: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  });
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const isTypeChangingRef = useRef(false);

  const userStoryData = currentType === "story" ? storyData : bugData;

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const existingSessionId = getSessionId();
        if (!existingSessionId) {
          const response = await fetch("/api/session/");
          const { sessionId } = await response.json();
          if (sessionId) {
            setSessionId(sessionId);
          }
        }

        // Load saved type preference
        const savedType = localStorage.getItem("userstory_selected_type");
        const initialType = (savedType === "bug" || savedType === "story") ? savedType : "story";
        setCurrentType(initialType);

        // Load drafts for both types
        const [storyResponse, bugResponse] = await Promise.all([
          fetch("/api/user-stories/latest/?type=story"),
          fetch("/api/user-stories/latest/?type=bug"),
        ]);

        const storyResult = await storyResponse.json();
        const bugResult = await bugResponse.json();

        if (storyResult.data) {
          setStoryData(storyResult.data);
        } else {
          setStoryData({
            type: "story",
            role: "",
            action: "",
            benefit: "",
            background: "",
            acceptanceCriteria: [""],
            technicalInfo: [""],
          });
        }

        if (bugResult.data) {
          setBugData(bugResult.data);
        } else {
          setBugData({
            type: "bug",
            role: "",
            action: "",
            benefit: "",
            background: "",
            acceptanceCriteria: [""],
            technicalInfo: [""],
          });
        }

        hasInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing session:", error);
        hasInitializedRef.current = true;
      }
    };

    const cookie = getCookie();
    if (cookie === "authenticated") {
      startTransition(() => {
        setIsAuthenticated(true);
        const savedTab = localStorage.getItem("userstory_active_tab");
        if (savedTab && (savedTab === "form" || savedTab === "history")) {
          setActiveTab(savedTab as "form" | "history");
        }
      });
      if (!hasInitializedRef.current) {
        initializeSession();
      }
    }
  }, []);

  const saveUserStory = useCallback(async (data: UserStoryData) => {
    const hasContent =
      data.role.trim() ||
      data.action.trim() ||
      data.benefit.trim() ||
      data.background?.trim() ||
      data.acceptanceCriteria.some((c) => c.trim()) ||
      data.technicalInfo.some((t) => t.trim());

    if (!hasContent) {
      return;
    }

    setIsSaving(true);
    try {
      await fetch("/api/user-stories/save/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error("Error saving user story:", error);
    } finally {
      setIsSaving(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !hasInitializedRef.current || isTypeChangingRef.current) {
      return;
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveUserStory(userStoryData);
    }, 2000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [userStoryData, isAuthenticated, saveUserStory]);

  const handleDataChange = useCallback((data: UserStoryData) => {
    if (data.type === "story") {
      setStoryData(data);
    } else {
      setBugData(data);
    }
  }, []);

  const handleTypeChange = useCallback(async (newType: "story" | "bug") => {
    if (newType === currentType) {
      return;
    }

    isTypeChangingRef.current = true;

    // Save current draft before switching
    const currentData = currentType === "story" ? storyData : bugData;
    const hasContent =
      currentData.role.trim() ||
      currentData.action.trim() ||
      currentData.benefit.trim() ||
      currentData.background?.trim() ||
      currentData.acceptanceCriteria.some((c) => c.trim()) ||
      currentData.technicalInfo.some((t) => t.trim());

    if (hasContent) {
      try {
        await fetch("/api/user-stories/save/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentData),
        });
      } catch (error) {
        console.error("Error saving draft before type change:", error);
      }
    }

    // Switch type and load the draft for the new type
    setCurrentType(newType);
    localStorage.setItem("userstory_selected_type", newType);

    // Load draft for new type
    try {
      const response = await fetch(`/api/user-stories/latest/?type=${newType}`);
      const { data } = await response.json();
      if (data) {
        if (newType === "story") {
          setStoryData(data);
        } else {
          setBugData(data);
        }
      } else {
        // Initialize empty data for new type if no draft exists
        const emptyData: UserStoryData = {
          type: newType,
          role: "",
          action: "",
          benefit: "",
          background: "",
          acceptanceCriteria: [""],
          technicalInfo: [""],
        };
        if (newType === "story") {
          setStoryData(emptyData);
        } else {
          setBugData(emptyData);
        }
      }
    } catch (error) {
      console.error("Error loading draft for new type:", error);
    }

    isTypeChangingRef.current = false;
  }, [currentType, storyData, bugData]);

  const handleClear = useCallback(async () => {
    try {
      await fetch("/api/user-stories/delete-all/", {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error clearing user stories:", error);
    }

    const emptyData: UserStoryData = {
      type: currentType,
      role: "",
      action: "",
      benefit: "",
      background: "",
      acceptanceCriteria: [""],
      technicalInfo: [""],
    };

    if (currentType === "story") {
      setStoryData(emptyData);
    } else {
      setBugData(emptyData);
    }

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  }, [currentType]);

  const handleSaveToHistory = useCallback(async () => {
    const hasContent =
      userStoryData.role.trim() ||
      userStoryData.action.trim() ||
      userStoryData.benefit.trim() ||
      userStoryData.background?.trim() ||
      userStoryData.acceptanceCriteria.some((c) => c.trim()) ||
      userStoryData.technicalInfo.some((t) => t.trim());

    if (!hasContent) {
      return;
    }

    try {
      await fetch("/api/user-stories/save-history/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userStoryData),
      });
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  }, [userStoryData]);

  const handleLoadStory = useCallback((data: UserStoryData) => {
    if (data.type === "story") {
      setStoryData(data);
    } else {
      setBugData(data);
    }
    setCurrentType(data.type);
    localStorage.setItem("userstory_selected_type", data.type);
    setActiveTab("form");
    localStorage.setItem("userstory_active_tab", "form");
  }, []);

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
              User Story Creator
            </h1>
            {isSaving && (
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                Saving...
              </span>
            )}
          </div>
          <p className="text-zinc-600 dark:text-zinc-400">
            Fill out the form below to create a user story
          </p>
        </motion.div>

        <div className="mb-6 flex gap-2 border-b border-zinc-200 dark:border-zinc-800">
          <button
            type="button"
            onClick={() => {
              setActiveTab("form");
              localStorage.setItem("userstory_active_tab", "form");
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "form"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            Form
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("history");
              localStorage.setItem("userstory_active_tab", "history");
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "history"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            History
          </button>
        </div>

        {activeTab === "form" ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
                Form
              </h2>
              <UserStoryForm
                data={userStoryData}
                onChange={handleDataChange}
                onTypeChange={handleTypeChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
            >
              <UserStoryPreview
                data={userStoryData}
                onClear={handleClear}
                onSaveToHistory={handleSaveToHistory}
              />
            </motion.div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <History onLoadStory={handleLoadStory} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
