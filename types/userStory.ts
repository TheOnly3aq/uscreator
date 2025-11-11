export interface UserStoryData {
  type: "story" | "bug";
  role: string;
  action: string;
  benefit: string;
  background?: string;
  additionalInfo?: string;
  acceptanceCriteria: string[];
  technicalInfo: string[];
}
