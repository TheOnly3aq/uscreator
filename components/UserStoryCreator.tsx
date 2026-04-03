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
import {
  hasUserStoryContent,
  createEmptyUserStoryData,
  generateStoryId,
} from "@/utils/userStoryHelpers";
import { PasswordGate } from "./UserStoryCreator/__internal/PasswordGate";
import { UserStoryForm } from "./UserStoryCreator/__internal/UserStoryForm";
import { UserStoryPreview } from "./UserStoryCreator/__internal/UserStoryPreview";
import {
  History,
  type HistoryItem,
} from "./UserStoryCreator/__internal/History";
import { AICreation } from "./UserStoryCreator/__internal/AICreation";

/**
 * Main user story creator component that manages authentication, form state, and user story creation
 * @returns {JSX.Element} The user story creator component or password gate if not authenticated
 */
export function UserStoryCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<"form" | "history" | "ai">("form");
  const [currentType, setCurrentType] = useState<"story" | "bug">("story");
  const [storyData, setStoryData] = useState<UserStoryData>({
    type: "story",
    role: "",
    action: "",
    benefit: "",
    background: "",
    additionalInfo: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  });
  const [bugData, setBugData] = useState<UserStoryData>({
    type: "bug",
    role: "",
    action: "",
    benefit: "",
    background: "",
    additionalInfo: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isBootstrapping, setIsBootstrapping] = useState(false);
  const [historyItems, setHistoryItems] = useState<HistoryItem[]>([]);
  const [aiPrompt, setAiPrompt] = useState("");
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasInitializedRef = useRef(false);
  const isTypeChangingRef = useRef(false);

  const userStoryData = currentType === "story" ? storyData : bugData;

  useEffect(() => {
    if (getCookie() !== "authenticated") {
      return;
    }
    startTransition(() => {
      setIsAuthenticated(true);
      setIsBootstrapping(true);
      const savedTab = localStorage.getItem("userstory_active_tab");
      if (
        savedTab &&
        (savedTab === "form" || savedTab === "history" || savedTab === "ai")
      ) {
        setActiveTab(savedTab as "form" | "history" | "ai");
      }
    });
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }
    if (hasInitializedRef.current) {
      return;
    }

    const initializeSession = async () => {
      setIsBootstrapping(true);
      try {
        const existingSessionId = getSessionId();
        if (!existingSessionId) {
          const response = await fetch("/api/session/");
          const { sessionId } = await response.json();
          if (sessionId) {
            setSessionId(sessionId);
          }
        }

        const savedType = localStorage.getItem("userstory_selected_type");
        const initialType =
          savedType === "bug" || savedType === "story" ? savedType : "story";
        setCurrentType(initialType);

        const [
          storyResponse,
          bugResponse,
          promptResponse,
          historyResponse,
        ] = await Promise.all([
          fetch("/api/user-stories/latest/?type=story"),
          fetch("/api/user-stories/latest/?type=bug"),
          fetch("/api/user-stories/ai-prompt"),
          fetch("/api/user-stories/history/"),
        ]);

        const [storyResult, bugResult, promptResult, historyResult] =
          await Promise.all([
            storyResponse.json(),
            bugResponse.json(),
            promptResponse.json(),
            historyResponse.json(),
          ]);

        if (storyResult.data) {
          setStoryData({ ...storyResult.data, storyId: storyResult.data.storyId || generateStoryId() });
        } else {
          setStoryData(createEmptyUserStoryData("story"));
        }

        if (bugResult.data) {
          setBugData({ ...bugResult.data, storyId: bugResult.data.storyId || generateStoryId() });
        } else {
          setBugData(createEmptyUserStoryData("bug"));
        }

        if (typeof promptResult?.prompt === "string") {
          setAiPrompt(promptResult.prompt);
        }

        if (historyResult.error) {
          console.error("History bootstrap:", historyResult.error);
          setHistoryItems([]);
        } else {
          setHistoryItems(historyResult.history ?? []);
        }

        hasInitializedRef.current = true;
      } catch (error) {
        console.error("Error initializing session:", error);
        hasInitializedRef.current = true;
      } finally {
        setIsBootstrapping(false);
      }
    };

    void initializeSession();
  }, [isAuthenticated]);

  const saveUserStory = useCallback(async (data: UserStoryData) => {
    if (!hasUserStoryContent(data)) {
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
    if (
      !isAuthenticated ||
      !hasInitializedRef.current ||
      isTypeChangingRef.current
    ) {
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
    const currentData = data.type === "story" ? storyData : bugData;
    const dataWithId = {
      ...data,
      storyId: data.storyId || currentData.storyId || generateStoryId(),
    };
    if (data.type === "story") {
      setStoryData(dataWithId);
    } else {
      setBugData(dataWithId);
    }
  }, [storyData, bugData]);

  const handleTypeChange = useCallback(
    async (newType: "story" | "bug") => {
      if (newType === currentType) {
        return;
      }

      isTypeChangingRef.current = true;

      const currentData = currentType === "story" ? storyData : bugData;

      if (hasUserStoryContent(currentData)) {
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

      setCurrentType(newType);
      localStorage.setItem("userstory_selected_type", newType);

      try {
        const response = await fetch(
          `/api/user-stories/latest/?type=${newType}`
        );
        const { data } = await response.json();
        if (data) {
          if (newType === "story") {
            setStoryData({ ...data, storyId: data.storyId || generateStoryId() });
          } else {
            setBugData({ ...data, storyId: data.storyId || generateStoryId() });
          }
        } else {
          const emptyData = createEmptyUserStoryData(newType);
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
    },
    [currentType, storyData, bugData]
  );

  const handleClear = useCallback(async () => {
    try {
      await fetch("/api/user-stories/delete-all/", {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error clearing user stories:", error);
    }

    const emptyData = createEmptyUserStoryData(currentType);

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
    if (!hasUserStoryContent(userStoryData)) {
      return;
    }

    const dataToSave = {
      ...userStoryData,
      storyId: userStoryData.storyId || generateStoryId(),
    };

    try {
      const saveResponse = await fetch("/api/user-stories/save-history/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataToSave),
      });
      if (!saveResponse.ok) {
        return;
      }
      const historyResponse = await fetch("/api/user-stories/history/");
      const historyJson = await historyResponse.json();
      if (historyJson.error) {
        console.error("Error refreshing history:", historyJson.error);
        return;
      }
      setHistoryItems(historyJson.history ?? []);
    } catch (error) {
      console.error("Error saving to history:", error);
    }
  }, [userStoryData]);

  const handleLoadStory = useCallback((data: UserStoryData) => {
    const storyWithId = { ...data, storyId: data.storyId || generateStoryId() };
    if (data.type === "story") {
      setStoryData(storyWithId);
    } else {
      setBugData(storyWithId);
    }
    setCurrentType(data.type);
    localStorage.setItem("userstory_selected_type", data.type);
    setActiveTab("form");
    localStorage.setItem("userstory_active_tab", "form");
  }, []);

  const handleAIGenerate = useCallback((data: UserStoryData) => {
    const storyWithId = { ...data, storyId: data.storyId || generateStoryId() };
    if (data.type === "story") {
      setStoryData(storyWithId);
    } else {
      setBugData(storyWithId);
    }
    setCurrentType(data.type);
    localStorage.setItem("userstory_selected_type", data.type);
    setActiveTab("form");
    localStorage.setItem("userstory_active_tab", "form");
  }, []);

  if (!isAuthenticated) {
    return (
      <PasswordGate
        onAuthenticated={() => {
          setIsAuthenticated(true);
          setIsBootstrapping(true);
        }}
      />
    );
  }

  if (isBootstrapping) {
    return (
      <div className="bg-zinc-50 dark:bg-zinc-950 py-12 px-4 min-h-[50vh] flex items-center justify-center">
        <p className="text-zinc-600 dark:text-zinc-400" role="status">
          Loading your saved work…
        </p>
      </div>
    );
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
              setActiveTab("ai");
              localStorage.setItem("userstory_active_tab", "ai");
            }}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === "ai"
                ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400"
                : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            }`}
          >
            AI Creation
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
        ) : activeTab === "ai" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <AICreation
              prompt={aiPrompt}
              onPromptChange={setAiPrompt}
              onGenerate={handleAIGenerate}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <History
              onLoadStory={handleLoadStory}
              items={historyItems}
              onItemsChange={setHistoryItems}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
