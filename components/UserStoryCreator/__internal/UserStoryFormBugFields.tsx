"use client";

import { UserStoryData } from "@/types/userStory";
import { RichTextEditor } from "./RichTextEditor";

type Props = {
  data: UserStoryData;
  onFieldChange: (field: keyof UserStoryData, value: string | string[]) => void;
};

export const UserStoryFormBugFields = ({ data, onFieldChange }: Props) => {
  return (
    <>
      <div>
        <label
          htmlFor="role"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Title/Description
        </label>
        <input
          id="role"
          type="text"
          value={data.role}
          onChange={(e) => onFieldChange("role", e.target.value)}
          className="uscreator-field"
          placeholder="e.g., Users should be able to select the 'disabled' filter without being redirected"
        />
      </div>

      <div>
        <label
          htmlFor="action"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Scenario <span className="text-[#6e6e73]">(steps)</span>
        </label>
        <RichTextEditor
          value={data.action || ""}
          onChange={(value) => onFieldChange("action", value)}
          placeholder="e.g., - Log in and navigate to 'Agents' section.\n- Select the 'disabled' filter button."
        />
      </div>

      <div>
        <label
          htmlFor="benefit"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Expected Result
        </label>
        <input
          id="benefit"
          type="text"
          value={data.benefit}
          onChange={(e) => onFieldChange("benefit", e.target.value)}
          className="uscreator-field"
          placeholder="e.g., The agents table should only show 'disabled' agents."
        />
      </div>

      <div>
        <label
          htmlFor="background"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Actual Result
        </label>
        <RichTextEditor
          value={data.background || ""}
          onChange={(value) => onFieldChange("background", value)}
          placeholder="e.g., The user is redirected to another page — this is an undefined 'Agent' page."
        />
      </div>
    </>
  );
};
