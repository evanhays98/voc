import type { Lesson, CardProgress } from "@vocabulary/utils";
import { getLessonColorConfig } from "../lessons/lessonColors";

interface LessonCardProps {
  lesson: Lesson;
  progressByCard: Record<string, CardProgress>;
  onSelect: () => void;
}

export const LessonCard = ({ lesson, progressByCard, onSelect }: LessonCardProps) => {
  const allIds = lesson.cards.map((c) => c.id);
  const mastered = allIds.filter((id) => progressByCard[id]?.level === 5).length;
  const pct = Math.round((mastered / allIds.length) * 100);
  const colors = getLessonColorConfig(lesson.color);
  const dueCount = allIds.filter(
    (id) =>
      !progressByCard[id] ||
      (progressByCard[id].level < 5 && progressByCard[id].nextReviewAt <= Date.now())
  ).length;

  return (
    <button
      onClick={onSelect}
      className={`group w-full text-left rounded-2xl border ${colors.border} bg-white/80 backdrop-blur-sm px-6 py-5 shadow-sm ${colors.hoverBorder} hover:shadow-lg hover:bg-white transition-all`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {lesson.emoji && (
            <span className="text-2xl mt-0.5">{lesson.emoji}</span>
          )}
          <div>
            <h2 className={`text-lg font-semibold text-gray-900 group-hover:${colors.text} transition-colors`}>
              {lesson.title}
            </h2>
            <p className="mt-0.5 text-sm text-gray-500">{lesson.description}</p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <span className={`text-sm font-medium ${colors.text} ${colors.light} rounded-full px-3 py-0.5`}>
            {mastered}/{allIds.length}
          </span>
          {dueCount > 0 && (
            <span className="text-xs text-orange-600 bg-orange-50 rounded-full px-2 py-0.5">
              {dueCount} dues
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${colors.gradient} transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
};
