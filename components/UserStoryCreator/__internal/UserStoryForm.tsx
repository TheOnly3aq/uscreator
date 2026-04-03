"use client";

import { UserStoryFormProps } from "@/types/userStoryComponents";
import { UserStoryData } from "@/types/userStory";
import { RichTextEditor } from "./RichTextEditor";
import { StoryTypeSelect } from "./StoryTypeSelect";
import { UserStoryFormStoryFields } from "./UserStoryFormStoryFields";
import { UserStoryFormBugFields } from "./UserStoryFormBugFields";
import { UserStoryExtraLists } from "./UserStoryExtraLists";

/**
 * Form for editing user stories and bug reports (shared type selector and lists).
 */
export function UserStoryForm({ data, onChange, onTypeChange }: UserStoryFormProps) {
  const handleFieldChange = (
    field: keyof UserStoryData,
    value: string | string[]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const handleAcceptanceCriteriaChange = (index: number, value: string) => {
    const next = [...data.acceptanceCriteria];
    next[index] = value;
    handleFieldChange("acceptanceCriteria", next);
  };

  const addAcceptanceCriterion = () => {
    handleFieldChange("acceptanceCriteria", [...data.acceptanceCriteria, ""]);
  };

  const removeAcceptanceCriterion = (index: number) => {
    handleFieldChange(
      "acceptanceCriteria",
      data.acceptanceCriteria.filter((_, i) => i !== index)
    );
  };

  const handleTechnicalInfoChange = (index: number, value: string) => {
    const next = [...data.technicalInfo];
    next[index] = value;
    handleFieldChange("technicalInfo", next);
  };

  const addTechnicalInfo = () => {
    handleFieldChange("technicalInfo", [...data.technicalInfo, ""]);
  };

  const removeTechnicalInfo = (index: number) => {
    handleFieldChange(
      "technicalInfo",
      data.technicalInfo.filter((_, i) => i !== index)
    );
  };

  const handleTypeSelect = async (newType: "story" | "bug") => {
    if (onTypeChange) {
      await onTypeChange(newType);
    } else {
      handleFieldChange("type", newType);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          id="userstory-type-label"
          htmlFor="type"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Type
        </label>
        <StoryTypeSelect
          id="type"
          listboxLabelledBy="userstory-type-label"
          value={data.type}
          onChange={handleTypeSelect}
        />
      </div>

      <div>
        <label
          htmlFor="title"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Title <span className="text-[#6e6e73]">(optional)</span>
        </label>
        <input
          id="title"
          type="text"
          value={data.title || ""}
          onChange={(e) => handleFieldChange("title", e.target.value)}
          className="apple-field"
          placeholder="e.g., User Preference Saving Feature"
        />
      </div>

      {data.type === "bug" ? (
        <UserStoryFormBugFields data={data} onFieldChange={handleFieldChange} />
      ) : (
        <UserStoryFormStoryFields data={data} onFieldChange={handleFieldChange} />
      )}

      <div>
        <label
          htmlFor="additionalInfo"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Additional Information{" "}
          <span className="text-[#6e6e73]">(optional)</span>
        </label>
        <RichTextEditor
          value={data.additionalInfo || ""}
          onChange={(value) => handleFieldChange("additionalInfo", value)}
          placeholder="Any additional information or notes"
        />
      </div>

      <UserStoryExtraLists
        data={data}
        onAcceptanceChange={handleAcceptanceCriteriaChange}
        onAddAcceptance={addAcceptanceCriterion}
        onRemoveAcceptance={removeAcceptanceCriterion}
        onTechnicalChange={handleTechnicalInfoChange}
        onAddTechnical={addTechnicalInfo}
        onRemoveTechnical={removeTechnicalInfo}
      />
    </div>
  );
}
