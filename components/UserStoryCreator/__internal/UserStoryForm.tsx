"use client";

import { UserStoryData } from "@/types/userStory";
import { RichTextEditor } from "./RichTextEditor";

interface UserStoryFormProps {
  data: UserStoryData;
  onChange: (data: UserStoryData) => void;
}

/**
 * Form component for user story input fields
 */
export function UserStoryForm({ data, onChange }: UserStoryFormProps) {
  const handleChange = (
    field: keyof UserStoryData,
    value: string | string[]
  ) => {
    onChange({ ...data, [field]: value });
  };

  const handleAcceptanceCriteriaChange = (index: number, value: string) => {
    const newCriteria = [...data.acceptanceCriteria];
    newCriteria[index] = value;
    handleChange("acceptanceCriteria", newCriteria);
  };

  const addAcceptanceCriterion = () => {
    handleChange("acceptanceCriteria", [...data.acceptanceCriteria, ""]);
  };

  const removeAcceptanceCriterion = (index: number) => {
    const newCriteria = data.acceptanceCriteria.filter((_, i) => i !== index);
    handleChange("acceptanceCriteria", newCriteria);
  };

  const handleTechnicalInfoChange = (index: number, value: string) => {
    const newTechnicalInfo = [...data.technicalInfo];
    newTechnicalInfo[index] = value;
    handleChange("technicalInfo", newTechnicalInfo);
  };

  const addTechnicalInfo = () => {
    handleChange("technicalInfo", [...data.technicalInfo, ""]);
  };

  const removeTechnicalInfo = (index: number) => {
    const newTechnicalInfo = data.technicalInfo.filter((_, i) => i !== index);
    handleChange("technicalInfo", newTechnicalInfo);
  };

  return (
    <div className="space-y-6">
      <div>
        <label
          htmlFor="role"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          As a <span className="text-zinc-500 dark:text-zinc-400">(role)</span>
        </label>
        <input
          id="role"
          type="text"
          value={data.role}
          onChange={(e) => handleChange("role", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="e.g., user, admin, developer"
        />
      </div>

      <div>
        <label
          htmlFor="action"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          I want{" "}
          <span className="text-zinc-500 dark:text-zinc-400">(action)</span>
        </label>
        <input
          id="action"
          type="text"
          value={data.action}
          onChange={(e) => handleChange("action", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="e.g., to save my preferences"
        />
      </div>

      <div>
        <label
          htmlFor="benefit"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          So that{" "}
          <span className="text-zinc-500 dark:text-zinc-400">(benefit)</span>
        </label>
        <input
          id="benefit"
          type="text"
          value={data.benefit}
          onChange={(e) => handleChange("benefit", e.target.value)}
          className="w-full px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
          placeholder="e.g., I can have a personalized experience"
        />
      </div>

      <div>
        <label
          htmlFor="background"
          className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300"
        >
          Background/Context{" "}
          <span className="text-zinc-500 dark:text-zinc-400">(optional)</span>
        </label>
        <RichTextEditor
          value={data.background || ""}
          onChange={(value) => handleChange("background", value)}
          placeholder="Additional context or background information"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
          Acceptance Criteria{" "}
          <span className="text-zinc-500 dark:text-zinc-400">(optional)</span>
        </label>
        <div className="space-y-2">
          {data.acceptanceCriteria.map((criterion, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={criterion}
                onChange={(e) =>
                  handleAcceptanceCriteriaChange(index, e.target.value)
                }
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder={`Criterion ${index + 1}`}
              />
              {data.acceptanceCriteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeAcceptanceCriterion(index)}
                  className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addAcceptanceCriterion}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors text-sm"
          >
            + Add Criterion
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 text-zinc-700 dark:text-zinc-300">
          Technical Information{" "}
          <span className="text-zinc-500 dark:text-zinc-400">(optional)</span>
        </label>
        <div className="space-y-2">
          {data.technicalInfo.map((info, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={info}
                onChange={(e) => handleTechnicalInfoChange(index, e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                placeholder={`Technical info ${index + 1}`}
              />
              {data.technicalInfo.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeTechnicalInfo(index)}
                  className="px-3 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={addTechnicalInfo}
            className="px-4 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-900 dark:text-zinc-100 transition-colors text-sm"
          >
            + Add Technical Info
          </button>
        </div>
      </div>
    </div>
  );
}

