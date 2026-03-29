import { useNavigate } from "react-router-dom";
import { ALL_LESSONS } from "../lessons";
import { useProgress } from "../store/progressStoreInstance";
import { useSettings } from "../store/settingsStoreInstance";
import { useCustomLessons } from "../store/customLessonsStoreInstance";
import { LessonCard } from "../components/LessonCard";
import { StreakBadge } from "../components/StreakBadge";
import { DailyGoalRing } from "../components/DailyGoalRing";
import { SrsGraph } from "../components/SrsGraph";
import { LuHand, LuZap, LuChartColumn, LuPencil } from "react-icons/lu";

export function LessonsPage() {
  const navigate = useNavigate();
  const progress = useProgress();
  const settings = useSettings();
  const customLessons = useCustomLessons();

  const allLessons = [...ALL_LESSONS, ...customLessons.lessons];
  const streak = progress.getStreak();
  const todayKey = new Date().toISOString().slice(0, 10);
  const todayDone = progress.dailyActivity[todayKey]?.total ?? 0;

  const totalDueNow = ALL_LESSONS.reduce((sum, lesson) => {
    const dueIds = lesson.cards.filter(
      (c) =>
        !progress.progressByCard[c.id] ||
        (progress.progressByCard[c.id].level < 5 &&
          progress.progressByCard[c.id].nextReviewAt <= Date.now())
    );
    return sum + dueIds.length;
  }, 0);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/70 backdrop-blur-md border-b border-white/60 px-6 py-5 shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-1.5">{greeting} <LuHand className="text-yellow-500" /></h1>
            <p className="text-sm text-gray-500">Que veux-tu apprendre aujourd'hui ?</p>
          </div>
          <div className="flex items-center gap-3">
            <StreakBadge streak={streak} size="sm" />
            <DailyGoalRing done={todayDone} goal={settings.dailyGoal} size={52} />
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Quick actions */}
        <div className="flex gap-3">
          <button
            onClick={() => navigate("/quick-review")}
            disabled={totalDueNow === 0}
            className={`flex-1 rounded-2xl border py-3.5 px-4 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              totalDueNow > 0
                ? "bg-indigo-600 border-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-200 active:scale-95"
                : "bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            <span className="flex items-center gap-1.5"><LuZap className="w-4 h-4" /> Révision rapide</span>
            {totalDueNow > 0 && (
              <span className="bg-white/25 rounded-full px-2 py-0.5 text-xs">
                {totalDueNow}
              </span>
            )}
          </button>
          <button
            onClick={() => navigate("/stats")}
            className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <span className="flex items-center gap-1.5"><LuChartColumn className="w-4 h-4" /> Stats</span>
          </button>
          <button
            onClick={() => navigate("/builder")}
            className="rounded-2xl border border-gray-200 bg-white/80 backdrop-blur-sm px-4 py-3.5 text-sm font-semibold text-gray-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
          >
            <span className="flex items-center gap-1.5"><LuPencil className="w-4 h-4" /> Créer</span>
          </button>
        </div>

        {/* Lesson list */}
        <div className="flex flex-col gap-4">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Mes leçons
          </h2>
          {allLessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              progressByCard={progress.progressByCard}
              onSelect={() => navigate(`/study/${lesson.slug}`)}
            />
          ))}
        </div>

        {/* SRS upcoming graph */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm p-6">
          <SrsGraph progressByCard={progress.progressByCard} />
        </div>
      </main>
    </div>
  );
}
