"use client";

import { motion } from "framer-motion";
import { PasswordGate } from "./UserStoryCreator/__internal/PasswordGate";
import { UserStoryForm } from "./UserStoryCreator/__internal/UserStoryForm";
import { UserStoryPreview } from "./UserStoryCreator/__internal/UserStoryPreview";
import { History } from "./UserStoryCreator/__internal/History";
import { AICreation } from "./UserStoryCreator/__internal/AICreation";
import { useUserStoryCreator } from "./UserStoryCreator/useUserStoryCreator";

/**
 * Main user story creator: authentication, tabs, form, AI flow, and history.
 */
export function UserStoryCreator() {
  const {
    isAuthenticated,
    completePasswordLogin,
    isBootstrapping,
    isSaving,
    activeTab,
    setActiveTab,
    userStoryData,
    historyItems,
    setHistoryItems,
    aiPrompt,
    setAiPrompt,
    handleDataChange,
    handleTypeChange,
    handleClear,
    handleSaveToHistory,
    handleLoadStory,
    handleAIGenerate,
  } = useUserStoryCreator();

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={completePasswordLogin} />;
  }

  if (isBootstrapping) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-5 py-16">
        <p className="text-[15px] text-[#a1a1a6]" role="status">
          Loading your saved work…
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 py-14 sm:py-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 text-center sm:text-left"
        >
          <div className="mb-3 flex flex-col items-center justify-between gap-3 sm:flex-row sm:items-end">
            <h1 className="text-[34px] font-semibold leading-tight tracking-tight text-[#f5f5f7] sm:text-[40px]">
              User Story Creator
            </h1>
            {isSaving && (
              <span className="text-[13px] font-medium text-[#6e6e73]">
                Saving…
              </span>
            )}
          </div>
          <p className="mx-auto max-w-2xl text-[17px] leading-relaxed text-[#a1a1a6] sm:mx-0">
            Craft clear stories and bug reports with a focused, minimal editor.
          </p>
        </motion.div>

        <div
          className="uscreator-segment mb-4 flex w-full justify-center sm:inline-flex sm:w-auto"
          role="tablist"
          aria-label="Main sections"
        >
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "form"}
            onClick={() => {
              setActiveTab("form");
              localStorage.setItem("userstory_active_tab", "form");
            }}
            className={`uscreator-segment-btn flex-1 sm:flex-none ${
              activeTab === "form" ? "uscreator-segment-btn-active" : ""
            }`}
          >
            Form
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "ai"}
            onClick={() => {
              setActiveTab("ai");
              localStorage.setItem("userstory_active_tab", "ai");
            }}
            className={`uscreator-segment-btn flex-1 sm:flex-none ${
              activeTab === "ai" ? "uscreator-segment-btn-active" : ""
            }`}
          >
            AI Creation
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={activeTab === "history"}
            onClick={() => {
              setActiveTab("history");
              localStorage.setItem("userstory_active_tab", "history");
            }}
            className={`uscreator-segment-btn flex-1 sm:flex-none ${
              activeTab === "history" ? "uscreator-segment-btn-active" : ""
            }`}
          >
            History
          </button>
        </div>

        {activeTab === "form" ? (
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="uscreator-panel p-6 sm:p-8"
            >
              <h2 className="mb-6 text-[21px] font-semibold tracking-tight text-[#f5f5f7]">
                Form
              </h2>
              <UserStoryForm
                data={userStoryData}
                onChange={handleDataChange}
                onTypeChange={handleTypeChange}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="uscreator-panel p-6 sm:p-8"
            >
              <UserStoryPreview
                data={userStoryData}
                onClear={handleClear}
                onSaveToHistory={handleSaveToHistory}
              />
            </motion.div>
          </div>
        ) : activeTab === "ai" ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="uscreator-panel p-6 sm:p-8"
          >
            <AICreation
              prompt={aiPrompt}
              onPromptChange={setAiPrompt}
              onGenerate={handleAIGenerate}
            />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="uscreator-panel p-6 sm:p-8"
          >
            <History
              onLoadStory={handleLoadStory}
              items={historyItems}
              onItemsChange={setHistoryItems}
            />
          </motion.div>
        )}
      </div>
    </div>
  );
}
