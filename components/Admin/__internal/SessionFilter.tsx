interface SessionFilterProps {
  sessionId: string;
  onClear: () => void;
}

export const SessionFilter = ({ sessionId, onClear }: SessionFilterProps) => {
  return (
    <div className="apple-panel flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] text-[#a1a1a6]">
        Filtering by session:{" "}
        <span className="font-mono text-[#f5f5f7]">{sessionId}</span>
      </p>
      <button
        type="button"
        onClick={onClear}
        className="apple-btn-secondary apple-btn-compact self-start sm:self-auto"
      >
        Clear filter
      </button>
    </div>
  );
};
