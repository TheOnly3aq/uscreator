"use client";

import { RefObject } from "react";
import { motion } from "framer-motion";

type Props = {
  modalRef: RefObject<HTMLDivElement | null>;
  storyMode: boolean;
  isGenerating: boolean;
  onClose: () => void;
  onBypass: () => void;
};

export const AICreationThinPromptModal = ({
  modalRef,
  storyMode,
  isGenerating,
  onClose,
  onBypass,
}: Props) => {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        aria-hidden="true"
      />
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="uscreator-panel relative z-10 w-full max-w-md p-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-thin-prompt-title"
        aria-describedby="ai-thin-prompt-desc"
        tabIndex={-1}
      >
        <h2
          id="ai-thin-prompt-title"
          className="mb-3 text-[21px] font-semibold text-[#f5f5f7]"
        >
          Prompt Too Short
        </h2>
        <p
          id="ai-thin-prompt-desc"
          className="mb-6 text-[14px] leading-relaxed text-[#a1a1a6]"
        >
          Your prompt is too brief. Please provide more details about what you
          want to create. Include information about:
        </p>
        <ul className="mb-6 list-inside list-disc space-y-1 text-[14px] text-[#a1a1a6]">
          {storyMode ? (
            <>
              <li>Who the user is (role/persona)</li>
              <li>What they want to do (action)</li>
              <li>Why they want it (benefit/value)</li>
              <li>Any relevant context or background</li>
            </>
          ) : (
            <>
              <li>What the bug is (description)</li>
              <li>Steps to reproduce the issue</li>
              <li>Expected behavior</li>
              <li>Actual behavior</li>
            </>
          )}
        </ul>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onClose}
            className="uscreator-btn-primary flex-1"
            aria-label="Close modal"
          >
            Got it
          </button>
          <button
            type="button"
            onClick={onBypass}
            disabled={isGenerating}
            className="uscreator-btn-danger uscreator-btn-compact flex-1 disabled:cursor-not-allowed disabled:opacity-50"
            aria-label="Bypass prompt validation and generate anyway"
          >
            Bypass
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
