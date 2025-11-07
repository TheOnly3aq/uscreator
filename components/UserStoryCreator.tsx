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

/**
 * Main user story creator component
 */
export function UserStoryCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStoryData, setUserStoryData] = useState<UserStoryData>({
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

  useEffect(() => {
    const initializeSession = async () => {
      try {
        const existingSessionId = getSessionId();
        if (!existingSessionId) {
          const response = await fetch("/api/session");
          const { sessionId } = await response.json();
          if (sessionId) {
            setSessionId(sessionId);
          }
        }

        const latestResponse = await fetch("/api/user-stories/latest");
        const { data } = await latestResponse.json();
        if (data) {
          setUserStoryData(data);
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
      await fetch("/api/user-stories/save", {
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
    if (!isAuthenticated || !hasInitializedRef.current) {
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
    setUserStoryData(data);
  }, []);

  const handleClear = useCallback(async () => {
    try {
      await fetch("/api/user-stories/delete-all", {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error clearing user stories:", error);
    }

    setUserStoryData({
      role: "",
      action: "",
      benefit: "",
      background: "",
      acceptanceCriteria: [""],
      technicalInfo: [""],
    });

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
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
            <UserStoryForm data={userStoryData} onChange={handleDataChange} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <UserStoryPreview data={userStoryData} onClear={handleClear} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}
