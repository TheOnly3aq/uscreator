import { UserStoryData } from "@/types/userStory";

/**
 * Checks if a user story has any content
 * @param data - The user story data to check
 * @returns {boolean} True if the user story has any content, false otherwise
 */
export const hasUserStoryContent = (data: UserStoryData): boolean => {
  return (
    !!data.role.trim() ||
    !!data.action.trim() ||
    !!data.benefit.trim() ||
    !!data.background?.trim() ||
    !!data.additionalInfo?.trim() ||
    data.acceptanceCriteria.some((c) => c.trim()) ||
    data.technicalInfo.some((t) => t.trim())
  );
};

/**
 * Creates an empty user story data object
 * @param type - The type of user story ("story" or "bug")
 * @returns {UserStoryData} An empty user story data object
 */
export const createEmptyUserStoryData = (
  type: "story" | "bug"
): UserStoryData => {
  return {
    type,
    role: "",
    action: "",
    benefit: "",
    background: "",
    additionalInfo: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  };
};

