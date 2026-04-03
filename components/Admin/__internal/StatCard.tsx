interface StatCardProps {
  title: string;
  value: number;
}

/**
 * Stat card component for displaying statistics
 * @param {StatCardProps} props - Component props
 * @param {string} props.title - Title of the stat card
 * @param {number} props.value - Numeric value to display
 */
export const StatCard = ({ title, value }: StatCardProps) => {
  return (
    <div className="apple-panel p-6">
      <div className="mb-1 text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6e6e73]">
        {title}
      </div>
      <div className="text-[32px] font-semibold tabular-nums tracking-tight text-[#f5f5f7]">
        {value.toLocaleString()}
      </div>
    </div>
  );
};
