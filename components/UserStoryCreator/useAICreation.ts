"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { UserStoryData } from "@/types/userStory";
import { generateStoryId } from "@/utils/userStoryHelpers";

const isPromptTooThin = (promptText: string): boolean => {
  const words = promptText
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  return words.length < 10;
};

export const useAICreation = (
  prompt: string,
  onPromptChange: (value: string) => void,
  onGenerate: (data: UserStoryData) => void
) => {
  const [type, setType] = useState<"story" | "bug">("story");
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showThinPromptModal, setShowThinPromptModal] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleGenerate = useCallback(
    async (bypassValidation = false) => {
      if (!prompt.trim()) {
        setError("Please enter a prompt");
        return;
      }

      if (!bypassValidation && isPromptTooThin(prompt)) {
        setShowThinPromptModal(true);
        return;
      }

      setShowThinPromptModal(false);

      setIsGenerating(true);
      setError(null);

      try {
        const response = await fetch("/api/user-stories/ai-generate/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt: prompt.trim(), type }),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to generate user story");
        }

        if (result.data) {
          onGenerate({
            ...result.data,
            isAiGenerated: true,
            storyId: result.data.storyId || generateStoryId(),
          });
        } else {
          throw new Error("No data received from AI");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setIsGenerating(false);
      }
    },
    [prompt, type, onGenerate]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      void handleGenerate();
    }
  };

  const handleBypass = () => {
    void handleGenerate(true);
  };

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        await fetch("/api/user-stories/ai-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        });
      } catch (err) {
        console.error("Failed to save prompt:", err);
      }
    }, 500);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [prompt]);

  const handleClearPrompt = async () => {
    setIsClearing(true);
    try {
      const response = await fetch("/api/user-stories/ai-prompt", {
        method: "DELETE",
      });

      if (response.ok) {
        onPromptChange("");
      } else {
        throw new Error("Failed to clear prompt");
      }
    } catch (err) {
      console.error("Failed to clear prompt:", err);
      setError("Failed to clear prompt");
    } finally {
      setIsClearing(false);
    }
  };

  useEffect(() => {
    if (!showThinPromptModal) {
      return;
    }

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowThinPromptModal(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    setTimeout(() => modalRef.current?.focus(), 100);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showThinPromptModal]);

  return {
    type,
    setType,
    isGenerating,
    error,
    showThinPromptModal,
    setShowThinPromptModal,
    isClearing,
    modalRef,
    handleGenerate,
    handleKeyDown,
    handleBypass,
    handleClearPrompt,
  };
};
