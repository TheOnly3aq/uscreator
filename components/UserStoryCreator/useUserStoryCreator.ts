"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
  startTransition,
} from "react";
import { UserStoryData } from "@/types/userStory";
import { setSessionId, getSessionId } from "@/utils/cookies";
import {
  hasUserStoryContent,
  createEmptyUserStoryData,
  generateStoryId,
} from "@/utils/userStoryHelpers";
import type { HistoryItem } from "./__internal/History";

export const useUserStoryCreator = () => {
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
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/");
        const data = (await res.json()) as { authenticated?: boolean };
        if (!data.authenticated) {
          return;
        }
        startTransition(() => {
          setIsAuthenticated(true);
          setIsBootstrapping(true);
          const savedTab = localStorage.getItem("userstory_active_tab");
          if (
            savedTab &&
            (savedTab === "form" ||
              savedTab === "history" ||
              savedTab === "ai")
          ) {
            setActiveTab(savedTab as "form" | "history" | "ai");
          }
        });
      } catch {
        /* stay logged out */
      }
    };
    void checkAuth();
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
          setStoryData({
            ...storyResult.data,
            storyId: storyResult.data.storyId || generateStoryId(),
          });
        } else {
          setStoryData(createEmptyUserStoryData("story"));
        }

        if (bugResult.data) {
          setBugData({
            ...bugResult.data,
            storyId: bugResult.data.storyId || generateStoryId(),
          });
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

  const handleDataChange = useCallback(
    (data: UserStoryData) => {
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
    },
    [storyData, bugData]
  );

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
            setStoryData({
              ...data,
              storyId: data.storyId || generateStoryId(),
            });
          } else {
            setBugData({
              ...data,
              storyId: data.storyId || generateStoryId(),
            });
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

  const completePasswordLogin = useCallback(() => {
    setIsAuthenticated(true);
    setIsBootstrapping(true);
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

  return {
    isAuthenticated,
    completePasswordLogin,
    isBootstrapping,
    isSaving,
    activeTab,
    setActiveTab,
    userStoryData,
    historyItems,
    setHistoryItems,
    aiPrompt,
    setAiPrompt,
    handleDataChange,
    handleTypeChange,
    handleClear,
    handleSaveToHistory,
    handleLoadStory,
    handleAIGenerate,
  };
};
