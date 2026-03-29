import type { CardProgress } from "@vocabulary/utils";

interface SrsGraphProps {
  progressByCard: Record<string, CardProgress>;
}

const DAY_MS = 86400000;

export const SrsGraph = ({ progressByCard }: SrsGraphProps) => {
  const now = Date.now();
  const startOfToday = new Date().setHours(0, 0, 0, 0);

  const buckets = Array.from({ length: 7 }, (_, i) => {
    const dayStart = startOfToday + i * DAY_MS;
    const dayEnd = dayStart + DAY_MS;
    const count = Object.values(progressByCard).filter(
      (p) => p.level < 5 && p.nextReviewAt >= dayStart && p.nextReviewAt < dayEnd
    ).length;
    const label = i === 0 ? "Auj." : `+${i}j`;
    return { label, count };
  });

  const maxCount = Math.max(...buckets.map((b) => b.count), 1);

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Révisions à venir
      </p>
      <div className="flex items-end gap-2 h-16">
        {buckets.map(({ label, count }) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className="w-full rounded-t-sm bg-indigo-400 transition-all duration-500"
              style={{ height: `${(count / maxCount) * 100}%`, minHeight: count > 0 ? "4px" : "0" }}
            />
            <span className="text-xs text-gray-400">{count}</span>
          </div>
        ))}
      </div>
      <div className="flex items-end gap-2">
        {buckets.map(({ label }) => (
          <span key={label} className="flex-1 text-center text-xs text-gray-400">
            {label}
          </span>
        ))}
      </div>
      {/* Now marker for context */}
      <p className="text-xs text-gray-400 text-right">
        {Object.values(progressByCard).filter(
          (p) => p.level < 5 && p.nextReviewAt <= now
        ).length}{" "}
        dues maintenant
      </p>
    </div>
  );
};
