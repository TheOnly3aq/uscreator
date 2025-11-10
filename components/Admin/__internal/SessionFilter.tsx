interface SessionFilterProps {
  sessionId: string;
  onClear: () => void;
}

export function SessionFilter({ sessionId, onClear }: SessionFilterProps) {
  return (
    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-blue-900 dark:text-blue-100">
          Filtering by session: <span className="font-mono">{sessionId}</span>
        </p>
      </div>
      <button
        onClick={onClear}
        className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
      >
        Clear filter
      </button>
    </div>
  );
}

