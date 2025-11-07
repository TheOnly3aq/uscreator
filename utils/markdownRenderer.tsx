import React from "react";

/**
 * Renders markdown-formatted text with basic formatting
 */
export function renderMarkdown(text: string): React.ReactNode {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    if (line.startsWith("**") && line.endsWith("**")) {
      const content = line.slice(2, -2);
      elements.push(
        <div key={index} className="mb-2 mt-4 first:mt-0">
          <strong className="font-bold text-zinc-900 dark:text-zinc-100">
            {content}
          </strong>
        </div>
      );
    } else if (line.startsWith("**") && !line.endsWith("**")) {
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
    } else if (line.startsWith("- ")) {
      const content = line.slice(2);
      elements.push(
        <div key={index} className="ml-4 mb-1 text-zinc-900 dark:text-zinc-100">
          - {content}
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={index} className="h-2" />);
    } else {
      elements.push(
        <div key={index} className="mb-2 text-zinc-900 dark:text-zinc-100">
          {line}
        </div>
      );
    }
  });

  return <div>{elements}</div>;
}
