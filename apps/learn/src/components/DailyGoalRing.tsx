interface DailyGoalRingProps {
  done: number;
  goal: number;
  size?: number;
}

export const DailyGoalRing = ({ done, goal, size = 64 }: DailyGoalRingProps) => {
  const strokeWidth = size < 48 ? 4 : 6;
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = Math.min(done / Math.max(goal, 1), 1);
  const strokeDashoffset = circumference - pct * circumference;
  const isDone = done >= goal;

  return (
    <div className="flex flex-col items-center gap-0.5">
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          className="stroke-gray-100"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          className={`transition-all duration-700 ${isDone ? "stroke-green-400" : "stroke-indigo-500"}`}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
        />
      </svg>
    </div>
  );
};
