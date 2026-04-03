export interface UserStoryData {
  type: "story" | "bug";
  storyId?: string;
  title?: string;
  role: string;
  action: string;
  benefit: string;
  background?: string;
  additionalInfo?: string;
  acceptanceCriteria: string[];
  technicalInfo: string[];
  isAiGenerated?: boolean;
}
