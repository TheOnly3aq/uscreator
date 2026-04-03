"use client";

import { UserStoryData } from "@/types/userStory";
import { RichTextEditor } from "./RichTextEditor";

type Props = {
  data: UserStoryData;
  onFieldChange: (field: keyof UserStoryData, value: string | string[]) => void;
};

export const UserStoryFormStoryFields = ({ data, onFieldChange }: Props) => {
  return (
    <>
      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          As a <span className="text-[#6e6e73]">(role)</span>
        </label>
        <input
          id="role"
          type="text"
          value={data.role}
          onChange={(e) => onFieldChange("role", e.target.value)}
          className="uscreator-field"
          placeholder="e.g., user, admin, developer"
        />
      </div>

      <div>
        <label
          htmlFor="action"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          I want <span className="text-[#6e6e73]">(action)</span>
        </label>
        <input
          id="action"
          type="text"
          value={data.action}
          onChange={(e) => onFieldChange("action", e.target.value)}
          className="uscreator-field"
          placeholder="e.g., to save my preferences"
        />
      </div>

      <div>
        <label
          htmlFor="benefit"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          So that <span className="text-[#6e6e73]">(benefit)</span>
        </label>
        <input
          id="benefit"
          type="text"
          value={data.benefit}
          onChange={(e) => onFieldChange("benefit", e.target.value)}
          className="uscreator-field"
          placeholder="e.g., I can have a personalized experience"
        />
      </div>

      <div>
        <label
          htmlFor="background"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Background/Context <span className="text-[#6e6e73]">(optional)</span>
        </label>
        <RichTextEditor
          value={data.background || ""}
          onChange={(value) => onFieldChange("background", value)}
          placeholder="Additional context or background information"
        />
      </div>
    </>
  );
};
