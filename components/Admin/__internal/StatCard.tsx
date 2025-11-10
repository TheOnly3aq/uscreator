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
export function StatCard({ title, value }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-800">
      <div className="text-sm font-medium text-zinc-600 dark:text-zinc-400 mb-1">
        {title}
      </div>
      <div className="text-3xl font-bold text-zinc-900 dark:text-zinc-100">
        {value.toLocaleString()}
      </div>
    </div>
  );
}

