import React from "react";

/**
 * Renders markdown-formatted text with basic formatting
 */
export function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let currentList: React.ReactNode[] = [];
  let listType: "ul" | "ol" | null = null;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let orderedListCounter = 1;

  const flushList = () => {
    if (currentList.length > 0 && listType) {
      if (listType === "ul") {
        elements.push(
          <ul
            key={`list-${elements.length}`}
            className="list-disc ml-6 mb-2 text-zinc-900 dark:text-zinc-100"
          >
            {currentList}
          </ul>
        );
      } else {
        elements.push(
          <ol
            key={`list-${elements.length}`}
            className="list-decimal ml-6 mb-2 text-zinc-900 dark:text-zinc-100"
          >
            {currentList}
          </ol>
        );
      }
      currentList = [];
      listType = null;
      orderedListCounter = 1;
    }
  };

  lines.forEach((line, index) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      flushList();
      const content = line.slice(2, -2);
      elements.push(
        <div key={index} className="mb-2 mt-4 first:mt-0">
          <strong className="font-bold text-zinc-900 dark:text-zinc-100">
            {content}
          </strong>
        </div>
      );
    } else if (line.startsWith("**") && !line.endsWith("**")) {
      flushList();
      const boldEnd = line.indexOf("**", 2);
      if (boldEnd !== -1) {
        const boldText = line.slice(2, boldEnd);
        const restText = line.slice(boldEnd + 2);
        elements.push(
          <div key={index} className="mb-2 text-zinc-900 dark:text-zinc-100">
            <strong className="font-bold">{boldText}</strong> {restText}
          </div>
        );
      } else {
        elements.push(
          <div key={index} className="mb-2 text-zinc-900 dark:text-zinc-100">
            {line}
          </div>
        );
      }
    } else if (line.match(/^[-*]\s/)) {
      const content = line.replace(/^[-*]\s/, "");
      if (listType !== "ul") {
        flushList();
        listType = "ul";
      }
      currentList.push(
        <li key={`${index}-${currentList.length}`} className="mb-1">
          {content}
        </li>
      );
    } else if (line.match(/^\d+\.\s/)) {
      const content = line.replace(/^\d+\.\s/, "");
      if (listType !== "ol") {
        flushList();
        listType = "ol";
      }
      currentList.push(
        <li key={`${index}-${currentList.length}`} className="mb-1">
          {content}
        </li>
      );
      orderedListCounter++;
    } else if (line.trim() === "") {
      flushList();
      elements.push(<div key={index} className="h-2" />);
    } else {
      flushList();
      elements.push(
        <div key={index} className="mb-2 text-zinc-900 dark:text-zinc-100">
          {line}
        </div>
      );
    }
  });

  flushList();

  return <div>{elements}</div>;
}
