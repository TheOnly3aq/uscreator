"use client";

import { UserStoryData } from "@/types/userStory";

type Props = {
  data: UserStoryData;
  onAcceptanceChange: (index: number, value: string) => void;
  onAddAcceptance: () => void;
  onRemoveAcceptance: (index: number) => void;
  onTechnicalChange: (index: number, value: string) => void;
  onAddTechnical: () => void;
  onRemoveTechnical: (index: number) => void;
};

export const UserStoryExtraLists = ({
  data,
  onAcceptanceChange,
  onAddAcceptance,
  onRemoveAcceptance,
  onTechnicalChange,
  onAddTechnical,
  onRemoveTechnical,
}: Props) => {
  return (
    <>
      <div>
        <label className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]">
          Acceptance Criteria{" "}
          <span className="text-[#6e6e73]">(optional)</span>
        </label>
        <div className="space-y-2">
          {data.acceptanceCriteria.map((criterion, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={criterion}
                onChange={(e) => onAcceptanceChange(index, e.target.value)}
                className="apple-field flex-1"
                placeholder={`Criterion ${index + 1}`}
              />
              {data.acceptanceCriteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveAcceptance(index)}
                  className="apple-btn-compact shrink-0 bg-[#ff453a]/90 px-4 text-white hover:bg-[#ff453a]"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAddAcceptance}
            className="apple-btn-secondary apple-btn-compact w-full sm:w-auto"
          >
            + Add Criterion
          </button>
        </div>
      </div>

      <div>
        <label className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]">
          Technical Information{" "}
          <span className="text-[#6e6e73]">(optional)</span>
        </label>
        <div className="space-y-2">
          {data.technicalInfo.map((info, index) => (
            <div key={index} className="flex gap-2">
              <input
                type="text"
                value={info}
                onChange={(e) => onTechnicalChange(index, e.target.value)}
                className="apple-field flex-1"
                placeholder={`Technical info ${index + 1}`}
              />
              {data.technicalInfo.length > 1 && (
                <button
                  type="button"
                  onClick={() => onRemoveTechnical(index)}
                  className="apple-btn-compact shrink-0 bg-[#ff453a]/90 px-4 text-white hover:bg-[#ff453a]"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={onAddTechnical}
            className="apple-btn-secondary apple-btn-compact w-full sm:w-auto"
          >
            + Add Technical Info
          </button>
        </div>
      </div>
    </>
  );
};
