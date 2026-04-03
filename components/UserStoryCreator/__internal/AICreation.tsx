"use client";

import { AnimatePresence } from "framer-motion";
import { UserStoryData } from "@/types/userStory";
import { StoryTypeSelect } from "./StoryTypeSelect";
import { AICreationThinPromptModal } from "./AICreationThinPromptModal";
import { useAICreation } from "../useAICreation";

type AICreationProps = {
  onGenerate: (data: UserStoryData) => void;
  prompt: string;
  onPromptChange: (value: string) => void;
};

/**
 * AI-assisted generation of a user story or bug report from a free-form prompt.
 */
export function AICreation({
  onGenerate,
  prompt,
  onPromptChange,
}: AICreationProps) {
  const {
    type,
    setType,
    isGenerating,
    error,
    showThinPromptModal,
    setShowThinPromptModal,
    isClearing,
    modalRef,
    handleGenerate,
    handleKeyDown,
    handleBypass,
    handleClearPrompt,
  } = useAICreation(prompt, onPromptChange, onGenerate);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-3 text-[21px] font-semibold tracking-tight text-[#f5f5f7]">
          AI Creation
        </h2>
        <p className="mb-8 text-[15px] leading-relaxed text-[#a1a1a6]">
          Describe what you want to create, and AI will generate a{" "}
          {type === "story" ? "user story" : "bug report"} for you.
        </p>
      </div>

      <div>
        <label
          id="ai-type-label"
          htmlFor="ai-type"
          className="mb-2 block text-[13px] font-semibold text-[#a1a1a6]"
        >
          Type
        </label>
        <StoryTypeSelect
          id="ai-type"
          listboxLabelledBy="ai-type-label"
          value={type}
          onChange={setType}
          disabled={isGenerating}
        />
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <label
            htmlFor="ai-prompt"
            className="block text-[13px] font-semibold text-[#a1a1a6]"
          >
            Prompt
          </label>
          {prompt && (
            <button
              type="button"
              onClick={() => void handleClearPrompt()}
              disabled={isClearing || isGenerating}
              className="rounded-full px-3 py-1 text-[12px] font-semibold text-[#ff6961] transition-colors hover:bg-[#ff453a]/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Clear prompt"
            >
              Clear
            </button>
          )}
        </div>
        <textarea
          id="ai-prompt"
          value={prompt}
          onChange={(e) => onPromptChange(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
          rows={6}
          className="uscreator-field min-h-[160px] resize-none disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={
            type === "story"
              ? "e.g., Users should be able to save their preferences so they don't have to reconfigure settings every time they visit the site"
              : "e.g., When users click the disabled filter button, they get redirected to an undefined page instead of seeing filtered results"
          }
        />
        <p className="mt-2 text-[12px] text-[#6e6e73]">
          Press ⌘/Ctrl + Enter to generate
        </p>
      </div>

      {error && (
        <div className="rounded-2xl border border-[#ff453a]/35 bg-[#ff453a]/10 p-4">
          <p className="text-[14px] text-[#ff9a93]">{error}</p>
        </div>
      )}

      <button
        type="button"
        onClick={() => void handleGenerate()}
        disabled={isGenerating || !prompt.trim()}
        className="uscreator-btn-primary w-full"
        aria-label="Generate user story with AI"
      >
        {isGenerating
          ? "Generating..."
          : `Generate ${type === "story" ? "User Story" : "Bug Report"}`}
      </button>

      <AnimatePresence mode="wait">
        {showThinPromptModal ? (
          <AICreationThinPromptModal
            key="thin-prompt"
            modalRef={modalRef}
            storyMode={type === "story"}
            isGenerating={isGenerating}
            onClose={() => setShowThinPromptModal(false)}
            onBypass={handleBypass}
          />
        ) : null}
      </AnimatePresence>
    </div>
  );
}
