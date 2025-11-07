"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserStoryData } from "@/types/userStory";
import { getCookie } from "@/utils/cookies";
import { PasswordGate } from "./UserStoryCreator/__internal/PasswordGate";
import { UserStoryForm } from "./UserStoryCreator/__internal/UserStoryForm";
import { UserStoryPreview } from "./UserStoryCreator/__internal/UserStoryPreview";

/**
 * Main user story creator component
 */
export function UserStoryCreator() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userStoryData, setUserStoryData] = useState<UserStoryData>({
    role: "",
    action: "",
    benefit: "",
    background: "",
    acceptanceCriteria: [""],
    technicalInfo: [""],
  });

  useEffect(() => {
    const cookie = getCookie();
    if (cookie === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  if (!isAuthenticated) {
    return <PasswordGate onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-2">
            User Story Creator
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Fill out the form below to create a user story
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <h2 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-zinc-100">
              Form
            </h2>
            <UserStoryForm data={userStoryData} onChange={setUserStoryData} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="bg-white dark:bg-zinc-900 rounded-lg shadow-lg p-6 border border-zinc-200 dark:border-zinc-800"
          >
            <UserStoryPreview data={userStoryData} />
          </motion.div>
        </div>
      </div>
    </div>
  );
}

