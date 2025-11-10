export interface AdminUserStory {
  id: number;
  sessionId: string;
  role: string | null;
  action: string | null;
  benefit: string | null;
  background: string | null;
  acceptanceCriteria: string[];
  technicalInfo: string[];
  isDraft: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SessionStat {
  sessionId: string;
  totalStories: number;
  drafts: number;
  savedStories: number;
  firstActivity: string;
  lastActivity: string;
  userAgent: string | null;
  ipAddresses: string[];
  firstSeen: string | null;
  lastSeen: string | null;
}

export interface OverallStats {
  totalStories: number;
  uniqueSessions: number;
  totalDrafts: number;
  totalSaved: number;
  firstStoryDate: string | null;
  lastActivityDate: string | null;
}

export interface AdminData {
  stories: AdminUserStory[];
  sessionStats: SessionStat[];
  overallStats: OverallStats;
}

export type AdminTab = "overview" | "sessions" | "stories";

