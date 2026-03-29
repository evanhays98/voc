import { FaFire } from "react-icons/fa";

interface StreakBadgeProps {
  streak: number;
  size?: "sm" | "md" | "lg";
}

export const StreakBadge = ({ streak, size = "md" }: StreakBadgeProps) => {
  if (streak === 0) return null;

  const sizeClasses = {
    sm: "text-sm px-2.5 py-1",
    md: "text-base px-3 py-1.5",
    lg: "text-lg px-4 py-2",
  };

  return (
    <div
      className={`flex items-center gap-1.5 rounded-full bg-orange-50 border border-orange-200 font-semibold text-orange-600 ${sizeClasses[size]}`}
    >
      <FaFire className="text-orange-500" />
      <span>{streak}</span>
      <span className="text-xs font-normal text-orange-500">
        {streak === 1 ? "jour" : "jours"}
      </span>
    </div>
  );
};
