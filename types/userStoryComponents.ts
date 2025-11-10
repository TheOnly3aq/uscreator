import { UserStoryData } from "./userStory";

export interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export interface UserStoryFormProps {
  data: UserStoryData;
  onChange: (data: UserStoryData) => void;
}

export interface UserStoryPreviewProps {
  data: UserStoryData;
  onClear: () => void;
  onSaveToHistory: () => void;
}
