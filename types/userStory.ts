/**
 * User story data structure
 */
export interface UserStoryData {
  // role in the "As a [role]" part
  role: string;
  // action in the "I want [action]" part
  action: string;
  // benefit in the "So that [benefit]" part
  benefit: string;
  // optional background/context
  background?: string;
  // optional acceptance criteria (array of strings)
  acceptanceCriteria: string[];
  // optional technical information (array of strings)
  technicalInfo: string[];
}

