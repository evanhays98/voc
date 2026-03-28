import type { Lesson, CardProgress } from "@vocabulary/utils";

interface LessonCardProps {
  lesson: Lesson;
  progressByCard: Record<string, CardProgress>;
  onSelect: () => void;
}

export const LessonCard = ({ lesson, progressByCard, onSelect }: LessonCardProps) => {
  const allIds = lesson.cards.map((c) => c.id);
  const mastered = allIds.filter((id) => progressByCard[id]?.level === 5).length;
  const pct = Math.round((mastered / allIds.length) * 100);

  return (
    <button
      onClick={onSelect}
      className="group w-full text-left rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">
            {lesson.title}
          </h2>
          <p className="mt-1 text-sm text-gray-500">{lesson.description}</p>
        </div>
        <span className="shrink-0 text-sm font-medium text-indigo-600 bg-indigo-50 rounded-full px-3 py-1">
          {mastered}/{allIds.length}
        </span>
      </div>

      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </button>
  );
};
