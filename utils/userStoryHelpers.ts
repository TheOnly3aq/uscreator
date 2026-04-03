import { UserStoryData } from "@/types/userStory";

export const generateStoryId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

export const hasUserStoryContent = (data: UserStoryData): boolean => {
  return (
    !!data.title?.trim() ||
    !!data.role.trim() ||
    !!data.action.trim() ||
    !!data.benefit.trim() ||
    !!data.background?.trim() ||
    !!data.additionalInfo?.trim() ||
    data.acceptanceCriteria.some((c) => c.trim()) ||
    data.technicalInfo.some((t) => t.trim())
  );
};

export const createEmptyUserStoryData = (
  type: "story" | "bug"
): UserStoryData => {
  return {
    type,
    storyId: generateStoryId(),
    role: "",
    action: "",
    benefit: "",
    background: "",
    additionalInfo: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  };
};

