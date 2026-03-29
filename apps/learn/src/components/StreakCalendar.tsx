import type { DailyActivity } from "@vocabulary/utils";

interface StreakCalendarProps {
  dailyActivity: Record<string, DailyActivity>;
  dailyGoal: number;
}

const DAYS_SHOWN = 28;

const getIntensityClass = (total: number, goal: number) => {
  if (total === 0) return "bg-gray-100";
  if (total >= goal) return "bg-indigo-600";
  if (total >= goal * 0.5) return "bg-indigo-400";
  return "bg-indigo-200";
};

export const StreakCalendar = ({ dailyActivity, dailyGoal }: StreakCalendarProps) => {
  const days = Array.from({ length: DAYS_SHOWN }, (_, i) => {
    const d = new Date(Date.now() - (DAYS_SHOWN - 1 - i) * 86400000);
    const key = d.toISOString().slice(0, 10);
    return { key, total: dailyActivity[key]?.total ?? 0 };
  });

  return (
    <div className="flex flex-col gap-2">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
        Activité (28 derniers jours)
      </p>
      <div className="grid grid-cols-7 gap-1">
        {days.map(({ key, total }) => (
          <div
            key={key}
            title={`${key} : ${total} carte${total !== 1 ? "s" : ""}`}
            className={`aspect-square rounded-sm transition-colors ${getIntensityClass(total, dailyGoal)}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Peu</span>
        <div className="w-3 h-3 rounded-sm bg-gray-100" />
        <div className="w-3 h-3 rounded-sm bg-indigo-200" />
        <div className="w-3 h-3 rounded-sm bg-indigo-400" />
        <div className="w-3 h-3 rounded-sm bg-indigo-600" />
        <span>Beaucoup</span>
      </div>
    </div>
  );
};
